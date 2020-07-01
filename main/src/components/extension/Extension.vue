<template>
  <div class="box" :data-from="fromWhere">
    <Installdialog :installedIDData="installedIDData" :fromWhere="fromWhere" @event_hide_install_dialog="handleHideInstallDidlog" v-show="installdialogFlag" :installdialogFlag="installdialogFlag" :isInstalling="switchDrawFlag" :detail="installDetailData" :key="installDetailData._id"></Installdialog>
    <!-- <div class="logo" :style="{'background-image': 'url('+detail.logo_url+')'}"></div> -->
    <img class="logo" :src="detail.logo_url" :style="{'background-color': '#eee'}" @load="imgFn($event)" />
    <div class="detail">
      <h4>{{detail.name}}</h4>
      <p>{{detail.brief}}</p>
      <p>版本：{{detail.version}}</p>
    </div>
    <div class="install" @click.self="handleToDetail">
      <button @click="handleInstall"  class="install-btn" :class="(installed && isXb || installing) ? 'button-blue-low' : 'button-blue'">{{isXb ? (installed ? '已安装' : (!installing ? '立即安装' : '安装中...')) : '请安装小白'}}</button>
    </div>
  </div>
</template>
<script>
import Installdialog from '@c/installdialog'
import bg from '@s/img/bg.png'

import {checkBrowserVersion, setLocationHash} from '@/libs/util'
export default {
  props:['detail','fromWhere', 'installedIDData'],
  components: {
    Installdialog
  },
  data(){
    return {
      installed: false,
      installing: false,
      curInstallingData:null,
      hideDialogFlag:false,
      installdialogFlag: false,
      installDetailData: null,
      switchDrawFlag: false,
      bg
    }
  },
  created(){
    this.curInstallingData = this.installingData;
    this.installDetailData = this.detail;
  },
  mounted(){
    this.installedIDDataFn(this.installedIDData);
  },
  watch:{
    curInstallingData(val_,oldVal_){
      let index_ = val_.indexOf(this.detail.appid);
      this.installing = index_ !== -1 ? true : false;
    },
    installedIDData(val){
      this.installedIDDataFn(val);
    }
  },
  methods:{
    installedIDDataFn(res){
      let index_ = this.installingData.indexOf(this.detail.appid);
      for(var i=0,len=res.length;len>i;i++){
        if(res[i].id === this.detail.appid){
          this.installed = true;
          this.installing = false;
          index_ !== -1 ? this.installingData.splice(index_,1) : null;
          return;
        }
      }
      this.installed = false;
    },
    imgFn(ev){
      let target = ev.target;
      target.style.backgroundColor = 'transparent';
    },
    handleToDetail(){
      setLocationHash('id', this.detail._id);
      this.switchDrawFlag = !this.switchDrawFlag;
    },
    handleInstall(){
      if(this.isXb && !this.installed && !this.installing){
        this.installing = true;
        this.installingData.push(this.detail.appid);
        // chrome.xb.switchToExtensionManager(this.detail.app_url,1);
        
        if(checkBrowserVersion([10,1,2713,1466])){
          chrome.xb.openUrl(this.detail.app_url, -3, false);
        }else{
          chrome.xb.switchToExtensionManager(this.detail.app_url,1);
        }
      }else if(this.isXb && (this.installed || this.installing)){
        this.handleToDetail();
      }else if(!this.isXb){
        window.open('http://www.minibai.com/','_blank');
      }
    },
    handleHideInstallDidlog(bool) {
      this.installdialogFlag = bool;
    }
  }
}
</script>
<style lang="less" scoped>
@color2: #999;
  .box{
    position: relative;
    width: 276px;
    height: 100px;
    padding: 16px;
    box-sizing: border-box;
    user-select: none;
    &:hover{
      background-color: #eff4f7;
      .install{
        display: block;
      }
    }
    .logo{
      position: relative;
      width: 68px;
      height: 68px;
      float: left;
      border-radius: 5px;
      background-repeat: no-repeat;
      background-size: cover;
      &::after {
        content: "";
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: url('../../static/img/bg.png') no-repeat center;
        background-size: cover;
      }
    }
    .detail{
      margin-left: 12px;
      float: left;
      >h4,>p,>span{
        width: 164px;
        line-height: 24px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      >p,>span{
        font-size: 12px;
        color: @color2;
      }
    }
    .install{
      display: none;
      position: absolute;
      top:0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      cursor:pointer;
      .install-btn{
        width: 80px;
        height: 34px;
        position: absolute;
        left: 180px;
        top: 34px;
        line-height: 34px;
        text-align: center;
        font-size: 12px;
        color: #fefefe;
        border-radius: 2px;
        box-shadow: 0 10px 40px #c7e4f7,-40px 0 40px #e7f1f7;
      }
    }
  }
</style>
