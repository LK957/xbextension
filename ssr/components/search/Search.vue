<template>
  <div class="search-box">
    <input @keyup.enter="handleSearch" v-model="key_"  class="search-input" type="text" placeholder="搜索扩展">
    <button @click="handleSearch" class="search-btn" title="搜索"><i class="icon iconfont icon-gengduo-sousuo-px"></i></button>
    
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {mapState} from 'Vuex'
interface Data{
  key_: string
  [propName: string]: any
}
export default Vue.extend({
  data():Data{
    return {
      key_: '',
      abc: ''
    }
  },
  
  computed:{
    ...mapState('main', ['searchKey'])
  },
  created(){
    this.key_ = this.searchKey;
  },
  watch: {
    searchKey(val){
      this.key_ = val;
    },
    '$route' (to:any, from:any) {
      if(to.path !== '/search'){
        this.key_ = '';
        localStorage.setItem('searchKey','');
        this.$store.commit('main/setSearchKey', '');
      }
    }
  },
  methods:{
    handleSearch(){
      localStorage.setItem('searchKey',this.key_);
      this.$store.commit('main/setSearchKey', this.key_);
      if(this.key_){
        this.$emit('event_search',this.key_);
      }
      this.$router.push('/search');
    },
  }
});
</script>
<style lang="less" scoped>
@hoverColor: #009bf1;
  .search-box{
    position: relative;
  }
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