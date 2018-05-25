<template>
  <div></div>
</template>

<script>
import CryptoJS from 'crypto-js'
import axios from 'axios'

const apiUrl = 'http://new.biwallet.me/api/do.php'
const apiMethods = {
  minersStatus: 'miners.status',
  accBalance: 'account.balance.get',
  getWithdrawMode: 'account.withdraw.get',
  setWithdrawMode: 'account.withdraw.set',
  getBill: 'account.history.get',
  getWithdrawHistory: 'account.withdraw.history',
  withdraw: 'account.withdraw.do'
}
const walletKey = '' // '0x7287f3ebe96b343ec228f01b95ec8d79455470736d486c3870712f5045487653'
const secretKey = 'a83H4f1LL1f4H38a'
const iv = 'a83H4f1LL1f4H38a'
let ivObj = {
  iv: CryptoJS.enc.Utf8.parse(iv),
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
}
let wallet = {}
let encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(secretKey), ivObj)
}
let decrypt = (text) => {
  let result = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(secretKey), ivObj)
  return result.toString(CryptoJS.enc.Utf8)
}
let md5 = (text) => {
  let result = CryptoJS.MD5(text)
  return result.toString()
}
let currentPath = ''
let isMobile = (navigator.userAgent.match(/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i))
let ajax = (dataStr, callback, errCallback) => {
  axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  // console.log('data', dataStr)
  axios.post(apiUrl, {
    data: encrypt(dataStr).toString()
  })
    .then((resp) => {
      console.log(resp)
      console.log(resp.data)
      console.log(decrypt(resp.data))
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

let getCookie = (cName) => {
  if (document.cookie.length > 0) {
    let cStart = document.cookie.indexOf(cName + '=')
    if (cStart !== -1) {
      cStart = cStart + cName.length + 1
      let cEnd = document.cookie.indexOf(';', cStart)
      if (cEnd === -1) {
        cEnd = document.cookie.length
      }
      return decodeURI(document.cookie.substring(cStart, cEnd))
    }
  }
  return null
}
let setCookie = (cName, value, expireTime, dhm) => {
  let exdate = new Date()
  if (dhm === 'd') {
    exdate.setDate(exdate.getDate() + parseInt(expireTime, 10))
  } else if (dhm === 'h') {
    exdate.setHours(exdate.getHours() + parseInt(expireTime, 10))
  } else if (dhm === 'm') {
    exdate.setMinutes(exdate.getMinutes() + parseInt(expireTime, 10))
  }
  console.log(window.location.host)
  document.cookie = cName + '=' + encodeURI(value) + ';domain=' + window.location.host.split(':')[0] + ((expireTime == null) ? '' : ';path=/;expires=' + exdate.toGMTString())
}
let deleteCookie = (cName) => {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() - parseInt(3650, 10))
  document.cookie = cName + '=' + ';domain=' + window.location.host.split(':')[0] + ';path=/;expires=' + exdate.toGMTString()
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
  md5,
  apiMethods,
  ajax,
  isMobile,
  walletKey,
  wallet,
  getCookie,
  setCookie,
  deleteCookie,
  currentPath
}
</script>

<style scoped>
</style>
