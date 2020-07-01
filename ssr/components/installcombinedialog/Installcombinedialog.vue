<template>
<transition name="fade">
  <div @click.self="handleHideCombine" class="dialog-box">
    <div class="dialog-container vertical-center">
      <button @click="handleHideCombine" class="close" title="关闭"><i class="icon iconfont icon-Close-box-px"></i></button>
      <div class="head clr">
        <button class="install-btn" @click="handleKeyInstall" :style="{'cursor': (installed && isXb || installing)  ? 'not-allowed' : 'pointer'}"
          :class="(installed && isXb || installing) ? 'button-blue-low' : 'button-blue'">{{isXb ? (installed ? '已安装' :
          (!installing ? '一键安装' : '安装中...') ) : '请安装小白'}}</button>
        <div class="logo" :style="{'background-image': 'url('+ detail.logo_url +')'}">
          <div class="install-mask" v-show="installMaskFlag" :style="{'background-image': 'url('+installmask+')','transform': installMaskScaleFlag ? 'scale(1.3)' : 'scale(1)' }">
            <div class="install-pieChart" :id="detail._id">
              <canvas :id="detail._id + 'canvas'" width="78" height="78"></canvas>
            </div>
          </div>
        </div>
        <div class="detail">
          <h3>{{detail.title}}</h3>
          <div class="app-info">
            <span>数量：{{detail.plug_list && detail.plug_list.length}}</span><!-- &ensp;/&ensp;
            <span> 更新：{{detail.udate}}</span> --><!-- &ensp;/&ensp;
            <span> 安装：{{detail.download_count}}</span> -->
          </div>
          <p :title="detail.brief">{{detail.brief}}</p>
        </div>
      </div>
      <div class="div-line"></div>
      <div class="main scroll">
        <div class="recommend-box">
          <ul class="recommend-items clr">
            <li class="recommend-item" v-for="item in detail.plug_list" :key="item.appid">
              <Extension :installedIDData="installedIDData" fromWhere="combine" :detail="item"></Extension>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  

</transition>
</template>

<script>
const installmask = require('~/static/img/installmask.png')
import Extension from '../extension';
import {checkBrowserVersion} from '@/libs/util'
import {mapState} from 'Vuex'
export default {
  props: ['detail'],
  data() {
    return {
      installmask,
      ctx: null,
      canvasID: '',
      maskID: '',
      once: true,
      installed: false,
      installedIDData_: [],
      notInstallData: [],
      nowInstallingData: [],
      installing: false,
      installMaskFlag: false,
      installMaskScaleFlag: false,
      count: 0,
      color: "rgba(51,51,51,.7)",
      timer_s: null,
      timer_q: null,
      timer_out_s: null,
      timer_out_q: null,
      drawFlag: false,
      randomStopNum: 0,
      stapNum: 0,
      stopCount: 0
    }
  },
  computed:{
    ...mapState('main', ['isXb','installedIDData', 'installingData'])
  },
  components: {
    Extension
  },
  watch:{
    installedIDData(val){
      this.installedIDDataFn(val);
    }
  },
  mounted() {
    this.installedIDDataFn(this.installedIDData);
  },
  created() {
    this.canvasID = this.detail._id + 'canvas';
    this.maskID = this.detail._id;
    this.randomStopNum = 50 + 6 * Math.random();
    this.stopCount = this.randomStopNum;
  },
  methods: {
    installedIDDataFn(res){
      let plug_list = this.detail.plug_list;
      this.installedIDData_ = [];
      for (var i = 0, len = res.length; len > i; i++) {
        this.installedIDData_.push(res[i].id);
      }
      this.notInstallData = plug_list.filter((item, index)=>{
        return this.installedIDData_.indexOf(item.appid) === -1;
      });
      if(this.installing  && this.once){
        this.once = false;
        this.stapNum = (100 - this.stopCount) / (this.notInstallData.length + 1);
      }

      if(this.installing  && this.nowInstallingData.some((item)=>{return this.installedIDData_.indexOf(item) !== -1}) ){
        this.stopCount += this.stapNum;
        this.q();
      }
      for (var i = 0, len = plug_list.length; len > i; i++) {
        if (this.installedIDData_.indexOf(plug_list[i].appid) === -1) {
          this.installed = false;
          return;
        }
      }
      this.installed = true;
      this.installing = false;
      this.once = true;
    },
    handleHideCombine() {
      this.$emit('event_hide_combine_dialog');
    },
    handleKeyInstall() {
      if (this.isXb && !this.installed && !this.installing) {
        this.installing = true;
        this.installMaskFlag = true;
        this.stopCount = this.randomStopNum;
        this.draw();
        this.s();
        let plug_list = this.detail.plug_list;
        this.nowInstallingData = [];
        this.installedIDData_ = this.installedIDData.map((item)=>{ return item.id; });
        
        for (var i = 0, len = plug_list.length; len > i; i++) {
          if (this.installedIDData_.indexOf(plug_list[i].appid) === -1) {
            this.nowInstallingData.push(plug_list[i].appid);

            let store_ = {...plug_list[i],count:0};
            this.$store.dispatch('main/addInstallingData',store_);
            this.$store.dispatch('main/downloadExtension',plug_list[i].app_url);
            
          }
        }
        
      } else if (!this.isXb) {
        window.open('http://www.minibai.com/', '_blank');
      }
    },
    s() {
      clearInterval(this.timer_s);
      this.timer_s = setInterval(this.sFn, 32)
    },
    sFn() {
      let randomNum = 0.15 + .05 * Math.random();
      this.count += randomNum; // .2 * 500       0 ~ .6
      if (randomNum > .19) {
        clearInterval(this.timer_s);
        clearTimeout(this.timer_out_s);
        this.timer_out_s = setTimeout(() => {
          this.timer_s = setInterval(this.sFn, 36)
        }, 100)
        return false;
      } else if (randomNum < .16 && randomNum >= .15) {
        clearInterval(this.timer_s);
        clearTimeout(this.timer_out_s);
        this.timer_out_s = setTimeout(() => {
          this.timer_s = setInterval(this.sFn, 32)
        }, 80)
        return false;
      }
      if (this.count > this.randomStopNum) {
        clearTimeout(this.timer_out_s);
        clearInterval(this.timer_s)
        return false;
      }
      this.pieChart();
    },
    q() {
      clearTimeout(this.timer_out_s);
      clearInterval(this.timer_s)
      clearInterval(this.timer_q);
      clearTimeout(this.timer_out_q);
      this.timer_q = setInterval(()=>{
        this.qFn()
      }, 4) //time *  500 = 2.5, 50 * 500 = 25000
    },
    qFn() {
      let randomNum = .6 * Math.random();
      this.count += randomNum; // .2 * 500       0 ~ .6
      if (randomNum < .01) {
        clearInterval(this.timer_q);
        clearTimeout(this.timer_out_q);
        this.timer_out_q = setTimeout(() => {
          this.timer_q = setInterval(()=>{
            this.qFn()
          }, 4)
        }, 40)
        return false;
      }
      if (this.count > 100 ) {
        clearInterval(this.timer_q);
        clearTimeout(this.timer_out_q);
        this.count = 0;
        this.stopCount = this.randomStopNum;
        this.installMaskScaleFlag = true;
        setTimeout(() => {
          this.installMaskScaleFlag = false;
          this.installMaskFlag = false;
          this.ctx.translate(-39, -39);
        }, 200)

        return false;
      }

      if (this.count > this.stopCount && this.count <= 100 ) {
        clearInterval(this.timer_q);
        clearTimeout(this.timer_out_q);

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
      let start = Math.PI * 1.5;//起始角度
      let end = Math.PI * 1.5;//终止角度
      ctx.clearRect(-39,-39, 78, 78);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      end +=  ((this.count ? this.count : 1) / 100) * Math.PI * 2; 
      ctx.strokeStyle = "rgba(0,0,0,0)";
      ctx.fillStyle = this.color;
      ctx.arc(0, 0, 39, start, end, true);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    }
  }
}
</script>
<style lang="less" scoped>
  @color3: #666;

  .dialog-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    z-index: 9998;
    background: rgba(0, 0, 0, .4);

    .dialog-container {
      width: 880px;
      height: 650px;
      padding: 20px;
      border-radius: 2px;
      box-sizing: border-box;
      background: #fff;
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
    position: relative;
    width: 114px;
    height: 114px;
    float: left;
    margin-right: 28px;
    border-radius: 5px;
    background-repeat: no-repeat;
    background-size: cover;
    overflow: hidden;
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
    height: 450px;
    margin: 20px -14px 0 0;
    overflow-y: auto;

    .pic_url {
      width: 800px;
      height: 300px;
      margin-bottom: 16px;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .detail-info {
      width: 800px;
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

  .shadow {
    height: 1px;
    box-shadow: 0 -10px 30px red;
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
    box-shadow: 0 10px 40px #c7e4f7, -40px 0 40px #e7f1f7;
  }

  .recommend-box {
    position: relative;

    .recommend-title {
      height: 66px;
      line-height: 66px;
      font-size: 18px;
    }

    .recommend-switch {
      position: absolute;
      width: 80px;
      height: 34px;
      right: 0;
      top: 16px;
      font-size: 12px;
      color: #000;
      background: #eee;
    }

    .recommend-item {
      float: left;
      margin: 0 2px 16px 0;
    }
  }
</style>
