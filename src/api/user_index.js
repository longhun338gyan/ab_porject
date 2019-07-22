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
export const getAllUserList = (params) => {
  return axios({
    url: 'users',
    params
  })
}
// 添加用户
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
// 编辑用户
export const editUser = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data: { email: data.email, mobile: data.mobile }
  })
}
export const delUserById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
export const updateUserState = (uid, type) => {
  return axios({
    url: `users/${uid}/state/${type}`,
    method: 'put'
  })
}
