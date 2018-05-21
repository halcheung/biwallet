<template>
  <div></div>
</template>

<script>
import CryptoJS from 'crypto-js'

const walletKey = '0xb43d4351ab9dcb4271fd21fa0a6cc31c542b71463456527a7176454e47777272'
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
export default {
  encrypt,
  decrypt,
  walletKey
}
</script>

<style scoped>
</style>
