<template>
  <div class="container">
    <div class="recommend-box" v-if="showFlag">
      <ul class="recommend-items clr" v-show="extensionsData2 && extensionsData2.length > 0">
        <li class="recommend-item"  v-for="(item,key) in extensionsData2" :key="key">             
          <Extension :installedIDData="installedIDData" :fromWhere="data_type.name" :detail="item"></Extension>
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
  import Extension from '@c/extension';
import {getLocationHash, setLocationHash} from '@/libs/util'
  import axios from 'axios'
  export default {
    name: 'ordinary',
    components: {
      Extension
    },
    props:['searchKey','data_type','user_route','installedIDData'],
    data() {
      return {
        showFlag:true,
        curPage: {},
        successFlag: true,
        pageCount: 1,
        extensionsData2: [],
        cursearchKey: '',
      }
    },
    created(){
      if(location.pathname === '/search'){
        const s = getLocationHash('s');
        this.cursearchKey = this.searchKey || localStorage.getItem('searchKey');
        if(s){
          this.cursearchKey = s;
        };
        setLocationHash('s',this.cursearchKey);
      }else{
        localStorage.setItem('searchKey','');
        this.cursearchKey = '';
      }
      
      this.getData(this.data_type.name);
      
    },
    watch: {
      '$route' (to, from) {
        if(this.data_type.name === '/search'){
          const s = getLocationHash('s');
          localStorage.setItem('searchKey',s);
          this.cursearchKey = s;
        }
        //tabs切换
        if(this.successFlag && to.path === this.data_type.name){
          this.successFlag = false;
          this.getData(this.data_type.name);
        }
      },
      user_route(to, from){
        //瀑布流加载
        if(this.successFlag && to === this.data_type.name){
          this.successFlag = false;
          this.getData(to,()=>{
            this.$emit('event_emp_user_route')
          });
        }
      },
    },
    methods:{
      getData(name,callback){
        var cate_id = 1;
         switch(this.$route.path){
          case '/tools':
            cate_id = 1;
          break;
          case '/shopping':
            cate_id = 2;
          break;
          case '/commerces':
            cate_id = 3;
          break;
          case '/amusements':
            cate_id = 4;
          break;
          case '/games':
            cate_id = 5;
          break;
          case '/search':
            cate_id = 6;
          break;
          default:
          return ;
        } 
        // console.log('getData***',name,cate_id,this.$route,this.pageCount,this.oldPageCount,this.data_type)
        /* if(this.oldPageCount === this.pageCount){
          return; 
        } */
        
        if(cate_id !== 6 && name === this.$route.path){
          this.$api.getData({cate_id,page:this.pageCount,row:40}).then(res => { 
            if(res.data.data.length > 0){
              // console.log('cate_id_______',cate_id,res.data.data)
              for(var i=0,len=res.data.data.length;len>i;i++){
                this.extensionsData2.push(res.data.data[i]);
              }
              this.pageCount++;
              this.successFlag = true;
              //this.oldPageCount = this.pageCount;
              // console.log('extensionsData2_______',this.extensionsData2,res.data.data)
            }else{
              this.successFlag = false;
            }
            
            callback && callback();
          }).catch(error => {
              console.log('cate_id',error);
          });
        }else if(cate_id === 6 && name === '/search' && this.cursearchKey){
          this.$api.getData({name: this.cursearchKey}).then(res => { 
            if(res.data.data.length > 0){
              // console.log('美图_______________',cate_id,res)
              this.extensionsData2 = res.data.data;
            }
          }).catch(error => {
              console.log('searchKey',error);
          });
        }
      }
    }
  }
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