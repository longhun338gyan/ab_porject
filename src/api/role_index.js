import axios from '@/utils/myaxios.js'
export const getAllRolelist = () => {
  return axios({
    url: 'roles'
  })
}
