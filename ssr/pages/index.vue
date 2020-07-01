<template>
  <div class="container">
    <div class="group-box" v-if="allCombineData.length > 0">
      <div class="group-box-main" v-for="(item,key) in allCombineData" :key="key" >
        <div class="group-box-item" @click="listenCombine(key)" :class="'group'+ (item.position-1)" :style="{'background-image': 'url('+(item ? item.pic_url : null)+')'}"></div>
        <Installcombinedialog v-show="hideCombineFlag === key" @event_hide_combine_dialog="handleHideCombine(key)" :data_id="key" :detail="item"></Installcombinedialog>
      </div>
    </div>
    <div class="recommend-box">
      <h3 class="recommend-title">大家都推荐</h3>
      <button @click="handleSwitch($event)" v-if="recommendData.length > 1" class="button-default recommend-switch"><i class="icon iconfont icon-switch-px"></i>换一波</button>
      <ul class="recommend-items clr" v-if="hideRecommendFlag">
        <li class="recommend-item" v-for="(item,key) in curRecommendData" :key="key">
          <Extension fromWhere="recommend" :detail="item"></Extension>
        </li>
      </ul>
    </div>
    <div class="recommend-box">
      <h3 class="recommend-title">精选扩展</h3>
      <ul class="recommend-items clr" v-show="extensionsData2.length > 0">
        <li class="recommend-item" v-for="(item,key) in extensionsData2" :key="key">
          <Extension fromWhere="choiceness" :detail="item"></Extension>
        </li>
      </ul>
      <div class="no-data" v-show="extensionsData2.length === 0">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-neirongweikong-da-px"></use>
        </svg>
      </div>
    </div>
    
  </div>
</template>
<script>
import Vue from 'vue';
import {mapState} from 'Vuex';
import Extension from '~/components/extension';
import Installcombinedialog from '~/components/installcombinedialog';
export default Vue.extend({
  name: 'choiceness',
  components: {
    Extension,
    Installcombinedialog
  },
  data() {
    return {
      //dataId:'',
      switchCount: 0,
      hideRecommendFlag: true,
      //installCombineData: null,
      allCombineData: [],
      extensionsData2: [],
      curRecommendData: [],
      recommendData:[],
      partRecommends: 0,
      hideCombineFlag: -1,
    }
  },
  async asyncData({$axios}){
    const Combine = await $axios.$get('index');
    const res = await $axios.$get('index', {params:{type:1,row:999,page:1}});
    const Choicenees = await $axios.$get('index',{params:{type:2}});
    return {
      Combine,
      res,
      Choicenees,
    }
  },
  created() {
    this.getCombineData(this.Combine);
    this.getRecommendData(this.res);
    this.getChoiceneesData(this.Choicenees);
  },
  methods: {
    getChoiceneesData(res){
      this.extensionsData2 = this.extensionsData2.concat(res);
    },
    getCombineData(res){
      this.allCombineData = [];
      for(let item of res){
        this.allCombineData.push(item);
      }
    },
    getRecommendData(res){
      this.partRecommends = Math.ceil(res.length / 8);
      for(var i=0;this.partRecommends > i; i++){
        var data = res.slice(i * 8, (i + 1) * 8);
        this.recommendData.push(data);
      }
      this.curRecommendData = this.recommendData[0];
    },
    handleSwitch(ev){
      this.switchCount++;
      if(this.switchCount >= this.partRecommends){
        this.switchCount = 0;
      }
      ev.target.blur();
      this.hideRecommendFlag = false;
      this.$nextTick(()=>{
        this.hideRecommendFlag = true;
        this.curRecommendData = this.recommendData[this.switchCount];
      })
      
    },
    listenCombine(key) {
       this.hideCombineFlag = key;
    },
    handleHideCombine(){
        this.hideCombineFlag = -1;
      
    }
  }
});
</script>
<style lang="less" scoped>
  .container {
    width: 100%;
    margin: 0 auto;
  }
  .group-box {
    position: relative;
    width: 1200px;
    height: 408px;
    .group-box-main {
      .group-box-item{
        position: absolute;
        height: 100%;
        background-repeat: no-repeat;
        background-color: #eee;
        transition: all .2s linear;
        background-size: cover;
        border-radius: 2px;
        cursor: pointer;
        &:hover{
          margin-top: -2px;
          z-index: 9;
          box-shadow: 0 3px 14px #999;
        }
      }
      .group0 {
        left: 0;
        top: 0;
        width: 596px;
      }
      .group1 {
        left: 604px;
        top: 0;
        width: 596px;
        height: 200px;
      }
      .group2 {
        left: 604px;
        top: 208px;
        width: 294px;
        height: 200px;
      }
      .group3 {
        left: 906px;
        top: 208px;
        width: 294px;
        height: 200px;
      }
    }
    
  }
  .recommend-box {
    position: relative;
    margin: 36px 0 20px;
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
      &>i{
        width: 14px;
        height: 14px;
        display: inline-block;
        transition: all .4s;
        font-size: 12px;
        margin-right: 6px;
      }
    }
    .recommend-items {
      margin-right: -32px;
    }
    .recommend-item {
      float: left;
      margin: 0 32px 16px 0;
    }
  }
</style>