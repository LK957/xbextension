
const baseUrl = '/api';
export default ({$axios, redirect}) => {
  // console.log(1234,$axios, redirect);
  $axios.interceptors.request.use(
    config => {
      return config;
    },
    error =>{
      return Promise.reject(error)
    }
  );
  $axios.onRequest(config => {
    const url = baseUrl + (config.url.indexOf('/') === 0 ? config.url : '/' + config.url) + '.json';
    config.url = url;
    // console.log(999,config);
    
    console.log('Making request to ' + config.url);
    
  });
  $axios.interceptors.response.use(
    res => {
      // console.log('--------------',res);
      
      if(res.status == 200){
        return res.data;
      }else{
        redirect('/404')
      }
      return Promise.reject(res.msg || 'Error');
    },
    error => {
      console.log('error ' + error);
      
      return Promise.reject(error);
    }
  );
  $axios.onError(error => {
    console.log('error----------',error,error.response,error.response.status);
    
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/404')
    } else if (code === 500) {
      redirect('/500')
    }
  })


}