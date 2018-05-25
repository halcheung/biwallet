<template>
  <div id="app">
    <div class="header">
      <div class="logo">
        <img src="./assets/zk_logo_white.png"/>
        <span>中矿钱包</span>
      </div>
      <div class="nav" v-show="showNav">
        <mu-tabs :value="activeTab" class="tab">
          <mu-tab value="tab1" title="矿机列表" icon="storage" @click="naviTo('MineMachines')"/>
          <mu-tab value="tab2" title="钱包" icon="account_balance_wallet" @click="naviTo('Wallet')"/>
        </mu-tabs>
        <div class="exit" @click="exit" v-show="loggedIn">
          <mu-icon value="exit_to_app" color="#ff6a9d" slot="right"/>
          <span>退出</span>
        </div>
      </div>
    </div>
    <mu-appbar class="app-title" :title="'中矿'+title">
      <mu-icon-button icon="menu" @click="toggle(true)" slot="left"/>
      <!--<mu-flat-button label="expand_more" slot="right"/>-->
      <mu-icon-menu
        v-show="showTopRightMenu"
        icon="expand_more"
        :anchorOrigin="{horizontal: 'right', vertical: 'top'}"
        :targetOrigin="{horizontal: 'right', vertical: 'top'}"
        slot="right"
      >
        <mu-menu-item title="刷新" leftIcon="refresh" @click="menuClick('refresh')" />
        <mu-divider/>
        <mu-menu-item title="提现" leftIcon="monetization_on" @click="menuClick('withdraw')" />
        <mu-menu-item title="提现方式" leftIcon="payment" @click="menuClick('withdrawMode')" />
      </mu-icon-menu>
    </mu-appbar>
    <mu-drawer :open="open" :docked="docked" @close="toggle()">
      <mu-list @itemClick="docked ? '' : toggle()">
        <mu-list-item class="menu-item" title="矿机列表" @click="naviTo('MineMachines')"><mu-icon slot="left" value="storage"/></mu-list-item>
        <mu-list-item class="menu-item" title="钱包" @click="naviTo('Wallet')"><mu-icon slot="left" value="account_balance_wallet"/></mu-list-item>
        <mu-divider/>
        <mu-list-item class="menu-item" v-show="loggedIn" title="退出" @click="exit"><mu-icon slot="left" value="exit_to_app" title="退出"/></mu-list-item>
        <mu-list-item v-if="docked" @click.native="open = false" title="Close"/>
      </mu-list>
    </mu-drawer>
    <mu-snackbar v-if="toast&&isMobile" :message="toastText" action="关闭" @actionClick="directlyHideToast" @click="directlyHideToast" />
    <mu-popup position="bottom" :overlay="false" popupClass="demo-popup-top" :open="toast&&!isMobile">
      {{toastText}}
    </mu-popup>
    <mu-dialog :open="showDialog" title="确认" @close="closeDialog">
      {{dialogMsg}}
      <mu-flat-button slot="actions" @click="closeDialog" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="okDialog" label="确定"/>
    </mu-dialog>
    <router-view v-on:child-say="listenToChild" v-on:switch-tab="listenToTab"/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      loggedIn: false,
      showNav: false,
      activeTab: '',
      open: false,
      docked: true,
      toastText: '',
      toast: false,
      isMobile: false,
      showDialog: false,
      dialogMsg: '',
      showTopRightMenu: false,
      title: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.isMobile = !!this._G.isMobile
      console.log(this.isMobile)
    })
  },
  methods: {
    menuClick (flag) {
      this._BUS.$emit('menuClickEvent', flag)
    },
    toggle (flag) {
      if (!this.loggedIn) {
        this.listenToChild('请输入钱包地址查询！')
        return
      }
      this.open = !this.open
      this.docked = !flag
    },
    listenToChild (msg) {
      this.toastText = msg
      this.toast = true
      this.hideToast()
    },
    listenToTab (tabName) {
      this.loggedIn = true
      this.showNav = true
      this.activeTab = tabName
      switch (tabName) {
        case 'tab1':
          this.title = '-矿机列表'
          this.showTopRightMenu = false
          break
        case 'tab2':
          this.title = '-钱包'
          this.showTopRightMenu = true
          break
      }
    },
    hideToast () {
      setTimeout(this.directlyHideToast, 4000)
    },
    directlyHideToast () {
      this.toastText = ''
      this.toast = false
    },
    exit () {
      this.openDialog('确定要退出登录吗？', () => {
        this.showNav = false
        this._G.deleteCookie('walletkey')
        this.$router.push('/')
        this.showTopRightMenu = false
        this.title = ''
        setTimeout(() => {
          this.loggedIn = false
        }, 500)
        this.showDialog = false
        this.okDialog = () => {}
      })
    },
    openDialog (msg, okFunc) {
      this.dialogMsg = msg
      this.showDialog = true
      this.okDialog = okFunc
    },
    closeDialog () {
      this.showDialog = false
    },
    okDialog () {
    },
    naviTo (routePath) {
      this.$router.push('/' + routePath)
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
  height:78px;
}
.exit {
  display:block;
  position: absolute;
  padding:10px;
  cursor: pointer;
  right: 20px;
  top:5px;
  width:44px;
  height: 64px;
  border-radius: 5px;
}
  .exit>span {
    font-size:12px;
    color:#ff6a9d;
  }
  .exit:hover {
    background-color:#1464b3;
  }
  .exit:active {
    background-color:#0f559b;
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
