import Vue from 'vue';
export default (Component, props) =>{
  const instance = new Vue({
    render: h => {
      return h(Component, {props});
    }
  }).$mount();

  
}