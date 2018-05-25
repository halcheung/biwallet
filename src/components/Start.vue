<template>
  <div class="layout">
    <mu-card class="card">
      <mu-card-header title="中矿" subTitle="zhongkuang.org">
        <mu-avatar :src="logoUrl" class="avatar" slot="avatar"/>
      </mu-card-header>
      <mu-text-field style="width:calc(100% - 20px);" hintText="请在此输入钱包地址..." v-model="walletAddr" type="text" :errorText="errorText" @blur="removeErrTxt" icon="account_balance_wallet"/>
      <mu-raised-button :disabled="disabled" :label="btnCaption" icon="search" style="margin:10px 20px 20px 20px;width:calc(100% - 40px)" @click.native="enter" primary/>
    </mu-card>
  </div>
</template>

<script >
import avatar from '../assets/zk_logo.png'

export default {
  name: 'Start',
  data () {
    return {
      logoUrl: avatar,
      errorText: '',
      walletAddr: '',
      btnCaption: '查询',
      disabled: false
    }
  },
  mounted () {
    this.$nextTick(() => {

    })
  },
  methods: {
    enter () {
      if (!this.walletAddr) {
        this.errorText = '请输入钱包地址！'
        return
      } else {
        this.errorText = ''
      }
      this.btnCaption = '请稍候……'
      this.disabled = true
      let dataStr = '{"method": "' + this._G.apiMethods.minersStatus + '","timeStamp": ' + (new Date()).getTime() + ',"wallet": "' + this.walletAddr + '"}'

      this._G.ajax(dataStr, (json) => {
        if (json.code === 0) {
          console.log(json)
          this._G.walletKey = this.walletAddr
          this._G.wallet = json
          this._G.setCookie('walletkey', this._G.walletKey, 1, 'd')
          this.$router.push('/MineMachines')
        } else {
          this.$emit('child-say', json.error)
          this.errorText = json.error // json.error
        }
        this.btnCaption = '查询'
        this.disabled = false
      }, (err) => {
        console.log(err)
        this.$emit('child-say', err.message)
        this.btnCaption = '查询'
        this.disabled = false
      })
    },
    removeErrTxt () {
      if (!this.walletAddr) {
        this.errorText = ''
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .layout {
    margin:20px;
  }
  .avatar {
    background-color:#424242;
  }
  .card {
    background-color:#424242;
  }
  @media screen and (min-width:480px) and (max-width:2560px) {
    .layout {
      position: absolute;
      top:70px;
      left:50%;
      width:600px;
      margin:20px -300px;
      margin-top:100px;
    }
  }
</style>
