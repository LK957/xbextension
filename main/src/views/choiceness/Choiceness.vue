<template>
  <div class="container">
    <div class="group-box" v-if="allCombineData.length > 0">
      <div class="group-box-main" v-for="(item,key) in allCombineData" :key="key" >
        <div class="group-box-item" @click="listenCombine(key)" :class="'group'+ (item.position-1)" :style="{'background-image': 'url('+(item ? item.pic_url : null)+')'}"></div>
        <Installcombinedialog :installedIDData="installedIDData" v-show="hideCombineFlag === key" :data_id="key" :detail="item" @event_hide_combine_dialog="handleHideCombine(key)"></Installcombinedialog>
      </div>
    </div>
    <div class="recommend-box">
      <h3 class="recommend-title">大家都推荐</h3>
      <button @click="handleSwitch($event)" class="button-default recommend-switch"><i class="icon iconfont icon-switch-px"></i>换一波</button>
      <ul class="recommend-items clr" v-if="hideRecommendFlag">
        <li class="recommend-item" v-for="(item,key) in curRecommendData" :key="key">
          <Extension :installedIDData="installedIDData" fromWhere="recommend" :detail="item"></Extension>
        </li>
      </ul>
    </div>
    <div class="recommend-box">
      <h3 class="recommend-title">精选扩展</h3>
      <ul class="recommend-items clr" v-show="extensionsData2.length > 0">
        <li class="recommend-item" v-for="(item,key) in extensionsData2" :key="key">
          <Extension :installedIDData="installedIDData" fromWhere="choiceness" :detail="item"></Extension>
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
  import Extension from '@c/extension';
  import Installcombinedialog from '@c/installcombinedialog';
  import {setLocationHash, getLocationHash} from '@/libs/util'
  export default {
    name: 'choiceness',
    components: {
      Extension,
      Installcombinedialog
    },
    props: ['installedIDData'],
    data() {
      return {
        //dataId:'',
        switchCount: 0,
        hideRecommendFlag: true,
        hideCombineFlag: -1,
        //installCombineData: null,
        allCombineData: [],
        extensionsData2: [],
        curRecommendData: null,
        recommendData:[],
        partRecommends: 0,
      }
    },
    created() {
      this.getCombineData();
      this.getRecommendData();
      this.getChoiceneesData();
      this.initCombKey();
        // setLocationHash('comb',key);
        // this.hideCombineFlag = +key;
    },
    methods: {
      initCombKey(){
        const comb = getLocationHash('comb');
        if(comb){
          setLocationHash('comb',comb);
          this.hideCombineFlag = +comb;
        }
      },
      getChoiceneesData(){
        this.$api.getData({type:2}).then(res => { 
          this.extensionsData2 = this.extensionsData2.concat(res.data.data);
        }).catch(error => {
            console.log('ChoiceneesData',error);
        });
      },
      getCombineData(){
        this.$api.getData().then(res => { 
          this.allCombineData = [];
          for(let item of res.data.data){
            this.allCombineData.push(item);
          }
        }).catch(error => {
            console.log('CombineData',error);
        });
      },
      getRecommendData(){
        this.$api.getData({type:1,row:999,page:1}).then(res => { 
          this.partRecommends = Math.ceil(res.data.data.length / 8);
          for(var i=0;this.partRecommends > i; i++){
            var data = res.data.data.splice(0,8);
            this.recommendData.push(data);
          }
          this.curRecommendData = this.recommendData[0];
        }).catch(error => {
            console.log('RecommendData',error);
        });
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
        setLocationHash('comb',key);
        this.hideCombineFlag = +key;
      },
      handleHideCombine(key){
        this.hideCombineFlag = -1;
        setLocationHash('comb','');
        
      }
    }
  }
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