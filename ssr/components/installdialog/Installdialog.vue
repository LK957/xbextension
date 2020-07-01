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
        <div class="logo" :style="{'background-image': 'url('+detailData.logo_url+')'}">
          <div class="install-mask" v-show="installMaskFlag" :style="{'background-image': 'url('+installmask+')','transform': installMaskScaleFlag ? 'scale(1.3)' : 'scale(1)' }">
            <div class="install-pieChart" :id="detailData.appid + fromWhere">
              <canvas ref="drawpie" id="drawpie" width="78" height="78"></canvas>
            </div>
          </div>

        </div>
        <div class="detail">
          <h3>{{detailData.name}}</h3>
          <div class="app-info">
            <!-- <span>开发者：{{detailData.developer}}</span>&ensp;/&ensp; -->
            <span> 版本：{{detailData.version}}</span><!-- &ensp;/&ensp; -->
            <!-- <span> 更新：{{detailData.udate}}</span>&ensp;/&ensp;
            <span> 安装：{{detailData.download_count}}</span> -->
          </div>
          <p :title="detailData.brief">{{detailData.brief}}</p>
        </div>
      </div>
      <div class="div-line"></div>
      <div class="main scroll">
        <div class="pic_url">
          <img :src="detailData.pic_url" alt="">
        </div>
        <div class="detail-info" v-html="detailData.detail">{{detailData.detail}}</div>
      </div>
    </div>
  </div>
</transition>
</template>
<script lang="ts">
import Vue from 'vue';
import {mapState} from 'Vuex';
import {PieChart} from '@/libs/util';
const installmask = require('@/static/img/installmask.png');
  
interface Data{

}
import {checkBrowserVersion} from '@/libs/util'
export default Vue.extend({ 
  props: ['fromWhere'],
  data() {
    return {
      ctx: null,
      installed: false,
      installMaskFlag: false,
      installMaskScaleFlag: false,
      installing: false,
      installmask,
      count: 0,
      randomStopNum: 0,
      color: "rgba(51,51,51,.7)",
    }
  },
  computed:{
    ...mapState('main',['isXb','countRender_','detailData', 'installedIDData', 'installingData'])
  },
  created() {
    console.log('installingData-----',this.installingData);
  },
  watch: {
    countRender_(val){
      const {appid, count} = val;
      if(appid !== this.detailData.appid) return;
      console.log('dispatch_-----',appid, count);
      if(count === 0){
        this.installMaskFlag = false;
      }
      if(count) this.pieChart(count);
      
    },
    installedIDData(val){
      this.initInstallStatus(val);
    }
  },
  mounted() {
    this.initDraw();
    this.initInstallStatus(this.installedIDData);
    this.installing = this.detailData.appid in this.installingData;
    if (this.installing) {
      this.installMaskFlag = true;
      const count = this.installingData[this.detailData.appid].count;
      if(count)this.pieChart(count);
    }
  },
  methods: {
    initDraw() {
      let canvas:any = this.$refs.drawpie ||  document.getElementById('drawpie');
      let ctx = canvas.getContext("2d");
      ctx.translate(39, 39);
      this.ctx = ctx;
    },
    pieChart(count:number) {
      if(!this.ctx) return;
      let ctx:any = this.ctx;
      let start = Math.PI * 1.5;
      let end = Math.PI * 1.5;
      ctx.clearRect(-39,-39,78,78);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      end += ((count ? count : 1) / 100) * Math.PI * 2; //终止角度
      ctx.strokeStyle = "rgba(0,0,0,0)";
      ctx.fillStyle = this.color;
      ctx.arc(0, 0, 39, start, end, true);
      ctx.closePath();
      ctx.stroke();
      ctx.fill();
    },
    initInstallStatus(res:any){
      for (let i = 0, len = res.length; len > i; i++) {
        if (res[i].id === this.detailData.appid) {
          this.installed = true;
          this.installing = false;
          return;
        }
      }
      this.installed = false;
    },
    handleHideInstallDialog() {
      const appid = this.detailData.appid;
      this.$store.commit('main/setDetailData',{});
    },
    handleInstall() {
      if (this.isXb && !this.installed && !this.installing) {
        this.installing = true;
        this.installMaskFlag = true;
        let store_ = {...this.detailData,count:0};
        this.$store.dispatch('main/addInstallingData',store_);
        
        this.$store.dispatch('main/downloadExtension',this.detailData.app_url);
      } else if (!this.isXb) {
        window.open('http://www.minibai.com/', '_blank');
      }
    },
  }
})
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
