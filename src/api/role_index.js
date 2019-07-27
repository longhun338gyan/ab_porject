import axios from '@/utils/myaxios.js'
export const getAllRolelist = () => {
  return axios({
    url: 'roles'
  })
}
export const delRightByRoleId = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
export const grantRightById = (roleId, rids) => {
  return axios({
    url: `roles/${roleId}/rights`,
    method: 'post',
    data: { rids }
  })
}
export const addRole = (data) => {
  return axios({
    url: `roles`,
    method: 'post',
    data
  })
}
export const editRole = (data) => {
  return axios({
    url: `roles/${data.id}`,
    method: 'put',
    data: { roleName: data.roleName, roleDesc: data.roleDesc }
  })
}
export const delUserById = (id) => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}
