// 这个文件用来处理所有与用户有关的操作
import axios from '@/utils/myaxios.js'
// 登陆
export const login = (data) => {
  // axios({})返回了一个promise对象
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
