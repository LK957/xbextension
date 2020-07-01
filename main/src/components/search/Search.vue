<template>
  <div class="search-box">
    <input @keyup.enter="handleSearch1" @change="search" v-model="searchKey"  class="search-input" type="text" placeholder="搜索扩展">
    <!-- <ul class="search-keys">
      <li>dajianhaofjdka</li>
      <li>dajianhaofjdka</li>
      <li>dajianhaofjdka</li>
      <li>dajianhaofjdka</li>
    </ul> -->
    <router-link title="搜索" id="searchHref_" :to="abc" @click.native="handleSearch" replace><button class="search-btn"><i class="icon iconfont icon-gengduo-sousuo-px"></i></button></router-link>
  </div>
</template>
<script>
import {getLocationHash, setLocationHash} from '@/libs/util'
export default {
  data(){
    return {
      searchKey: '',
      abc: ''
    }
  },
  created(){
    this.initSearchKey();
  },
  watch: {
      '$route' (to, from) {
        
        //tabs切换
        if(to.path !== '/search'){
          this.searchKey = '';
          localStorage.setItem('searchKey','');
        }else{
          this.initSearchKey();
        }
      }
  },
  methods:{
    initSearchKey(){
      const s = getLocationHash('s');
      this.searchKey = localStorage.getItem('searchKey');
      if(s){
        this.searchKey = s;
      };
    },
    search(){
      if(this.searchKey){
        this.abc = '/search';
      }else{
        this.abc = '';
      }
    },
    handleSearch(){
      localStorage.setItem('searchKey',this.searchKey);
      if(this.searchKey){
        this.$emit('event_search',this.searchKey);
      }
      //this.$router.push(url)
    },
    handleSearch1(){
      document.getElementById('searchHref_').click();
      //this.$router.push(url)
    }
  }
}
</script>
<style lang="less" scoped>
@hoverColor: #009bf1;
  .search-box{
    position: relative;
  }
  /* .search-keys{
    display: none;
    position: absolute;
    width: 100%;
    top: 40px;
    left:0;
    padding: 8px 0;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    font-size: 14px;
    box-shadow: 0 4px 10px rgba(153, 153, 153, 0.4), 0 6px 30px rgba(0, 0, 0, 0.1);
    transition: display .3s;
    z-index: 999;
    &>li{
      width: 100%;
      height: 30px;
      padding: 0 16px;
      line-height: 30px;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:hover{
        background: #f5f5f5;
      }
    }
  } */
  .search-input {
    width: 100%;
    height: 38px;
    outline: none;
    padding: 0 32px 0 14px;
    border: 1px solid #fff;
    box-sizing: border-box;
    border-radius: 18px;
    background: #f5f5f5;
    transition: border 0.4s;
    &:focus{
      background: #fff;
      /* & + .search-keys{
        display: block;
      } */
    }
  }
  .search-btn{
    position: absolute;
    right: 12px;
    top: 10px;
    background: transparent;
    font-size: 14px;
    &:hover i{
      color: @hoverColor;
    }
  }
  .search-input:focus {
    border-color: #009aff;
    box-shadow: 0 0 2px #009aff;
  }
</style>