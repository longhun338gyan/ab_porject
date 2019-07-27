import axios from '@/utils/myaxios.js'

export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
export const getLeftMenu = () => {
  return axios({
    url: 'menus'
  })
}
