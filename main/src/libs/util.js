export const isXbBrowser = ()=>{
  if(navigator.xbVersion){
    return true;
  }
  var c = /XiaoBai\/?(.*)/,
      d = navigator.userAgent.match(c);
  return d != null;
}
const getAllExtensions = (callback) => {
  
  chrome.xb.getAllExtensions ((res)=>{
    callback && callback(res);
  });
}
export const listenExtensionStatus = (callback)=>{
  if(isXbBrowser() && chrome.xb){
    getAllExtensions(callback);
    chrome.xb.onInstalled.addListener(() => {
      getAllExtensions(callback);
    });
    chrome.xb.onUninstalled.addListener(() => {
      getAllExtensions(callback);
    });
  }else{
    callback && callback([]);
  }
  
}


export function checkBrowserVersion(v_ = [10,1,0,0]){
  var userAgent = window.navigator.userAgent;
  
  if(!isXbBrowser()) return true;
  
  var version = navigator.xbVersion || userAgent.split('XiaoBai/')[1],
    versionArr = version.replace(/\(XBCEF\)/,'').split('.');
    for(var i=0,len = versionArr.length;len>i;i++){
      if(+versionArr[i] > v_[i]){
        return true;//浏览器版本比设定版本v_高
      }
    }
  return false;//浏览器版本比设定版本v_低或相同
}

export const getLocationHash = (key) => {
  let str = location.hash.slice(1);
  if(str.length > 0){
    let entryArr_ = str.split('&');
    for(let i=0,len=entryArr_.length;len>i;i++){
      let arr = entryArr_[i].split('=');
      if(arr[0] === key){
        const value = arr[1];
        if(isNaN(+value)) return value;
        else return +value;
      }
    }
  }
  return '';
}
export const setLocationHash = (key,value) => {
  let str = location.hash.substr(1);
  let newStr = '#';
  let obj = {};
  let entryArr_ = str.split('&');
  for(let i=0,len=entryArr_.length;len>i;i++){
    let arr = entryArr_[i].split('=');
    if(arr[0])obj[arr[0]] = arr[1];
  }
  obj[key] = value + '';
  for(let item in obj){
    if(!obj[item]) delete obj[item];
    else newStr += `${item}=${obj[item]}&`; 
  }
  
  location.hash = newStr.substr(0, newStr.length - 1);;
}