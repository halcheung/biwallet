<template>
  <div id="app">
    <div class="header">
      <div class="logo">
        <img src="./assets/zk_logo_white.png"/>
        <span>中矿钱包</span>
      </div>
      <div class="nav">
        <mu-tabs :value="activeTab" class="tab">
          <mu-tab value="tab1" title="钱包" icon="account_balance_wallet"/>
          <mu-tab value="tab2" title="提现" icon="monetization_on"/>
        </mu-tabs>
      </div>
    </div>
    <mu-appbar class="app-title" title="中矿钱包">
      <mu-icon-button icon="menu" @click="toggle(true)" slot="left"/>
      <!--<mu-flat-button label="expand_more" slot="right"/>-->
      <mu-icon-button icon="expand_more" slot="right"/>
    </mu-appbar>
    <mu-drawer :open="open" :docked="docked" @close="toggle()">
      <mu-list @itemClick="docked ? '' : toggle()">
        <mu-list-item class="menu-item" title="钱包"><mu-icon slot="left" value="account_balance_wallet"/></mu-list-item>
        <mu-list-item class="menu-item" title="提现"><mu-icon slot="left" value="monetization_on"/></mu-list-item>
        <mu-divider/>
        <mu-list-item class="menu-item" title="退出"><mu-icon slot="left" value="exit_to_app"/></mu-list-item>
        <mu-list-item v-if="docked" @click.native="open = false" title="Close"/>
      </mu-list>
    </mu-drawer>
    <mu-snackbar v-if="toast&&isMobile" :message="toastText" action="关闭" @actionClick="directlyHideToast" @click="directlyHideToast" />
    <mu-popup position="bottom" :overlay="false" popupClass="demo-popup-top" :open="toast&&!isMobile">
      {{toastText}}
    </mu-popup>
    <router-view v-on:child-say="listenToChild"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      activeTab: 'tab1',
      open: false,
      docked: true,
      toastText: '',
      toast: false,
      isMobile: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.isMobile = !!this._G.isMobile
      console.log(this.isMobile)
    })
  },
  methods: {
    toggle (flag) {
      this.open = !this.open
      this.docked = !flag
    },
    listenToChild (msg) {
      this.toastText = msg
      this.toast = true
      this.hideToast()
    },
    hideToast () {
      setTimeout(this.directlyHideToast, 4000)
    },
    directlyHideToast () {
      this.toastText = ''
      this.toast = false
    }
  }
}
</script>

<style>
  .demo-popup-top {
    width: 100%;
    opacity: .8;
    height: 48px;
    line-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 375px;
    color:#f48;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #666;
  margin: 0;
}
.header{
  background-color: #1976d2;
  display:none;
}

.logo{
  font-size: 24px;
  color: white;
  display: inline-block;
  padding: 10px 20px 0 70px;
}
.logo>img, .logo>span {
  width:50px;
  height:50px;
  position: absolute;
  top:15px;
  left:15px;
}
.logo>span {
  width:150px;
  top:20px;
  left:80px;
}
.nav{
  display: inline-block;
  width: calc(100% - 150px);
  margin: 0 auto;
}
.tab{
  margin: 0 auto;
  width: 400px;
  /*background-color: rgba(0, 0, 0, 0);*/
}
@media screen and (min-width:480px) and (max-width:2560px) {
  .app-title {
    display:none;
  }
  .header {
    display:inherit;
  }
}
</style>
