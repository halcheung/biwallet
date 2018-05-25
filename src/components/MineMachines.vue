<template>
    <div class="mm-layout">
      <mu-linear-progress class="loading" v-show="showLoading&&firstLoad" />
      <mu-row gutter>
        <mu-col width="50" tablet="50" desktop="50">
          <mu-card class="card summary">
            <b>{{allMiners}}<mu-icon value="storage" slot="right" color="#378fe6" class="all-icon" /></b>
            <span>中矿全网矿机数</span>
            <p class="btm">{{lastUpdate}}</p>
          </mu-card>
        </mu-col>
        <mu-col width="50" tablet="50" desktop="50">
          <mu-card class="card my-sum">
            <b>{{myMiners}}<mu-icon value="dvr" slot="right" color="#ff96ba" class="all-icon" /></b>
            <span>我的矿机</span>
            <p class="btm" style="background-color:#e62466;color:#ff90b6;">在线 <strong>{{myOnlines}}</strong> 台 = <em>{{allMyPowers}} Sol/s</em></p>
          </mu-card>
        </mu-col>
      </mu-row>
      <mu-row gutter v-for="(mine,index) in miners" :key="index">
        <mu-col width="100" :key="index*4+idx" tablet="50" desktop="25" v-for="(m,idx) in mine" :class="m.cardClass?m.cardClass:''">
          <mu-card :class="'card'+(m.online?'':' offline')">
            <h3><mu-icon class="mine-icon" :color="m.online?'#f42870':'#777'" value="desktop_windows"/><em v-show="!m.online">下线</em>矿机#{{m.id}}</h3>
            <p>
              <b>启动时间</b>
              <span>{{m.launch_time}}</span>
            </p>
            <p>
              <b>运行时间</b>
              <span>{{runTimeSpan(m.launch_time)}}</span>
            </p>
            <p>
              <b>IP地址</b>
              <span>{{m.ip_address}}</span>
            </p>
            <p>
              <b>TV账户</b>
              <span>{{m.tv_account}}</span>
            </p>
            <p>
              <b>矿机号</b>
              <span>{{m.worker_id}}</span>
            </p>
            <p>
              <b>币种</b>
              <span>{{m.coin_idx}}</span>
            </p>
            <p>
              <b>矿池</b>
              <span>{{m.pool_idx}}</span>
            </p>
            <p>
              <b>累计提交</b>
              <span>{{m.accepted}}</span>
            </p>
            <p>
              <b>算力</b>
              <span class="sol">{{m.hash_rate}}</span>
            </p>
            <p>
              <b>最后提交</b>
              <span>{{lastSubmit(m.last_submit)}}</span>
            </p>
          </mu-card>
        </mu-col>
      </mu-row>
    </div>
</template>

<script>
export default {
  name: 'MineMachines',
  data () {
    return {
      intervalMS: 5000,
      showLoading: false,
      firstLoad: true,
      miners: [
        [
          {
            accepted: 1147,
            coin_idx: 2,
            devices: 'Ellesmere,Ellesmere,Ellesmere,Ellesmere,Ellesmere,Ellesmere,',
            guid: '00e0706e4b9b4c44534c373132363032',
            hash_rate: '314.63 Sol/s',
            id: 1,
            ip_address: '218.22.237.30',
            last_submit: '2018-05-20 21:00:00',
            launch_time: '2018-05-20 21:00:00',
            pool_idx: 1,
            tv_account: '',
            worker_id: 'Micro'
          }
        ]
      ],
      lastUpdate: '最后更新：0000-00-00 00:00:00',
      allMiners: 0,
      myMiners: 0,
      myOnlines: 0,
      allMyPowers: 0.00
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (!this._G.getCookie('walletkey')) {
        this.$router.push('/')
        return
      }
      this._G.walletKey = this._G.getCookie('walletkey')
      console.log(this._G.walletKey)
      this.$emit('switch-tab', 'tab1')
      this._G.currentPath = 'MineMachines'
      if (this._G.isMobile) {
        this.lastUpdate = '最后更新 00-00 00:00'
      }
      this.rendMineMachines()
    })
  },
  methods: {
    calcTimeSpan (date) {
      let diff = new Date().getTimezoneOffset() / 60
      // console.log(diff)
      let dt = new Date(date.replace(/-/gi, '/'))
      // console.log(dt)
      // console.log(new Date())
      let ts = parseInt((new Date()) - dt, 10)
      dt = new Date(ts)
      return {
        s: dt.getSeconds(),
        m: dt.getMinutes(),
        h: dt.getHours() + diff,
        d: dt.getDate() - 1
      }
    },
    runTimeSpan (date) {
      let dt = this.calcTimeSpan(date)
      return dt.d + 'd:' + ('0' + dt.h).substr(-2) + 'h:' + ('0' + dt.m).substr(-2) + 'm:' + ('0' + dt.s).substr(-2) + 's'
    },
    lastSubmit (date) {
      let dt = this.calcTimeSpan(date)
      if (dt.d < 1) {
        if (dt.h > 0) {
          return dt.h + '小时之前'
        } else if (dt.m > 0) {
          return dt.m + '分钟之前'
        } else {
          return dt.s + '秒钟之前'
        }
      } else {
        return dt.d + '天之前'
      }
    },
    refreshWallet () {
      if (this._G.currentPath !== 'MineMachines') return
      this._G.walletKey = this._G.getCookie('walletkey') ? this._G.getCookie('walletkey') : null
      if (!this._G.walletKey) {
        this.$router.push('/')
        return
      }
      this.showLoading = true
      let dataStr = '{"method": "' + this._G.apiMethods.minersStatus + '","timeStamp": ' + (new Date()).getTime() + ',"wallet": "' + this._G.walletKey + '"}'

      // console.log(dataStr)
      this._G.ajax(dataStr, (json) => {
        if (json.code === 0) {
          // console.log(json)
          this._G.wallet = json
          this.rendMineMachines()
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
    rendMineMachines () {
      if (!this._G.wallet.user_miners_list) {
        this.refreshWallet()
        return
      }
      let miners = []
      let total = this._G.wallet.user_miners_list.length
      this.allMiners = this._G.wallet.net_alive_miners
      let tail = total % 4
      total = (total + (tail ? (4 - tail) : 0))
      let ii = total / 4
      let k = 0
      this.myMiners = 0
      this.allMyPowers = 0
      this.myOnlines = 0
      for (let i = 0; i < ii; i++) {
        let mine = []
        for (let j = 0; j < 4; j++) {
          if (this._G.wallet.user_miners_list[k]) {
            mine.push(this._G.wallet.user_miners_list[k])
            this.myMiners++
            if (this._G.wallet.user_miners_list[k].online) {
              this.myOnlines++
            }
            let power = parseFloat((this._G.wallet.user_miners_list[k].hash_rate.split(' ')[0] * 1.0).toFixed(2), 10)
            console.log(power)
            this.allMyPowers += power
            this.allMyPowers = Math.round(this.allMyPowers * 100) / 100
          } else {
            mine.push({
              accepted: 0,
              coin_idx: 0,
              devices: '',
              guid: '',
              hash_rate: '',
              id: 0,
              ip_address: '',
              last_submit: '1970-01-01 00:00:00',
              launch_time: '1970-01-01 00:00:00',
              pool_idx: 0,
              worker_id: '',
              tv_account: '',
              cardClass: this._G.isMobile ? 'card-hide' : 'card-transparent'
            })
          }
          k++
        }
        console.log(JSON.stringify(mine))
        miners.push(mine)
        let today = new Date()
        if (this._G.isMobile) {
          this.lastUpdate = '最后更新 ' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2) +
            ' ' + ('0' + today.getHours()).substr(-2) + ':' + ('0' + today.getMinutes()).substr(-2)
        } else {
          this.lastUpdate = '最后更新时间：' + today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).substr(-2) + '-' + ('0' + today.getDate()).substr(-2) +
            ' ' + ('0' + today.getHours()).substr(-2) + ':' + ('0' + today.getMinutes()).substr(-2) + ':' + ('0' + today.getSeconds()).substr(-2)
        }
      }
      this.showLoading = false
      this.firstLoad = false
      console.log(JSON.stringify(miners))
      this.miners = miners
      setTimeout(this.refreshWallet, this.intervalMS)
    }
  }
}
</script>

<style scoped>
  .mm-layout {
    position: relative;
    padding:20px;
  }
  .loading {
    position: absolute;
    top:0;
    left:0;
  }
  .mm-layout div[class*="col-"] {

  }
  .mm-layout .card {
    background-color:#424242;
    min-height: 100px;
    margin-bottom: 18px;
    padding:10px 15px;
  }
  .mm-layout .summary {
    background-color:#1976d2;
    padding:0;
  }
  .mm-layout .my-sum {
    background-color:#ff4081;
    padding:0;
  }
  .mm-layout .card>b {
    color:#fff;
    display:block;
    font-size:28px;
    line-height: 32px;
    padding:13px 0 0 15px;
  }
  .mm-layout .card>b>.all-icon {
    position: absolute;
    top:10px;
    right:10px;
    font-size:50px;
  }
  .mm-layout .card>span {
    color:#fff;
    display:block;
    font-size:12px;
    line-height:22px;
    padding:0 15px;
    opacity: 0.8;
  }
  .mm-layout .offline {
    opacity: 0.3;
  }
  .mm-layout .card-transparent {
    opacity: 0;
  }
  .mm-layout .card-hide {
    display:none;
  }
  .mm-layout .card>h3 {
    font-size:22px;
    margin:0;
    padding:0;
    color:#1976d2;
    border-bottom:solid 1px #555;
    margin-bottom:10px;
    padding-bottom:4px;
  }
  .mm-layout .offline>h3 {
    color:#777;
  }
  .mm-layout .offline>h3>em {
    font-size:12px;
    color:#aaa;
    display:block;
    float:right;
  }
  .mm-layout .card>h3>.mine-icon {
    vertical-align: middle;
    transform:translateY(-2px);
    display:inline-block;
    margin-right:10px;
  }
  .mm-layout .offline>h3>.mine-icon {
    color:#777;
  }
  .mm-layout .card>p {
    padding:0;
    margin:0;
  }
  .mm-layout .card>p>b, .mm-layout .card>p>span {
    color:#777;
    display:inline-block;
    width:70px;
    font-size:14px;
    vertical-align: middle;
  }
  .mm-layout .card>p>span {
    color:#ccc;
    width:auto;
    white-space: nowrap;
    overflow: hidden;
  }
  .mm-layout .card>p>.sol {
    color:#feffae;
  }
  .mm-layout .card>p.btm {
    background-color:#1565b5;
    display: block;
    position: absolute;
    width:100%;
    height: 24px;
    bottom:0;
    left:0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    font-size:12px;
    color:#4d9ff1;
    text-align: right;
    padding-right:10px;
    line-height: 27px;
    overflow: hidden;
  }
  .mm-layout .card>p.btm>strong, .mm-layout .card>p.btm>em {
    font-style: normal;
    color:#fff;
  }
  .mm-layout .card>p.btm>strong {
    color:#94e749;
  }
</style>
