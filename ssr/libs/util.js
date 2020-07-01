export const isXbBrowser = ()=>{
  if(process.server) return true;
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
  if(process.server) return;
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

export class PieChart{
  constructor({count,randomStopNum}){/* , canvasID */
    
    this.randomStopNum = randomStopNum;
    this.count = count;

    this.timer_s = null;
    this.timer_out_s = null;
    this.timer_q = null;
    this.timer_out_q = null;
  }
  runningFn(cb) {
    let randomNum = .6 * Math.random();
    console.log('------runningFn----',this.count,randomNum);
    
    if (this.count > this.randomStopNum) {
      clearTimeout(this.timer_out_s);
      clearInterval(this.timer_s);
      return false;
    }else{
      if (randomNum < .01) {
        clearTimeout(this.timer_out_s);
        clearInterval(this.timer_s);
        this.timer_out_s = setTimeout(() => {
          this.timer_s = setInterval(()=>{
            this.runningFn(cb)
          }, 32)
        }, 100)
        return false;
      } else if (randomNum < .06 && randomNum >= .05 || randomNum < .56 && randomNum >= .53) {
        clearTimeout(this.timer_out_s);
        clearInterval(this.timer_s);
        this.timer_out_s = setTimeout(() => {
          this.timer_s = setInterval(()=>{
            this.runningFn(cb)
          }, 28)
        }, 80)
        return false;
      }
    }
    this.count += randomNum; // .2 * 500       0 ~ .6
    cb && cb(this.count);
    console.log(this.count);
    
    // this.pieChart(this.count);
  }
  running(cb) {
    clearInterval(this.timer_s)
    this.timer_s = setInterval(()=>{this.runningFn(cb)}, 32)
  }
  done(cb) {
    clearTimeout(this.timer_out_s);
    clearInterval(this.timer_s)
    clearInterval(this.timer_q);
    console.log(this.count);
    
    this.timer_q = setInterval(()=>{
      this.doneFn(cb)
    }, 4) //time *  500 = 2.5, 50 * 500 = 25000
  }
  doneFn(cb) {
    let randomNum = .6 * Math.random();
    if (randomNum < .01) {
      clearInterval(this.timer_q);
      clearTimeout(this.timer_out_q);
      this.timer_out_q = setTimeout(() => {
        this.timer_q = setInterval(()=>{
          this.doneFn(cb);
        }, 4)
      }, 40)
      return false;
    }
    if (this.count > 100) {
      clearInterval(this.timer_q);
      clearTimeout(this.timer_out_q);
      this.count = 0;
      cb && cb(this.count);
      return false;
    }
    
    this.count += randomNum; // .2 * 500       0 ~ .6
    cb && cb(this.count);
    console.log('doneFn-----',this.count);
  }
}

