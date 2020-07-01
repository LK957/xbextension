<template>
<transition name="fade">
  <div @click.self="handleHideInstallDialog" class="dialog-box">
    <div class="dialog-container vertical-center"><span></span>
        <!-- <div class="shadow"></div> -->
      <button @click="handleHideInstallDialog" class="close" title="关闭"><i class="icon iconfont icon-Close-box-px"></i></button>
      <div class="head clr">
        <a @click="handleInstall" target="_blank" src="javascript:;" class="install-btn" :style="{'cursor': (installed && isXb || installing)  ? 'not-allowed' : 'pointer'}"
          :class="(installed && isXb || installing) ? 'button-blue-low' : 'button-blue'">
          {{isXb ? (installed ? '已安装' : (!installing ? '立即安装' : '安装中...')) : '请安装小白'}}

        </a>
        <div class="logo" :style="{'background-image': 'url('+detail.logo_url+')'}">
          <div class="install-mask" v-show="installMaskFlag" :style="{'background-image': 'url('+installmask+')','transform': installMaskScaleFlag ? 'scale(1.3)' : 'scale(1)' }">
            <div class="install-pieChart" :id="detail.appid + fromWhere">
              <canvas :id="detail.appid + fromWhere + 'canvas'" width="78" height="78"></canvas>
            </div>
          </div>

        </div>
        <div class="detail">
          <h3>{{detail.name}}</h3>
          <div class="app-info">
            <!-- <span>开发者：{{detail.developer}}</span>&ensp;/&ensp; -->
            <span> 版本：{{detail.version}}</span><!-- &ensp;/&ensp; -->
            <!-- <span> 更新：{{detail.udate}}</span>&ensp;/&ensp;
            <span> 安装：{{detail.download_count}}</span> -->
          </div>
          <p :title="detail.brief">{{detail.brief}}</p>
        </div>
      </div>
      <div class="div-line"></div>
      <div class="main scroll" v-if="installdialogFlag">
        <div class="pic_url">
          <img :src="detail.pic_url" alt="">
        </div>
        <div class="detail-info" v-html="detail.detail">{{detail.detail}}</div>
      </div>
    </div>
  </div>
</transition>
</template>
<style lang="less" scoped>
  @color3: #666;

  .dialog-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    z-index: 99999;
    background: rgba(0, 0, 0, .4);

    .dialog-container {
     // position: relative;
      width: 880px;
      height: 650px;
      padding: 20px;
      border-radius: 2px;
      box-sizing: border-box;
      background-color: #fff;
    
      /* .shadow{
        position: absolute;
        width: 100%;
        height: 40px;
        left: 0;
        bottom: 20px;
        background: url('../../static/img/12321.png') repeat-x bottom;
        z-index: 99999999999;
      } */
    }

    .head {
      margin-bottom: 20px;
    }

    .div-line {
      height: 1px;
      margin: 0 -20px;
      background: #eee;
    }

    .close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
    }
  }

  .logo {
    width: 114px;
    height: 114px;
    position: relative;
    float: left;
    margin-right: 28px;
    border-radius: 5px;
    overflow: hidden;
    background-repeat: no-repeat;
    background-size: cover;

    .install-mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      transition: all .3s;
      z-index: 2;
    }

    .install-pieChart {
      position: absolute;
      width: 78px;
      height: 78px;
      top: 18px;
      left: 18px;
      z-index: 3;
      border-radius: 50%;
    }
  }

  .main {
    position: relative;
    height: 450px;
    margin: 20px -14px 0 0;
    overflow-y: auto;
      
    .pic_url {
      width: 840px;
      height: 300px;
      margin-bottom: 16px;
      text-align: center;
      & > img{
        height: 100%;
      }
    }

    .detail-info {
      width: 840px;
      line-height: 30px;
      font-size: 14px;
      color: @color3;
    }
  }

  .detail {
    &>h3 {
      line-height: 24px;
      font-size: 24px;
    }

    &>p {
      font-size: 14px;
      line-height: 24px;
    }

    .app-info {
      line-height: 44px;
      font-size: 12px;
      color: @color3;
    }
  }

  .install-btn {
    width: 160px;
    height: 48px;
    position: absolute;
    right: 40px;
    top: 34px;
    line-height: 48px;
    text-align: center;
    font-size: 16px;
    border-radius: 2px;
    color: #fff;
    box-shadow: 0 10px 40px #c7e4f7, -40px 0 40px #e7f1f7;
  }
</style>
<script>
import installmask from '@s/img/installmask.png'
import {checkBrowserVersion, getLocationHash, setLocationHash} from '@/libs/util'
export default { 
  props: ['detail','isInstalling','fromWhere','installdialogFlag', 'installedIDData'],
  data() {
    return {
      ctx: null,
      installed: false,
      installMaskFlag: false,
      installMaskScaleFlag: false,
      installing: false,
      curInstallingData: null,
      installmask,
      canvasID: '',
      maskID: '',
      count: 0,
      randomStopNum: 0,
      color: "rgba(51,51,51,.7)",
      timer_s: null,
      timer_q: null,
      timer_out_s: null,
      timer_out_q: null,
      drawFlag: false
    }
  },
  created() {
    this.randomStopNum = 92 + 6 * Math.random();
    this.canvasID = this.detail.appid + this.fromWhere + 'canvas';
    this.maskID = this.detail.appid + this.fromWhere;
    this.curInstallingData = this.installingData;
    let index_ = this.curInstallingData.indexOf(this.detail.appid);
    this.installing = index_ !== -1 ? true : false;
    if (this.installing && !this.drawFlag) {
      this.installMaskFlag = true;
      this.drawFlag = true;
      this.draw();
      this.s();
      /* this.pieChartCallback(this.maskID, this.canvasID, this.installing); */
    }
    const id = getLocationHash('id');
    console.log(999,id);
    
    if(id === this.detail._id){
      this.$emit('event_hide_install_dialog', true);
    }
    //this.installing = this.isInstalling;pimfkfcjbgcdbnglhncjpdpifinkjjge
  },
  watch: {
    curInstallingData(val_, oldVal_) {
      let index_ = val_.indexOf(this.detail.appid);
      this.installing = index_ !== -1 ? true : false;
      if (this.installing && !this.drawFlag) {
        this.installMaskFlag = true;
        this.drawFlag = true;
        this.draw();
        this.s();
        /* this.pieChartCallback(this.maskID, this.canvasID, this.installing); */
      }
    },
    isInstalling(val_,oldVal_){
      //console.log(val_,oldVal_,this.installing,this.drawFlag)
      if (this.installing && !this.drawFlag) {
        this.installMaskFlag = true;
        this.drawFlag = true;
        this.draw();
        this.s();
        /* this.pieChartCallback(this.maskID, this.canvasID, this.installing); */
      }
      if(this.installed && this.installMaskFlag){
        this.q();
      }
    },
    installed(val,val_){
      if(this.installed && this.installMaskFlag){
        this.q();
      }
    },
    installedIDData(val){
      this.installedIDDataFn(val);
    },
    '$route' (to, from) {
      const id = getLocationHash('id');
      const bool = id === this.detail._id;
      this.$emit('event_hide_install_dialog', bool);
    }
  },
  mounted() {
    this.installedIDDataFn(this.installedIDData);
  },
  methods: {
    installedIDDataFn(res){
      let index_ = this.installingData.indexOf(this.detail.appid);
      for (let i = 0, len = res.length; len > i; i++) {
        if (res[i].id === this.detail.appid) {
          this.installed = true;
          if(this.installing){
            this.q();
          }
          this.installing = false;
          index_ !== -1 ? this.installingData.splice(index_, 1) : null;
          return;
        }
      }
      this.installed = false;
      this.drawFlag = false;
    },
    handleHideInstallDialog() {
      setLocationHash('id', '');
      this.$emit('event_hide_install_dialog', false);
    },
    handleInstall() {
      if (this.isXb && !this.installed && !this.installing) {
        //console.log('直接安装')
        this.installing = true;
        this.installMaskFlag = true;
        /* this.pieChartCallback(this.maskID, this.canvasID, this.installing); */
        this.draw();
        this.s();
        this.drawFlag = true;
        this.installingData.push(this.detail.appid);
        // 
        
        if(checkBrowserVersion([10,1,2713,1466])){
          chrome.xb.openUrl(this.detail.app_url, -3, false);
        }else{
          chrome.xb.switchToExtensionManager(this.detail.app_url, 1);
        }
      } else if (!this.isXb) {
        window.open('http://www.minibai.com/', '_blank');
      }

    },
    s() {
      clearTimeout(this.timer_out_s);
      clearInterval(this.timer_s)
      this.timer_s = setInterval(this.sFn, 32)
    },
    q() {
      clearTimeout(this.timer_out_s);
      clearInterval(this.timer_s)
      clearInterval(this.timer_q);
      this.timer_q = setInterval(this.qFn, 4) //time *  500 = 2.5, 50 * 500 = 25000
    },
    qFn() {
      let randomNum = .6 * Math.random();
      this.count += randomNum; // .2 * 500       0 ~ .6
      if (randomNum < .01) {
        clearInterval(this.timer_q);
        clearTimeout(this.timer_out_q);
        this.timer_out_q = setTimeout(() => {
          this.timer_q = setInterval(this.qFn, 4)
        }, 40)
        return false;
      }
      if (this.count > 100) {
        clearInterval(this.timer_q);
        clearTimeout(this.timer_out_q);
        this.count = 0;
        this.installMaskScaleFlag = true;
        setTimeout(()=>{
          this.installMaskScaleFlag = false;
          this.installMaskFlag = false;
          this.ctx.translate(-39, -39);
        },200)
        
        return false;
      }
      this.pieChart();
    },
    draw() {
      let can1 = document.getElementById(this.canvasID);
      this.ctx = can1.getContext("2d");
      this.ctx.translate(39, 39);
      this.pieChart();
    },
    pieChart() {
      let ctx = this.ctx;
      let start = Math.PI * 1.5;
      let end = Math.PI * 1.5;
      //let count = 90;
      ctx.clearRect(-39,-39,78,78);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      end += ((this.count ? this.count : 1) / 100) * Math.PI * 2; //终止角度
      ctx.strokeStyle = "rgba(0,0,0,0)";
      ctx.fillStyle = this.color;
      ctx.arc(0, 0, 39, start, end, true);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    },
    sFn() {
      let randomNum = .6 * Math.random();
      if (this.count > this.randomStopNum) {
        clearTimeout(this.timer_out_s);
        clearInterval(this.timer_s);
        this.pieChart();
        return false;
      }else{
        if (randomNum < .01) {
          clearInterval(this.timer_s);
          clearTimeout(this.timer_out_s);
          this.timer_out_s = setTimeout(() => {
            this.timer_s = setInterval(this.sFn, 32)
          }, 100)
          return false;
        } else if (randomNum < .06 && randomNum >= .05 || randomNum < .56 && randomNum >= .53) {
          clearInterval(this.timer_s);
          clearTimeout(this.timer_out_s);
          this.timer_out_s = setTimeout(() => {
            this.timer_s = setInterval(this.sFn, 28)
          }, 80)
          return false;
        }
      }
      this.count += randomNum; // .2 * 500       0 ~ .6
      
      this.pieChart();
    }
  }
}
</script>