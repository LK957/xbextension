<template>
  <div>
    <div class="head-container">
      <header>
        <a :href="logohref"><h1 class="logo" title="扩展中心"><!-- <i class="icon iconfont icon-minibai-extend-logo-"></i> --></h1></a>
        <a v-if="isXb" class="head-tool" @click="handleToExtensionCenter" href="javascript:;">已安装的扩展 <span>{{installedIDData && installedIDData.length}}</span></a>
      </header>
      <div class="disclaimer" :style="{'margin-top': hideDisclaimerFlag ? '-40px' : 0 }" v-show="$route.path ==='/'">
        <p v-if="isXb">免责声明：扩展中心插件均由第三方提供，请谨慎使用。</p>
        <p v-else>温馨提示：您需要使用小白浏览器才能安装扩展<a href="//www.minibai.com/" target="_blank"> 下载小白浏览器</a>。</p>
        <button @click="handleHideDisclaimer" class="close" title="关闭"><i class="icon iconfont icon-Close-box-px"></i></button>
      </div>
      <div class="container">
        <nav class="clr">
          <ul class="nav-tabs clr">
            <li>
              <nuxt-link to="/" :class="{'active': curItemStr === ''}"><i class="icon iconfont nav-icon icon-Selected-px"></i>
                <span>精选</span></nuxt-link>
            </li>
            <li>
              <nuxt-link to="/tools" :class="{'active': curItemStr ==='tools'}"><i class="icon iconfont nav-icon icon-tool-px"></i> <span>工具</span></nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{path: 'shopping',params: { userId: 123 },query: { plan: 'private' }}" :class="{'active': curItemStr ==='shopping'}"><i class="icon iconfont nav-icon icon-Shopping-px"></i> <span>购物</span></nuxt-link>
            </li>
            <li>
              <nuxt-link to="/commerces" :class="{'active': curItemStr ==='commerces'}"><i class="icon iconfont nav-icon icon-Social-contact-px"></i>
                <span>社交</span></nuxt-link>
            </li>
            <li>
              <nuxt-link to="/amusements" :class="{'active': curItemStr ==='amusements'}"><i class="icon iconfont nav-icon icon-ntertainment-px"></i>
                <span>娱乐</span></nuxt-link>
            </li>
            <li>
              <nuxt-link to="/games" :class="{'active': curItemStr ==='games'}"><i class="icon iconfont nav-icon icon-Game-px"></i> <span>游戏</span></nuxt-link>
            </li>
          </ul>
          <SearchBox  style="width: 260px;float:right;"></SearchBox>
        </nav>
      </div>
    </div>
    <div class="nuxt-container">
      <nuxt />
    </div>
    <Installdialog v-if="isShowISDialog"></Installdialog>
  </div>
  
</template>
<script lang="ts">
import Vue from 'vue'
import {mapState, mapMutations,mapGetters} from 'vuex'
import Installdialog from '~/components/installdialog';
import SearchBox from '@/components/search'
interface Data {
  logohref: string
  [propName: string]: any
}
export default Vue.extend({
  name: 'default',
  components: {
    SearchBox,
    Installdialog,
  },
  data():Data{
    return {
      logohref: '',
      curItemStr: '',
      hideDisclaimerFlag: true,
    }
  },
  computed:{
    ...mapGetters('main',['isShowISDialog','isShowISCombinedialog']),
    ...mapState('main',['isXb', 'installedIDData'])
  },
  watch:{
    $route(val){
      this.initNavTitle();
    }
  },
  created():void{
    this.initNavTitle();
    setTimeout(()=>{
      this.hideDisclaimerFlag = false;
    },2000);
    
    this.$store.dispatch('main/listenExtensionStatus',(res:any)=>{
      this.$store.dispatch('main/setInstalledIDData', res);
    });
  },
  methods:{
    initNavTitle(){
      this.$store.commit('main/initIsXb');
      this.curItemStr = this.$route.path.slice(1);
    },
    handleToExtensionCenter(){
      if(this.isXb){
        const window_:any = window;
        const _cr_:any = window_.chrome;
        _cr_.xb.switchToExtensionManager('chrome://extensions',0);
      }
    },
    handleHideDisclaimer(){
      this.hideDisclaimerFlag = true;
    }
  } 
});
</script>
<style lang="less" scoped>
  @mainBgColor: #fff;
  @headerBgColor: #394184;
  @color1: #222;
  @color2: #999;
  @hoverColor: #009bf1;
  /*009aff*/
  @activeColor: #008eeb;
  .head-container {
    position: relative;
    min-width: 1200px;
    z-index: 99;
    .disclaimer{
        position: relative;
        width: 100%;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        margin-top:-40px;
        text-align: center;
        transition: all 1s ease-in-out;
        z-index: 9;
        &>P{
          position: absolute;
          margin: auto;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-bottom: 1px solid #e9e44f;
          font-size: 14px;
          color: @color1;
          &>a{
            color: @activeColor;
            &:hover{
              color: @hoverColor;
            }
          }
        }
      .close{
        position: absolute;
        top: 12px;
        right: 28px;
        background: transparent;
      }
    }
  }
  header {
    position: relative;
    z-index: 99;
    height: 72px;
    width: calc(100% -56px);
    padding: 0 28px;
    background-color: @headerBgColor;
    user-select: none;

    .logo,
    .head-tool {
      margin: 18px 0;
      float: left;
      line-height: 34px;
    }
    
    .logo{
      width: 152px;
      height: 38px;
      display: inline-block;
      background: url('/img/logo.svg') no-repeat;
      i{
        color: #fff;
        font-size: 38px;
      }
    }
     
    .head-tool {
      height: 34px;
      padding: 0 14px;
      font-size: 14px;
      float: right;
      border-radius: 2px;
      text-align: center;
      background-color: @mainBgColor;
    }
  }
  .container {
    width: 1200px;
    margin: 58px auto 0;
    .nav-icon{
      position: absolute;
      font-size: 36px;
    }
    .nav-tabs > li{
      position: relative;
      span{
        margin-left: 46px;
      }
    }
  }
  
  nav {
    line-height: 34px;
    margin-bottom: 58px;
    >ul {
      float: left;

      >li {
        float: left;
        margin-right: 64px;

        >a:hover {
          color: @hoverColor;
        }

        .active {
          color: @activeColor;
        }
      }
    }
  }
  .nuxt-container{
    width: 1200px;
    margin: 58px auto 0;
  }
</style>
