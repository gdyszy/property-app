<template>
  <view class="body">
    <view class="itemDtail">
      
      <view class="body-top">
        <view class="body-top-t">
          <countdown bgc="#f0fbf6" :endTime="item.end_time" :startTime="item.begin_time" :Obj="em" />
        </view>
      </view>

      <view class="body-bton">
        <view class="body-bton-b">
          <view class="title">
            投票选项
            <text class="text" v-if="isVote"> 投票已开始 </text>
            <text class="text" v-else> 投票已结束 </text>
          </view>
        </view>
      </view>
     
      <view class="playerCard-top">
        <view class="playerCard-botton">
          <playerCard
            ref="touPiao"
            :content="content"
            :playerList="playerList"
            :liuLiang="liuLiang"
            :endTime="item.end_time"
            :type="1"
            :pid="pid"
            @reload="getPlayerList"
            @xiangQing="getPlayerList"
            :isVote="isVote"
          />
        </view>
      </view>
      

      <view class="rule">
        <view class="rule0">
          <view class="rule-top">投票规则</view>
          <view class="rule-bottom" v-html="content"></view>
        </view>
      </view>
    </view>

    <view class="footer-btn" v-if="isVote">
      <button class="btn" @click="saveMsg()">投票</button>
    </view>
  </view>
</template>

<script>
import countdown from '@/components/countdown/countdown.vue';
import playerCard from '@/components/player-card/player-card';
export default {
  data() {
    return {
      em: {},
      playerList: [],
      item: [],
      page: 1,
      limit: 6,
      totalPage: 0,
      pid: 0,
      content: '',
      keywords: '',
      isVote: false,
      liuLiang: '',
    };
  },
  components: {
    countdown,
    playerCard,
  },
  methods: {
    saveMsg() {
      if(this.playerList.length){
        this.$refs.touPiao.toVote();
      }else{
        uni.showToast({
          title:"无投票选项",
          icon:"none"
        })
      }
    },
    getItemDtail(id) {
      this.request({
        url: '/v1/votes/' + id,
        data: {
          handler: 'project',
        },
      }).then((res) => {
        this.item = res.data;
        // 获取当前10位时间戳
        let timestamp = new Date().valueOf() / 1000;

        // 开始时间
        let kaiShi = timestamp - this.item.begin_time;
        // 结束时间
        let jieShu = timestamp - this.item.end_time;

        if (kaiShi == 0) {
          this.isVote = true;
        } else if (kaiShi < 0) {
          this.isVote = false;
        } else if (kaiShi > 0) {
          if (jieShu >= 0) {
            this.isVote = false;
          } else {
            this.isVote = true;
          }
        }
        this.content = res.data.content;
      });
    },
    getPlayerList(id) {
      this.page = 1;
      this.request({
        url: '/v1/votes',
        data: {
          page: this.page,
          limit: this.limit,
          community_code: uni.getStorageSync('userInfo').community_code,
          handler: 'player_list',
          sort: 'sno',
          project_id: this.pid,
        },
      }).then((res) => {
        // this.liuLiang = res.data.data.total_view
        this.playerList = res.data.data;
        this.totalPage = res.data.total;
      });
    },
    loadMore() {
      this.page++;
      this.request({
        url: '/v1/votes',
        data: {
          page: this.page,
          limit: this.limit,
          community_code: uni.getStorageSync('userInfo').community_code,
          handler: 'player_list',
          sort: 'sno',
          project_id: this.pid,
        },
      }).then((res) => {
        this.playerList = [...this.playerList, ...res.data.data];
        this.totalPage = res.data.last_page;
      });
    },
    accept(data) {
      this.playerList = data.data;
      this.totalPage = data.total;
    },
    turnPage(e) {
      this.request({
        url: '/v1/votes',
        data: {
          page: e.current,
          limit: this.limit,
          community_code: uni.getStorageSync('userInfo').community_code,
          handler: 'player_list',
          sort: 'sno',
          project_id: this.pid,
        },
      }).then((res) => {
        this.playerList = res.data.data.reverse();
        this.totalPage = res.data.total;
      });
    }
  },
  onLoad(e) {
    let em = JSON.parse(decodeURIComponent(e.Item));
    this.em = em;
    this.pid = em.id.toString();
    this.getPlayerList(this.pid);
	
  },
  onShow() {
    this.getItemDtail(this.pid);
  },
  onBackPress(e) {
    // #ifdef H5 || APP-PLUS
    // 这里可以自定义返回逻辑，比如下面跳转其他页面
    uni.redirectTo({
      url: './vote',
    });
    // #endif
    // #ifdef MP-WEIXIN
    wx.redirectTo({
      url: './vote',
    });
    // #endif
    return true;
  },
};
</script>

<style lang="scss" scoped>

.body {
  background-color: #f5f5f7;
  height: 100vh;
  // width: 100vw;
}
.itemDtail {
  // width: 750rpx;
  // background-color: #F5F5F7;
  // min-height: calc(750vh - 117rpx);
  min-height: calc(100vh - 116rpx);
}

.body-bton-b {
  width: calc(100vw - 56rpx);
  margin: 0 auto;
  // display: flex;
  // justify-content: space-around;
  // align-items: center;
}

.text {
  color: #f27900;
  line-height: 100rpx;
  font-size: 26rpx;
}

.body-top {
  width: 750rpx;
  background-color: #ffffff;
}
.body-top-t {
  width: calc(100vw - 56rpx);
  margin: 0 auto;
  padding-bottom: 50rpx;
}

.playerCard-top {
  width: 750rpx;
  background-color: #ffffff;
  padding: 0rpx 0rpx 36rpx 0rpx;
}

.playerCard-botton {
  width: 694rpx;
  margin: 0 auto;
  background-color: #ffffff;
}

.body-bton {
  width: 750rpx;
  background-color: #ffffff;
}

.title {
  color: #000000e5;
  font-family: PingFang SC;
  font-weight: bold;
  font-size: 34rpx;
  text-align: left;
  height: 100rpx;
  line-height: 100rpx;
  background-color: #ffffff;
  margin-top: 20rpx;
}

.rule {
  width: 750rpx;
  background-color: #ffffff;
  margin-top: 36rpx;
  background: #f5f5f7;
}
.rule0 {
  width: calc(100vw - 56rpx);
  margin: 0 auto;
}
.rule-top {
  padding: 15rpx 0rpx;
  width: calc(100vw - 56rpx);
  margin: 0 auto;
  font-size: 28rpx;
  color: #00000066;
}

.footer-btn {
  width: 100vw;
  height: 112rpx;
  background-color: #f5f5f7;
  color: #ffffff;
  // position: fixed;
  bottom: 16rpx;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
.btn {
  color: #fff;
  // position: fixed;
  // bottom: 16rpx;
  background-color: #16bcc7;
  width: 710rpx;
  height: 96rpx;
  color: #ffffff;
  font-weight: bold;
  font-size: 34rpx;
  letter-spacing: 0rpx;
  text-align: center;
  margin-top: 16rpx;
}
.rule-bottom {
  color: #00000066;
  font-size: 28rpx;
}
</style>
