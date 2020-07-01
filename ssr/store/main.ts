
import {PieChart,isXbBrowser,listenExtensionStatus, checkBrowserVersion} from '@/libs/util';
export const state = () => ({
  detailData: {},
  installedIDData: [],
  installingData: {},
  countRender_: {},
  C_detailData: {},
  isXb: isXbBrowser(),
  searchKey: '',
});
export const getters = {
  isShowISDialog (state:any){
    return Object.keys(state.detailData).length > 0;
  },
  isShowISCombinedialog (state:any){
    return Object.keys(state.combineDetailData).length > 0;
  }
}
export const mutations = {
  initIsXb(state:any){
    state.isXb = isXbBrowser()
  },
  setSearchKey (state:any, payload:string){
    state.searchKey = payload;
  },
  setCountRender_ (state:any, payload:any){
    state.countRender_ = payload;
  },
  addInstallingData (state:any, payload:any){
    let {appid, count} = payload;
    state.installingData[appid] = payload;
    state.countRender_ = {appid, count};
  },
  deleteInstallingData(state:any,id:string):void {
    delete state.installingData[id];
  },
  setDetailData (state:any,payload:object):void {
    state.detailData = payload;
  },
  

  setCombineDetailData (state:any,payload:object):void {
    state.C_detailData = payload;
  },
  setInstalledIDData (state:any,payload:object):void {
    state.installedIDData = payload;
  },
};

export const actions = {
  addInstallingData({commit}:any,payload:any){
    payload.randomStopNum = 92 + 6 * Math.random();
    let {count,randomStopNum} = payload;
    payload.p = new PieChart({count,randomStopNum});
    payload.p.running((c:any)=>{
      payload.count = c;
      commit('addInstallingData',payload);
    });
  },
  setInstalledIDData({commit,state}:any,payload:any){
    payload.forEach(({id: appid}:any) => {
      if(appid in state.installingData){
        state.installingData[appid].p.done((count:number)=>{
          commit('setCountRender_',{appid, count});
          if(count === 0){
            commit('deleteInstallingData',appid);
          }
        });
      }
    });
    commit('setInstalledIDData',payload);
  },
  listenExtensionStatus({},payload:any){
    listenExtensionStatus(payload)
  },
  downloadExtension({},url:string){
    if(process.server) return;
    const window_:any = window;
    const _cr_:any = window_.chrome;
    if(!_cr_.xb) return;
    if(checkBrowserVersion([10,1,2713,1466])){
      _cr_.xb.openUrl(url, -3, false);
    }else{
      _cr_.xb.switchToExtensionManager(url, 1);
    }
  }
}