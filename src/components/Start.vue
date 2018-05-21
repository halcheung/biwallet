<template>
  <div class="layout">
    <mu-card class="card">
      <mu-card-header title="中矿" subTitle="zhongkuang.org">
        <mu-avatar :src="logoUrl" class="avatar" slot="avatar"/>
      </mu-card-header>
      <mu-text-field style="width:calc(100% - 20px);" hintText="请在此输入钱包地址..." type="text" :errorText="errorText" icon="account_balance_wallet"/>
      <mu-raised-button label="查询" icon="search" style="margin:10px 20px 20px 20px;width:calc(100% - 40px)" @click.native="enter" primary/>
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
      errorText: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      let data = '{"method": "miners.status","timeStamp": "' + (new Date()).getTime + '","wallet": "' + this._G.walletKey + '"}'

      this.$axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      this.$axios.post('http://new.biwallet.me/api/do.php', {
        data: data
      })
        .then((resp) => {
          let json = JSON.parse(this._G.decrypt(resp.data))
          console.log(json)
        })
        .catch((err) => {
          console.log('error', err)
        })
    })
  },
  methods: {
    enter () {
      this.$router.push('/MineMachines')
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
