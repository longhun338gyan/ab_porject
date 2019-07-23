import axios from '@/utils/myaxios.js'

export const getAllRightList = (type) => {
  return axios({
    url: `rights/${type}`
  })
}
