<template>
  <div class="wl-layout">
    <mu-linear-progress class="loading" v-show="showLoading" />
    <mu-row gutter>
      <mu-col width="100" tablet="95" desktop="95">
        <mu-card class="card summary">
          <b>{{myBalance}}<mu-icon value="monetization_on" slot="right" color="#34d48b" class="all-icon" /></b>
          <span>可提现余额</span>
          <p class="btm">已冻结余额：{{blockedMoney}} &nbsp; &nbsp; &nbsp; 不可用余额：{{immature}}</p>
        </mu-card>
      </mu-col>
      <mu-col v-show="!_G.isMobile" class="pc-menu-clicker" width="0" tablet="5" desktop="5">
        <mu-card class="card">
          <mu-icon-menu
            icon="expand_more"
            :anchorOrigin="{horizontal: 'right', vertical: 'top'}"
            :targetOrigin="{horizontal: 'right', vertical: 'top'}"
            style="position:absolute;top:8px;left:50%;margin:0 0 0 -24px;"
          >
            <mu-menu-item title="刷新" leftIcon="refresh" @click="onMenuClickEvent('refresh')" />
            <mu-divider/>
            <mu-menu-item title="提现" leftIcon="monetization_on" @click="onMenuClickEvent('withdraw')" />
            <mu-menu-item title="提现方式" leftIcon="payment" @click="onMenuClickEvent('withdrawMode')" />
          </mu-icon-menu>
        </mu-card>
      </mu-col>
    </mu-row>
    <div class="tabs">
      <div :class="showBills?'on':''" @click="switchTab('bills')">账单</div>
      <div :class="showWithdrawHistory?'on':''" @click="switchTab('withdrawHistory')">提现记录</div>
    </div>
    <mu-row gutter v-show="showBills">
      <mu-col width="50" tablet="35" desktop="35">
        <mu-date-picker :container="datePickerMode" v-model="startDate" style="transform:translateY(7px);" fullWidth autoOk hintText="开始时间" :maxDate="maxDate"/>
      </mu-col>
      <mu-col width="50" tablet="35" desktop="35">
        <mu-date-picker :container="datePickerMode" v-model="endDate" style="transform:translateY(7px);" fullWidth autoOk hintText="结束时间" :maxDate="maxDate"/>
      </mu-col>
      <mu-col width="50" tablet="10" desktop="10">
        <mu-raised-button :label="selectedBillTypeName" ref="txtBillType" labelPosition="before" icon="expand_more" style="margin:10px 10px 20px 10px;width:calc(100% - 20px)" @click="toggleBillType"/>
        <mu-popover :trigger="triggerBillType" :open="openBillType" @close="handleBillTypeClose">
          <mu-menu width="120" :autoWidth="false">
            <mu-menu-item title="全部" @click="selectBillType('全部',0)" />
            <mu-menu-item title="收入" @click="selectBillType('收入',1)" />
            <mu-menu-item title="提现" @click="selectBillType('提现',2)" />
          </mu-menu>
        </mu-popover>
      </mu-col>
      <mu-col width="50" tablet="20" desktop="20">
        <mu-raised-button :disabled="btnSearchDisabled" :label="btnSearchCap" icon="search" style="margin:10px 0 20px 0;width:100%;" @click="searchBill" primary/>
      </mu-col>
    </mu-row>
    <div v-show="showBills" class="table">
      <mu-table :showCheckbox="false">
        <mu-thead>
          <mu-tr>
            <mu-th>时间</mu-th>
            <mu-th>金额</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr>
            <mu-td>2018-05-22 12:43:45</mu-td>
            <mu-td style="color:#0a5;">1500</mu-td>
          </mu-tr>
          <mu-tr>
            <mu-td>2018-05-22 11:43:42</mu-td>
            <mu-td style="color:#f6a;">-1000</mu-td>
          </mu-tr>
          <mu-tr>
            <mu-td>2018-05-22 10:43:41</mu-td>
            <mu-td style="color:#0a5;">1000</mu-td>
          </mu-tr>
          <mu-tr>
            <mu-td>2018-05-22 09:43:40</mu-td>
            <mu-td style="color:#f6a;">-500</mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
    </div>
    <mu-row gutter v-show="showWithdrawHistory">
      <mu-col width="50" tablet="35" desktop="35">
        <mu-date-picker :container="datePickerMode" v-model="startDate2" style="transform:translateY(7px);" fullWidth autoOk hintText="开始时间" :maxDate="maxDate"/>
      </mu-col>
      <mu-col width="50" tablet="35" desktop="35">
        <mu-date-picker :container="datePickerMode" v-model="endDate2" style="transform:translateY(7px);" fullWidth autoOk hintText="结束时间" :maxDate="maxDate"/>
      </mu-col>
      <mu-col width="0" tablet="10" desktop="10">
      </mu-col>
      <mu-col width="100" tablet="20" desktop="20">
        <mu-raised-button :disabled="btnSearchDisabled2" :label="btnSearchCap2" icon="search" style="margin:10px 0 20px 0;width:100%;" @click="searchWithdrawHistory" primary/>
      </mu-col>
    </mu-row>
    <div v-show="showWithdrawHistory" class="table">
      <mu-table :showCheckbox="false">
        <mu-thead>
          <mu-tr>
            <mu-th class="time-col">时间</mu-th>
            <mu-th>金额</mu-th>
            <mu-th>状态</mu-th>
          </mu-tr>
        </mu-thead>
        <mu-tbody>
          <mu-tr v-for="wh in whs" :key="wh.id">
            <mu-td @click="showDetails(wh.id)">
              {{wh.aptime}}
            </mu-td>
            <mu-td :style="'color:'+stateColors[wh.state]+';'" @click="showDetails(wh.id)">{{wh.amount}}</mu-td>
            <mu-td :style="'color:'+stateColors[wh.state]+';'" @click="showDetails(wh.id)">
              {{whStatus[wh.state]}}
              <span v-show="wh.id===whOpenId">
                {{wh.bank_name}}，{{wh.account}}，{{wh.owner_name}}<br/>
                {{wh.message}} {{wh.optime?('('+wh.optime+')'):''}}<b></b>
                <mu-icon value="clear" style="position:absolute;top:5px;right:5px;font-size:14px;"/>
              </span>
            </mu-td>
          </mu-tr>
          <mu-tr :selectable="false" class="table-bottom" style="height:100px;">
            <mu-td>&nbsp;</mu-td>
            <mu-td>&nbsp;</mu-td>
            <mu-td>&nbsp;</mu-td>
          </mu-tr>
        </mu-tbody>
      </mu-table>
    </div>
    <div class="withdraw-mode" v-show="showWithdraw" :style="'top:'+wthdMdTop+'px;'">
      <mu-row gutter>
        <mu-col width="5" tablet="30" desktop="30"></mu-col>
        <mu-col width="90" tablet="40" desktop="40">
          <mu-paper class="card" :zDepth="5">
            <mu-icon-button icon="clear" style="float:right;" @click="cancelWithdrawMode"/>
            <mu-sub-header>提现方式</mu-sub-header>
            <mu-row style="padding-left:17px;">
              <mu-col width="30" tablet="30" desktop="30" style="overflow:hidden;white-space:nowrap;">
                <mu-radio label="银行卡" name="group" nativeValue="1" v-model="withdrawType" class="demo-radio"/>
              </mu-col>
              <mu-col width="30" tablet="30" desktop="30" style="overflow:hidden;white-space:nowrap;">
                <mu-radio label="支付宝" name="group" nativeValue="2" v-model="withdrawType"  class="demo-radio"/>
              </mu-col>
              <mu-col width="30" tablet="30" desktop="30" style="overflow:hidden;white-space:nowrap;">
                <mu-radio label="微信支付" name="group" nativeValue="3" v-model="withdrawType"  class="demo-radio"/>
              </mu-col>
            </mu-row>
            <mu-text-field style="width:calc(100% - 20px);" :disabled="bankDisabled" :hintText="hintText.bankName" v-model="bankName" type="text" :errorText="errorText.bankNameErrText" @blur="removeErrTxt('bankNameErrText')" icon="account_balance"/>
            <mu-text-field style="width:calc(100% - 20px);" :hintText="hintText.bankCardNumber" v-model="bankCardNumber" type="text" :errorText="errorText.cardNumberErrText" @blur="removeErrTxt('cardNumberErrText')" icon="credit_card"/>
            <mu-text-field style="width:calc(100% - 20px);" :hintText="hintText.cardHolder" v-model="cardHolder" type="text" :errorText="errorText.cardHolderErrText" @blur="removeErrTxt('cardHolderErrText')" icon="account_circle"/>
            <mu-text-field style="width:calc(100% - 20px);" type="password" hintText="请输入密码" v-model="pswd" :errorText="errorText.pswdErrText" @blur="removeErrTxt('pswdErrText')" icon="vpn_key" @focus="pswdOnFocus"/>
            <mu-raised-button :disabled="disabled" :label="btnCaption" icon="done" style="margin:10px 20px 20px 20px;width:calc(100% - 40px)" @click.native="saveWithdrawMode" primary/>
          </mu-paper>
        </mu-col>
        <mu-col width="5" tablet="30" desktop="30"></mu-col>
      </mu-row>
    </div>

    <div class="withdraw-mode" v-show="showWithdrawApply" style="top:120px;">
      <mu-row gutter>
        <mu-col width="5" tablet="30" desktop="30"></mu-col>
        <mu-col width="90" tablet="40" desktop="40">
          <mu-paper class="card" :zDepth="5">
            <mu-icon-button icon="clear" style="float:right;" @click="cancelWithdrawApply"/>
            <mu-sub-header>申请提现</mu-sub-header>
            <mu-text-field style="width:calc(100% - 20px);" hintText="提现金额" v-model="withdrawAmount" type="text" :errorText="errorText.withdrawAmountErrText" @blur="removeErrTxt('withdrawAmountErrText')" icon="attach_money"/>
            <mu-text-field style="width:calc(100% - 20px);" type="password" hintText="请输入密码" v-model="pswd" :errorText="errorText.pswdErrText" @blur="removeErrTxt('pswdErrText')" icon="vpn_key"/>
            <mu-raised-button :disabled="wDisabled" :label="btnWCaption" icon="done" style="margin:10px 20px 20px 20px;width:calc(100% - 40px)" @click.native="applyWithdraw" primary/>
          </mu-paper>
        </mu-col>
        <mu-col width="5" tablet="30" desktop="30"></mu-col>
      </mu-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Wallet',
  data () {
    return {
      showBills: true,
      showWithdrawHistory: false,
      wthdMdTop: 120,
      openBillType: false,
      triggerBillType: null,
      selectedBillType: 0,
      selectedBillTypeName: '全部',
      maxDate: '',
      startDate: '',
      endDate: '',
      startDate2: '',
      endDate2: '',
      datePickerMode: '',
      btnCaption: '保存',
      disabled: false,
      showLoading: false,
      myBalance: 0,
      blockedMoney: 0,
      immature: 0,
      withdrawType: '1',
      prevWithdrawType: '1',
      originBankName: '',
      originBankCardNumber: '',
      originCardHolder: '',
      bankName: '',
      bankCardNumber: '',
      cardHolder: '',
      bankDisabled: false,
      pswd: '',
      errorText: {
        bankNameErrText: '',
        cardNumberErrText: '',
        cardHolderErrText: '',
        pswdErrText: '',
        withdrawAmountErrText: ''
      },
      hintText: {
        bankName: '银行名称',
        bankCardNumber: '银行卡号',
        cardHolder: '持卡人姓名',
        pswdText: '操作密码'
      },
      tempValue: [{}, {
        bankName: '',
        bankCardNumber: '',
        cardHolder: ''
      }, {
        bankName: '支付宝',
        bankCardNumber: '',
        cardHolder: ''
      }, {
        bankName: '微信支付',
        bankCardNumber: '',
        cardHolder: ''
      }],
      showWithdraw: false,
      showWithdrawApply: false,
      btnSearchCap: '查询',
      btnSearchDisabled: false,
      btnSearchCap2: '查询',
      btnSearchDisabled2: false,
      whStatus: [
        '待处理', '成功', '失败'
      ],
      whs: [],
      whOpenId: -1,
      stateColors: [
        '#39e', '#0a5', '#f6a'
      ],
      withdrawAmount: '',
      btnWCaption: '申请',
      wDisabled: false
    }
  },
  mounted () {
    this.triggerBillType = this.$refs.txtBillType.$el
    this.$nextTick(() => {
      this.$emit('switch-tab', 'tab2')
      this._G.currentPath = 'Wallet'
      this.datePickerMode = this._G.isMobile ? 'dialog' : 'inline'
      this.wthdMdTop = this._G.isMobile ? 10 : 120
      let d = new Date()
      this.maxDate = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2)
      this._BUS.$on('menuClickEvent', this.onMenuClickEvent)
      this.showLoading = true
      this.loadBalance()
      this.loadWithdrawMode()
    })
  },
  methods: {
    switchTab (tab) {
      this.showBills = false
      this.showWithdrawHistory = false
      switch (tab) {
        case 'bills':
          this.showBills = true
          break
        case 'withdrawHistory':
          this.showWithdrawHistory = true
          break
      }
    },
    searchWithdrawHistory () {
      if (this._G.currentPath !== 'Wallet') return
      this._G.walletKey = this._G.getCookie('walletkey') ? this._G.getCookie('walletkey') : null
      if (!this._G.walletKey) {
        this.$router.push('/')
        return
      }

      this.btnSearchCap2 = '正在查询……'
      this.btnSearchDisabled2 = true
      let dataStr = '{"method": "' + this._G.apiMethods.getWithdrawHistory + '","timeStamp": ' + (new Date()).getTime() + ',"wallet": "' + this._G.walletKey + '","begin":"' + this.startDate2 + '","end":"' + this.endDate2 + '"}'

      this.showLoading = true
      console.log(dataStr)
      this._G.ajax(dataStr, (json) => {
        if (json.code === 0) {
          console.log(json)
          for (let i = 0; i < json.list.length; i++) {
            json.list[i].open = false
          }
          this.whs = json.list
        } else {
          this.$emit('child-say', json.error)
        }
        this.showLoading = false
        this.btnSearchCap2 = '查询'
        this.btnSearchDisabled2 = false
      }, (err) => {
        console.log(err)
        this.$emit('child-say', err.message)
        this.showLoading = false
        this.btnSearchCap2 = '查询'
        this.btnSearchDisabled2 = false
      })
    },
    showDetails (id) {
      if (this.whOpenId === id) {
        this.whOpenId = ''
        return
      }
      this.whOpenId = id
      console.log(id)
      console.log(this.whOpenId)
    },
    searchBill () {
      if (this._G.currentPath !== 'Wallet') return
      this._G.walletKey = this._G.getCookie('walletkey') ? this._G.getCookie('walletkey') : null
      if (!this._G.walletKey) {
        this.$router.push('/')
        return
      }

      this.btnSearchCap = '正在查询……'
      this.btnSearchDisabled = true
      let dataStr = '{"method": "' + this._G.apiMethods.getBill + '","timeStamp": ' + (new Date()).getTime() + ',"wallet": "' + this._G.walletKey + '","type":' + this.selectedBillType + ',"begin":"' + this.startDate + '","end":"' + this.endDate + '"}'

      this.showLoading = true
      console.log(dataStr)
      this._G.ajax(dataStr, (json) => {
        if (json.code === 0) {
          console.log(json)
        } else {
          this.$emit('child-say', json.error)
        }
        this.showLoading = false
        this.btnSearchCap = '查询'
        this.btnSearchDisabled = false
      }, (err) => {
        console.log(err)
        this.$emit('child-say', err.message)
        this.showLoading = false
        this.btnSearchCap = '查询'
        this.btnSearchDisabled = false
      })
    },
    toggleBillType () {
      this.openBillType = !this.openBillType
    },
    handleBillTypeClose () {
      this.openBillType = false
    },
    selectBillType (name, value) {
      this.selectedBillTypeName = name
      this.selectedBillType = value
      this.openBillType = false
    },
    loadWithdrawMode () {
      if (this._G.currentPath !== 'Wallet') return
      this._G.walletKey = this._G.getCookie('walletkey') ? this._G.getCookie('walletkey') : null
      if (!this._G.walletKey) {
        this.$router.push('/')
        return
      }
      let dataStr = '{"method": "' + this._G.apiMethods.getWithdrawMode + '","timeStamp": ' + (new Date()).getTime() + ',"wallet": "' + this._G.walletKey + '"}'

      this.showLoading = true
      console.log(dataStr)
      this._G.ajax(dataStr, (json) => {
        if (json.code === 0) {
          console.log(json)
          this.withdrawType = json.type.toString()
          this.prevWithdrawType = json.type.toString()
          this.originBankName = json.bank_name
          this.originBankCardNumber = json.account
          this.originCardHolder = json.owner_name
          this.bankName = this.originBankName
          this.bankCardNumber = this.originBankCardNumber
          this.cardHolder = this.originCardHolder
          this.showLoading = false
        } else {
          this.$emit('child-say', json.error)
          this.showLoading = false
        }
      }, (err) => {
        console.log(err)
        this.$emit('child-say', err.message)
        this.showLoading = false
      })
    },
    pswdOnFocus () {
      if (this._G.isMobile) {
        this.wthdMdTop = -50
      }
    },
    cancelWithdrawMode () {
      this.tempValue = [{}, {
        bankName: '',
        bankCardNumber: '',
        cardHolder: ''
      }, {
        bankName: '支付宝',
        bankCardNumber: '',
        cardHolder: ''
      }, {
        bankName: '微信支付',
        bankCardNumber: '',
        cardHolder: ''
      }]
      this.bankName = this.originBankName
      this.bankCardNumber = this.originBankCardNumber
      this.cardHolder = this.originCardHolder
      this.pswd = ''
      setTimeout(() => {
        this.showWithdraw = false
      }, 200)
    },
    applyWithdraw () {
      if (this._G.currentPath !== 'Wallet') return
      this._G.walletKey = this._G.getCookie('walletkey') ? this._G.getCookie('walletkey') : null
      if (!this._G.walletKey) {
        this.$router.push('/')
        return
      }
      let amt = this.withdrawAmount
      if (!amt) {
        this.errorText.withdrawAmountErrText = '请填写提现金额！'
        return
      }
      if (isNaN(amt)) {
        this.withdrawAmount = ''
        this.errorText.withdrawAmountErrText = '请填写提现金额！'
        return
      }
      amt = Math.abs(parseInt(amt, 10))
      this.withdrawAmount = amt
      if (amt < 1) {
        this.errorText.withdrawAmountErrText = '提现金额至少1元！'
        return
      }
      if (amt > this.myBalance) {
        this.errorText.withdrawAmountErrText = '提现金额不能大于账户余额 ' + this.myBalance + ' ！'
        return
      }
      if (!this.pswd) {
        this.errorText.pswdErrText = '请填写操作密码！'
        return
      }

      this.wDisabled = true
      this.btnWCaption = '正在申请……'
      this.showLoading = true
      let dataStr = '{"method": "' + this._G.apiMethods.withdraw + '","timeStamp": ' + (new Date()).getTime() + ',"wallet": "' + this._G.walletKey + '"'
      dataStr += ',"amount":' + this.withdrawAmount + ',"password":"' + this._G.md5(this.pswd) + '"}'

      console.log(dataStr)
      this._G.ajax(dataStr, (json) => {
        if (json.code === 0) {
          console.log(json)

          this.withdrawAmount = ''
          this.pswd = ''

          this.resetApply('提交成功！')
          this.$emit('child-say', '提交成功！')

          setTimeout(() => {
            this.showWithdrawApply = false
            this.switchTab('withdrawHistory')
          }, 500)
          setTimeout(() => {
            this.searchWithdrawHistory()
          }, 1000)
        } else {
          this.$emit('child-say', json.error)
          this.resetApply()
        }
      }, (err) => {
        console.log(err)
        this.$emit('child-say', err.message)
        this.resetApply()
      })
    },
    resetApply (caption) {
      setTimeout(() => {
        this.wDisabled = false
        this.btnWCaption = caption || '提交'
        this.showLoading = false
        if (this.btnWCaption !== '提交') {
          setTimeout(() => {
            this.btnWCaption = '提交'
          }, 1000)
        }
      }, 500)
    },
    cancelWithdrawApply () {
      this.withdrawAmount = ''
      this.pswd = ''
      setTimeout(() => {
        this.showWithdrawApply = false
      }, 200)
    },
    saveWithdrawMode () {
      if (this._G.currentPath !== 'Wallet') return
      this._G.walletKey = this._G.getCookie('walletkey') ? this._G.getCookie('walletkey') : null
      if (!this._G.walletKey) {
        this.$router.push('/')
        return
      }
      this.bankName = this.bankName.replace(/"/gi, '”').replace(/'/gi, '’')
      this.bankCardNumber = this.bankCardNumber.replace(/"/gi, '”').replace(/'/gi, '’')
      this.cardHolder = this.cardHolder.replace(/"/gi, '”').replace(/'/gi, '’')
      if (!this.bankName.trim()) {
        this.errorText.bankNameErrText = '请填写银行名称！'
        return
      }
      if (!this.bankCardNumber.trim()) {
        this.errorText.cardNumberErrText = this.withdrawType === '1' ? '请填写银行卡号！' : (this.withdrawType === '2' ? '请填写支付宝账号！' : '请填写微信号！')
        return
      }
      if (!this.cardHolder.trim()) {
        this.errorText.cardHolderErrText = this.withdrawType === '1' ? '请填写持卡人姓名！' : '请填写所有人姓名！'
        return
      }
      if (!this.pswd) {
        this.errorText.pswdErrText = '请填写操作密码！'
        return
      }

      this.disabled = true
      this.btnCaption = '正在保存……'
      this.showLoading = true

      let dataStr = '{"method": "' + this._G.apiMethods.setWithdrawMode + '","timeStamp": ' + (new Date()).getTime() + ',"wallet": "' + this._G.walletKey + '"'
      dataStr += ',"type":' + this.withdrawType + ',"bank_name":"' + this.bankName + '","account":"' + this.bankCardNumber + '","owner_name":"' + this.cardHolder + '","password":"' + this._G.md5(this.pswd) + '"}'

      console.log(dataStr)
      this._G.ajax(dataStr, (json) => {
        if (json.code === 0) {
          console.log(json)

          this.withdrawType = this.withdrawType.toString()
          this.prevWithdrawType = this.withdrawType.toString()
          this.originBankName = this.bankName
          this.originBankCardNumber = this.bankCardNumber
          this.originCardHolder = this.cardHolder
          this.pswd = ''

          this.resetSaving('保存成功！')
        } else {
          this.$emit('child-say', json.error)
          this.resetSaving()
        }
      }, (err) => {
        console.log(err)
        this.$emit('child-say', err.message)
        this.resetSaving()
      })
    },
    resetSaving (caption) {
      setTimeout(() => {
        this.disabled = false
        this.btnCaption = caption || '保存'
        this.showLoading = false
        if (this.btnCaption !== '保存') {
          setTimeout(() => {
            this.btnCaption = '保存'
          }, 1000)
        }
      }, 500)
    },
    removeErrTxt (field) {
      this.errorText[field] = ''
      if (field === 'pswdErrText') {
        if (this._G.isMobile) {
          this.wthdMdTop = 10
        }
      }
    },
    onMenuClickEvent (flag) {
      console.log(flag)
      switch (flag) {
        case 'refresh':
          this.myBalance = 0
          this.showLoading = true
          setTimeout(this.loadBalance, 200)
          break
        case 'withdraw':
          this.showWithdrawApply = true
          break
        case 'withdrawMode':
          this.showWithdraw = true
          this.loadWithdrawMode()
          break
        case 'withdrawLog':
          break
      }
    },
    loadBalance () {
      if (this._G.currentPath !== 'Wallet') return
      this._G.walletKey = this._G.getCookie('walletkey') ? this._G.getCookie('walletkey') : null
      if (!this._G.walletKey) {
        this.$router.push('/')
        return
      }
      let dataStr = '{"method": "' + this._G.apiMethods.accBalance + '","timeStamp": ' + (new Date()).getTime() + ',"wallet": "' + this._G.walletKey + '"}'

      console.log(dataStr)
      this._G.ajax(dataStr, (json) => {
        if (json.code === 0) {
          console.log(json)
          this.myBalance = json.available ? json.available : json.available.toFixed(2)
          this.blockedMoney = json.blocked ? json.blocked : json.blocked.toFixed(2)
          this.immature = json.immature ? json.immature : json.immature.toFixed(2)
          this.showLoading = false
        } else {
          this.$emit('child-say', json.error)
          this.showLoading = false
        }
      }, (err) => {
        console.log(err)
        this.$emit('child-say', err.message)
        this.showLoading = false
      })
    },
    changeType () {
      this.tempValue[this.prevWithdrawType * 1] = {
        bankName: this.bankName,
        bankCardNumber: this.bankCardNumber,
        cardHolder: this.cardHolder
      }

      switch (this.withdrawType) {
        case '1':
          this.hintText = {
            bankName: '银行名称',
            bankCardNumber: '银行卡号',
            cardHolder: '持卡人姓名'
          }
          this.bankDisabled = false
          this.bankName = this.tempValue[1].bankName
          this.bankCardNumber = this.tempValue[1].bankCardNumber
          this.cardHolder = this.tempValue[1].cardHolder
          break
        case '2':
          this.hintText = {
            bankName: '机构名称',
            bankCardNumber: '支付宝账户',
            cardHolder: '所有人姓名'
          }
          this.bankDisabled = true
          this.bankName = '支付宝'
          this.bankName = this.tempValue[2].bankName
          this.bankCardNumber = this.tempValue[2].bankCardNumber
          this.cardHolder = this.tempValue[2].cardHolder
          break
        case '3':
          this.hintText = {
            bankName: '机构名称',
            bankCardNumber: '微信号',
            cardHolder: '所有人姓名'
          }
          this.bankDisabled = true
          this.bankName = '微信支付'
          this.bankName = this.tempValue[3].bankName
          this.bankCardNumber = this.tempValue[3].bankCardNumber
          this.cardHolder = this.tempValue[3].cardHolder
          break
      }

      this.prevWithdrawType = this.withdrawType
    }
  },
  watch: {
    withdrawType () {
      this.changeType()
    }
  }
}
</script>

<style scoped>
  .wl-layout {
    padding:20px;
    position: relative;
    height: 100%;
  }
  .loading {
    position: absolute;
    top:0;
    left:0;
  }
  .wl-layout div[class*="col-"] {

  }
  .wl-layout .card {
    background-color:#424242;
    min-height: 100px;
    margin-bottom: 18px;
    padding:10px 15px;
    overflow: hidden;
  }
  .wl-layout .summary {
    background-color:#00a65a;
    padding:0;
  }
  .wl-layout .card>b {
    color:#fff;
    display:block;
    font-size:28px;
    line-height: 32px;
    padding:13px 0 0 15px;
  }
  .wl-layout .card>b>.all-icon {
    position: absolute;
    top:10px;
    right:10px;
    font-size:50px;
  }
  .wl-layout .card>span {
    color:#fff;
    display:block;
    font-size:12px;
    line-height:22px;
    padding:0 15px;
    opacity: 0.8;
  }
  .wl-layout .card>p.btm {
    background-color:#008c4c;
    display: block;
    position: absolute;
    width:100%;
    height: 24px;
    bottom:0;
    left:0;
    top:auto;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    font-size:12px;
    color:#1ebd74;
    text-align: right;
    padding-right:10px;
    line-height: 27px;
    overflow: hidden;
    margin-bottom: 0;
  }
  .wl-layout .card>p.btm>strong, .wl-layout .card>p.btm>em {
    font-style: normal;
    color:#fff;
  }
  .wl-layout .card>p.btm>strong {
    color:#1ebd74;
  }
  .withdraw-mode {
    position: fixed;
    top:120px;
    left:0;
    width:100%;
    bottom:0;
    z-index:100;
  }
  .tabs {
    height: 50px;
  }
  .tabs>div {
    display:block;
    float:left;
    width:160px;
    height: 50px;
    background-color:#292929;
    text-align:center;
    color:#555;
    font-size:18px;
    line-height:54px;
    border-radius: 4px;
    transition:all 0.3s;
    cursor: pointer;
  }
  .tabs>div.on {
    color:#1976d2;
    background-color:transparent;
    border-top:solid 2px #f06;
    transform: translateY(-2px);
    font-size:20px;
    cursor: default;
  }
  .tabs>div:active {
    background-color:#222;
  }
  .tabs>div.on:active {
    background-color:transparent;
  }
  .time-col {
    width:auto;
  }
  td {
    cursor: pointer;
    position: relative;
  }
  td>span {
    display:block;
    position:absolute;
    width:100%;
    height:auto;
    padding:10px;
    background-color:#000;
    border-radius:5px;
    top:46px;
    right:0;
    z-index:100;
  }
  td>span>b {
    display:block;
    position:absolute;
    width:10px;
    height:10px;
    top:-5px;
    right:auto;
    left: 30px;
    background-color:#000;
    transform: rotateZ(-45deg);
  }
  table, tbody, tr, td, .table {
    overflow: visible;
  }
  .table-bottom {
    pointer-events: none;
  }
  .table-bottom:hover {
    background-color:transparent;
  }
  @media screen and (min-width:200px) and (max-width:480px) {
    .withdraw-mode {
      position: fixed;
      top:10px;
      left:0;
      width:100%;
      bottom:0;
      z-index:100;
    }
    .pc-menu-clicker {
      display:none;
    }
    .tabs>div {
      width:50%;
    }
    .time-col {
      width:160px;
    }
    td>span {
      display:block;
      position:absolute;
      width:320px;
      height:auto;
      padding:10px;
      background-color:#000;
      border-radius:5px;
      top:46px;
      right:0;
      z-index:100;
    }
    td>span>b {
      display:block;
      position:absolute;
      width:10px;
      height:10px;
      top:-5px;
      left:auto;
      right: 30px;
      background-color:#000;
      transform: rotateZ(-45deg);
    }
  }
</style>
