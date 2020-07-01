import {getData} from './axios'
import {isXbBrowser,listenExtensionStatus} from '../libs/util'
const install = Vue => {
  if (install.installed)
    return;
  install.installed = true;
  Object.defineProperties(Vue.prototype, {
    $api: {
      get() {
        return {getData}
      }
    },
    isXb: {
      get() {
        return isXbBrowser()
      }
    },
    listenExtensionStatus:{
      get(){
        return listenExtensionStatus
      }
    },
  })
}
export default install