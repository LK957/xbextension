<template>
  <div id="app">
    <header>
      <a :href="logohref"><h1 class="logo" title="扩展中心"><!-- <i class="icon iconfont icon-minibai-extend-logo-"></i> --></h1></a>
      <a v-if="isXb" class="head-tool" @click="handleToExtensionCenter" href="javascript:;">已安装的扩展 <span>{{installedIDData && installedIDData.length}}</span></a>
    </header>
    <div class="disclaimer" :style="{'margin-top': hideDisclaimerFlag ? 0 : '-40px'}" v-show="$route.path ==='/'">
      <p v-if="isXb">免责声明：扩展中心插件均由第三方提供，请谨慎使用。</p>
      <p v-else>温馨提示：您需要使用小白浏览器才能安装扩展<a href="//www.minibai.com/" target="_blank"> 下载小白浏览器</a>。</p>
      <button @click="handleHideDisclaimer" class="close" title="关闭"><i class="icon iconfont icon-Close-box-px"></i></button>
    </div>
    <div class="container">
      <nav class="clr">
        <ul class="nav-tabs clr">
          <li>
            <router-link :class="{'active': curItemStr === ''}" to="/"><i class="icon iconfont nav-icon icon-Selected-px"></i>
              <span>精选</span></router-link>
          </li>
          <li>
            <router-link :class="{'active': curItemStr ==='tools'}" to="/tools"><i class="icon iconfont nav-icon icon-tool-px"></i> <span>工具</span></router-link>
          </li>
          <li>
            <router-link :class="{'active': curItemStr ==='shopping'}" to="/shopping"><i class="icon iconfont nav-icon icon-Shopping-px"></i> <span>购物</span></router-link>
          </li>
          <li>
            <router-link :class="{'active': curItemStr ==='commerces'}" to="/commerces"><i class="icon iconfont nav-icon icon-Social-contact-px"></i>
              <span>社交</span></router-link>
          </li>
          <li>
            <router-link :class="{'active': curItemStr ==='amusements'}" to="/amusements"><i class="icon iconfont nav-icon icon-ntertainment-px"></i>
              <span>娱乐</span></router-link>
          </li>
          <li>
            <router-link :class="{'active': curItemStr ==='games'}" to="/games"><i class="icon iconfont nav-icon icon-Game-px"></i> <span>游戏</span></router-link>
          </li>
        </ul>
        <SearchBox @event_search="handleSearch" style="width: 260px;float:right;"></SearchBox>
      </nav>
    </div>
    <!-- <Installdialog @event_hide_install_dialog="handleHideInstallDidlog" :class="{'hide-dialog': hideDialogFlag}" v-if="installdialogFlag" :detail="installDetailData"></Installdialog> -->
    <!-- <Installcombinedialog :detail="installCombineData"></Installcombinedialog> -->
    <Choiceness :installedIDData="installedIDData" v-show="$route.path === '/'"></Choiceness>
    <Ordinary :installedIDData="installedIDData" @event_emp_user_route="handleEmpUserRoute" v-for="(item,key) in ordinaryConfigData" v-show="item === $route.path" :user_route="user_route" :data_type="{name:item,index:key+1}" :key="key"></Ordinary>
    <Ordinary :installedIDData="installedIDData" :searchKey="searchKey" v-if="ordinaryFlag" v-show="$route.path === '/search'" :data_type="{name:'/search',index:6}" key="6"></Ordinary>
  </div>
</template>
<script>
  import Installcombinedialog from '@c/installcombinedialog'
  import Choiceness from './views/choiceness'
  import Ordinary from './views/ordinary'
  import SearchBox from '@c/search';
  export default {
    name: "App",
    components: {
      SearchBox,
      Ordinary,
      Choiceness
    },
    data() {
      return {
        installedIDData:[],
        hideDisclaimerFlag: false,
        ordinaryFlag: true,
        ordinaryConfigData:['/tools','/shopping','/commerces','/amusements','/games'],
        curItemStr: '',
        searchKey: '',
        user_route: '',
        installingStutas: false,
        logohref: '',
      }
    },
    created(){
      console.log(2221);
      
      /* this.installingData.push(123)
      console.log(this.installingData,'__app') */
      this.logohref = window.location.origin;
      setTimeout(()=>{
        this.hideDisclaimerFlag = true;
      },1000);
      this.listenExtensionStatus((res)=>{
        
        this.installedIDData = res;
      });
    },
    mounted() {
      var reg = /\//g;
      this.curItemStr = location.pathname.replace(reg, '');
      
      var el = document.documentElement || document.body;
      window.onscroll=function(){
        if(this.ordinaryConfigData.indexOf(this.$route.path) === -1){
          return;
        }
        var t = el.scrollTop + 60,h = el.clientHeight;
        if (t >= el.scrollHeight - h && this.user_route === '') {
          this.user_route = this.$route.path;
        }
      }.bind(this);
    },
    updated() {
      var reg = /\//g;
      //console.log(2, this.curItemStr,location.pathname.replace(reg, ''))
      /* if (location.pathname.replace(reg, '') === '') {
        this.curItemStr = '';
      }else{
        
      } */
      this.curItemStr = location.pathname.replace(reg, '');
    },
    methods: {
      handleToExtensionCenter(){
        if(this.isXb){
          chrome.xb.switchToExtensionManager('chrome://extensions',0);
        }
      },
      handleEmpUserRoute(){
        this.user_route = '';
      },
      handleHideDisclaimer(){
        setTimeout(()=>{
          this.hideDisclaimerFlag = false;
        },100);
      },
      handleSearch(searchKey){
        // console.log('handleSearch_______',searchKey)
        this.searchKey = searchKey;
        this.ordinaryFlag = false;
        this.$nextTick(() => {
          this.ordinaryFlag = true;
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @mainBgColor: #fff;
  @headerBgColor: #394184;
  @color1: #222;
  @color2: #999;
  @hoverColor: #009bf1;
  /*009aff*/
  @activeColor: #008eeb;

  #app {
    min-width: 1200px;
    .disclaimer{
        position: relative;
        width: 100%;
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        margin-top:-40px;
        text-align: center;
        transition: all 1s ease-in-out;
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
      background: url('./static/img/logo.svg') no-repeat;
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
</style>