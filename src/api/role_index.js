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
