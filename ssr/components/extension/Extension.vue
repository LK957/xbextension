<template>
  <div class="box" :data-from="fromWhere">
    <img class="logo" :src="detailData.logo_url" :style="{'background-color': '#eee'}" @load="imgFn($event)" />
    <div class="detail">
      <h4>{{detailData.name}}</h4>
      <p>{{detailData.brief}}</p>
      <p>版本：{{detailData.version}}</p>
    </div>
    <div class="install" @click.self="handleToDetail">
      <button @click="handleInstall"  class="install-btn" :class="(installed && isXb || installing) ? 'button-blue-low' : 'button-blue'">{{isXb ? (installed ? '已安装' : (!installing ? '立即安装' : '安装中...')) : '请安装小白'}}</button>
    </div>
  </div>
</template>
<script lang="ts">
const bg = require('@/static/img/bg.png');

import Vue from 'vue';
import {mapState} from 'Vuex'
import {checkBrowserVersion} from '@/libs/util'
interface Data{
  [propName: string]: any
}
export default Vue.extend({
  props:['detail','fromWhere'],
  data():Data{
    return {
      installed: false,
      installing: false,
      installdialogFlag: false,
      bg,
    }
  },
  computed:{
    ...mapState('main', ['isXb','installedIDData', 'installingData', 'countRender_'])
  },
  created(){
    this.detailData = this.detail;
    this.installing = this.detailData.appid in this.installingData;
  },
  mounted(){
    this.installedIDDataFn(this.installedIDData);
  },
  watch:{
    countRender_(val){
      const {appid, count} = val;
      if(appid !== this.detailData.appid) return;
      this.installing = !!count;
    },
    installedIDData(val){
      this.installedIDDataFn(val);
    }
  },
  methods:{
    installedIDDataFn(res:any){
      for(var i=0,len=res.length;len>i;i++){
        if(res[i].id === this.detailData.appid){
          this.installed = true;
          this.installing = false;
          return;
        }
      }
      this.installed = false;
    },
    imgFn(ev:any){
      let target = ev.target;
      target.style.backgroundColor = 'transparent';
    },
    handleToDetail(){
      this.$store.commit('main/setDetailData', this.detailData);
    },
    handleInstall(){
      if(this.isXb && !this.installed && !this.installing){
        this.installing = true;
        let store_ = {...this.detailData,count:0};
        this.$store.dispatch('main/addInstallingData',store_);
        this.$store.dispatch('main/downloadExtension',this.detailData.app_url);
      }else if(this.isXb && (this.installed || this.installing)){
        this.handleToDetail();
      }else if(!this.isXb){
        window.open('https://www.minibai.com/','_blank');
      }
    },
  }
});
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
