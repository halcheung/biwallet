<template>
  <div></div>
</template>

<script>
import CryptoJS from 'crypto-js'
import axios from 'axios'

const apiUrl = 'http://new.biwallet.me/api/do.php'
const apiMethods = {
  minersStatus: 'miners.status'
}
// const walletKey = '0xe8fea2d4d731bc46e74ccc303fa527233234674731486b67775a564c66444c32'
const secretKey = 'a83H4f1LL1f4H38a'
const iv = 'a83H4f1LL1f4H38a'
let ivObj = {
  iv: CryptoJS.enc.Utf8.parse(iv),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
}
let encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(secretKey), ivObj)
}
let decrypt = (text) => {
  let result = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(secretKey), ivObj)
  return result.toString(CryptoJS.enc.Utf8)
}
let isMobile = (navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i))
let ajax = (dataStr, callback, errCallback) => {
  axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'

  console.log('data', dataStr)
  axios.post(apiUrl, {
    data: encrypt(dataStr).toString()
  })
    .then((resp) => {
      // console.log(resp)
      // console.log(resp.data)
      // console.log(decrypt(resp.data))
      let json = {}
      if (resp && resp.status === 200) {
        json = JSON.parse(decrypt(resp.data))
      } else {
        json = {
          code: -999,
          error: '网络不给力，请稍后再试！'
        }
      }
      callback(json)
    })
    .catch(errCallback)
}

export default {
  data () {
    return {
      toast: false,
      toastText: ''
    }
  },
  encrypt,
  decrypt,
  apiMethods,
  ajax,
  isMobile
}
</script>

<style scoped>
</style>
