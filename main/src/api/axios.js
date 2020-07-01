import axios from '../libs/api.request'
export const getData = (params) => {
  return axios.request({
    url: 'index.json',
    method: 'get',
    params
  })
}
