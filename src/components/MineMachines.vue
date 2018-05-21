<template>
    <div class="mm-layout">
      <mu-row gutter v-for="mine in miners">
        <mu-col width="100" :key="m.id" tablet="50" desktop="25" v-for="m in mine" :class="m.cardClass?m.cardClass:''">
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
            worker_id: 'Micro'
          }
        ]
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
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
      let dataStr = '{"method": "' + this._G.apiMethods.minersStatus + '","timeStamp": ' + (new Date()).getTime() + ',"wallet": "' + this._G.walletKey + '"}'

      this._G.ajax(dataStr, (json) => {
        if (json.code === 0) {
          // console.log(json)
          this._G.wallet = json
          this.rendMineMachines()
        } else {
          this.$emit('child-say', json.error)
        }
      }, (err) => {
        console.log(err)
        this.$emit('child-say', err.message)
      })
    },
    rendMineMachines () {
      let miners = []
      let total = this._G.wallet.user_miners_list.length
      let tail = total % 4
      total = (total + (tail ? (4 - tail) : 0))
      let ii = total / 4
      let k = 0
      for (let i = 0; i < ii; i++) {
        let mine = []
        for (let j = 0; j < 4; j++) {
          if (this._G.wallet.user_miners_list[k]) {
            mine.push(this._G.wallet.user_miners_list[k])
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
              cardClass: this._G.isMobile ? 'card-hide' : 'card-transparent'
            })
          }
          k++
        }
        console.log(JSON.stringify(mine))
        miners.push(mine)
      }
      console.log(JSON.stringify(miners))
      this.miners = miners
      setTimeout(this.refreshWallet, this.intervalMS)
    }
  }
}
</script>

<style scoped>
  .mm-layout {
    padding:20px;
  }
  .mm-layout div[class*="col-"] {

  }
  .mm-layout .card {
    background-color:#424242;
    min-height: 100px;
    margin-bottom: 18px;
    padding:10px 15px;
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
</style>
