<template>
  <div class="container">
    <div class="recommend-box" v-if="showFlag">
      <ul class="recommend-items clr" v-show="extensionsData2 && extensionsData2.length > 0">
        <li class="recommend-item"  v-for="(item,key) in extensionsData2" :key="key">             
          <Extension :fromWhere="$route.path" :detail="item"></Extension>
        </li>
      </ul>
      <div class="no-data" v-show="!extensionsData2 || extensionsData2.length === 0">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-neirongweikong-da-px"></use>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import Extension from '@/components/extension';
import Vue from 'vue';
import { mapState } from 'vuex';
export default Vue.extend({
  name: 'ordinary',
  components: {
    Extension
  },
  async asyncData(context){
    const {$axios, route, store,app,query}  = context;
    console.log(123,context);
    
    const index_ = store.state.route_api.findIndex(r => {
      return route.path === r;
    });
    const params = {
      cate_id: index_ + 1,
      page: 1,
      row: 40
    }
    const ordinary = (index_ >= 0 && index_ < 5) ? await $axios.$get('index',{params}) : [];
    return {
      ordinary,
      index_
    }
  },
  data() {
    return {
      showFlag:true,
      curPage: {},
      successFlag: true,
      pageCount: 2,
      extensionsData2: [],
      cursearchKey: '',
      ordinary_: [],
    }
  },
  computed:{
    ...mapState(['route_api']),
    ...mapState('main',['searchKey']),
  },
  created(){
    this.ordinary_ = [...this.ordinary];
    this.getData();
  },
  mounted(){
    let noMore = false;
    window.onscroll= async function(){
      if(noMore) return;
      var el = document.documentElement || document.body;
      var t = el.scrollTop + 60,h = el.clientHeight;
      if (t >= el.scrollHeight - h) {
        noMore = true;
        console.log(777);
        
        const params = {
          cate_id: this.index_ + 1,
          page: this.pageCount,
          row: 40
        }
        const data_ = await this.$axios.$get('index',{params});
        if(data_.length > 0){
          this.pageCount ++;
          this.extensionsData2 = [...this.extensionsData2, ...data_];
          noMore = false;
        }else{
          noMore = true;
        }
      }
    }.bind(this);
  },
  watch: {
    searchKey(val){
      this.extensionsData2 = [];
      this.getData();
    }
  },
  methods:{
    async getData(){
      const mode_search = this.$route.path === '/search';
      let extensionsData2 = [];
      if(mode_search){
        const key_ = localStorage.getItem('searchKey') || '';
        this.$store.commit('main/setSearchKey', key_);
        const params = {
          name: this.searchKey
        }
        this.ordinary_ = this.searchKey ? await this.$axios.$get('index',{params}) : [];
        extensionsData2 = [...this.ordinary_];
      }else{
        extensionsData2 = [...this.extensionsData2, ...this.ordinary_];
      }
      this.extensionsData2 = extensionsData2;
    }
  }
});
</script>
<style lang="less" scoped>
  .container {
    width: 100%;
    margin: 0 auto;
  }
  .recommend-box{
    position: relative;
    margin: 36px 0 20px;
    .recommend-items{
      margin-right: -32px;
    }
    .recommend-item{
      float: left;
      margin: 20px 32px 8px 0;
    }
  }
</style>

