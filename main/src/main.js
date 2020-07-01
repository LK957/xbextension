import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@s/css/font/iconfont'
import '@s/css/style.css'
import '@s/css/index.less'
import '@s/img/installmask.png'
import api from './api/index'


Vue.use(api)
Vue.prototype.installingData = [];
Vue.config.productionTip = false;
Vue.filter('date-formatter',function(v){
  var d = new Date(v*1000), str = '/';
  if(!isNaN(v)){
    str = d.getFullYear() + '/' + zeroize(d.getMonth()+1) + '/' + zeroize(d.getDate());
    return str;
  }else{
    return v;
  }
  
});
new Vue({
  router,
  /* store, */
  render: h => h(App)
}).$mount('#app');
function zeroize(num) {
  return (String(num).length == 1 ? '0' : '') + num;
}