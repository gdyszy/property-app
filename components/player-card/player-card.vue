<template>
  <view class="playerList">
    <!-- 		<view class="player" v-for="(item,index) in playerList" @click="goDtail(item.id,type)">
			<image :src="item.image?item.image:'/static/images/index/logo.png'" class="avartar"></image>
			<view class="name fw700 mt-1">
				{{item.sno}}.{{item.name}}
			</view>
			<view class="introduce fw700 mt-1">
				{{item.introduce}}
			</view>
			<view class="vote-num mt-1">
				当前得票：<text>{{item.vote_num}}</text> 票
			</view>
			<view class="view mt-1">
				<image src="/static/images/index/btn_06_view.png" class="view-img"></image>
				总浏览量：{{item.total_view}}
			</view>
			<view class="voteBtn fw700 mt-1" @click.stop="$antishake(toVote,item.id)" v-if="isVote">
				点击投票
			</view>
		</view> -->
		<view v-if="details">
			<view class="players" v-for="(item, index) in playerList" :key="index">
			  <view class="center">
			    <view class="player-top">·</view>
			    <view class="player-botton">
						<view class="player-botton-top">
							<view class="name">{{ item.name }}</view>
							<view class="vote-num" style="color: rgba(242,121,0,1);"><text style="color: #888888;">{{ item.vote_num }}</text>票</view>
						</view>
			      <view class="player-botton-center">
							编号{{item.sno}}
						</view>
						<view class="player-botton-bottom">
							{{item.introduce}}
						</view>
			    </view>
			  </view>
			</view>
			<view class="piao">
				<view class="piao-left">·</view>
			  <view class="piao-right">
					<view>总票数</view>
					<view>{{participation}}票</view>
				</view>
			</view>
		</view>
		
		<view v-else>
			<view v-for="(item, index) in playerList" :key="index" @click="imageBtn(item.id)" class="theOwner">
				<view class="theOwner-left-image" @click="imagess(index, item)" v-if="isVote">
					<image v-if="index == images" src="/static/common/btn_Picker_ture.png" class="icon"></image>
					<image v-if="index != images" src="/static/common/btn_Picker_false.png"  class="icon"></image>
				</view>
				<view class="theOwner-left" v-else="isVote">·</view>
				<view class="theOwner-right">
					<view class="theOwner-right-top">
						<view class="left">{{item.name}}</view>
						<view class="right">{{item.vote_num}}票</view>
					</view>
					<view class="theOwner-right-center">编号{{item.sno}}</view>
					<view class="theOwner-right-bottom">{{item.introduce}}</view>
				</view>
			</view>
		</view>
  </view>
</template>

<script>
export default {
  props: {
    playerList: {
      type: Array,
      default: [],
    },
    type: {
      type: Number,
      default: 0,
    },
    pid: {
      type: String,
      default: '',
    },
    reload: {
      type: Function,
      default: null,
    },
    isVote: {
      type: Boolean,
      default: false,
    },
    endTime: {
      type: Number,
      default: 0,
    },
    zhuangTai: {
      type: Boolean,
      default: true,
    },
    liuLiang: {
      type: String,
    },
    content: {
      type: String,
    },
		details: {
			type: Boolean,
			default:false
		}
  },
  name: 'playerCard',
  watch: {
    playerList() {
      var that = this
      for (let i = 0; i < that.playerList.length; i++) {
        that.participation = that.playerList[i].vote_num + that.participation
        // console.log(that.participation)
      }
      this.playerId = that.playerList[0].id
    },
  },
  data() {
    return {
      noClick: true, //防抖必需
      date: new Date().getTime(),
      images: '',
      vote_num: '',
      participation: 0,
      playerId: '',
      jieLiu: true
    }
  },
  methods: {
	  to() {
		  console.log(this.playerList)
	  },
    imagess(index) {
      this.images = index
    },
    imageBtn(e) {
      this.playerId = e
    },
    goAdd() {
      uni.navigateTo({
        url: '/pages/wy/vote/addPlayer/addPlayer?pid=' + this.pid,
      })
    },
    goDtail(id, type) {
      if (type == 1) {
        this.toView(id)
        uni.navigateTo({
          url:
            '/pages/vote/playerDtail?id=' +
            id +
            '&isVote=' +
            this.isVote +
            '&pid=' +
            this.pid,
        })
        setTimeout(this.diaoYong, 1000)
      }
      if (type == 2) {
        uni.navigateTo({
          url:
            '/pagesWY/vote/playerDtail/playerDtail?id=' +
            id +
            '&zhuangTai=' +
            this.zhuangTai,
        })
      }
    },
    diaoYong() {
      this.$emit('xiangQing')
    },
    toVote() {
      if (this.jieLiu) {
        this.jieLiu = false
        let overdue = this.endTime * 1000 - this.date
        if (overdue < 0) {
          uni.showToast({
            title: '投票已结束',
            icon: 'none',
          })
          return
        } else {
          let header = {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
          let data = {
            handler: 'vote',
          }
          this.request({
            url: '/v1/votes/' + this.playerId,
            method: 'PUT',
            header: header,
            data: data,
          }).then((res) => {
            this.jieLiu = true
            if (res.code == 200) {
              uni.showLoading({
                title: '投票中',
              })
              setTimeout(() => {
                uni.showToast({
                  title: res.desc,
                  icon: 'none',
                })
                this.$emit('reload', this.pid)
              }, 1700)
            }

            if (res.code != 200) {
              uni.showToast({
                title: res.desc,
                icon: 'none',
              })
            }
          })
        }
      } else {
        uni.showToast({
          title: '正在投票中，请勿重复按钮',
          icon: 'none',
        })
      }
    },
    toView(id) {
      let header = {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
      let data = {
        handler: 'view',
      }
      this.request({
        url: '/v1/votes/' + id,
        method: 'PUT',
        header: header,
        data: data,
      }).then((res) => {})
    },
    go() {
		
    },
  },
}
</script>

<style lang="scss" scoped>
.playerList {
	// background-color: #F5F5F7;
}
	
.player {
  height: 112rpx;
  display: flex;
  flex: 1;
  // border-bottom: 2rpx solid #e5e5e5;
  .player-top {
    display: flex;
    color: rgba(22,188,199,1);
    font-weight: 600;
    align-items: center;
    justify-content: center;
    width: 5%;
  }
  .player-botton {
    margin-left: 16rpx;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    color: #00000091;
    font-size: 30rpx;
    letter-spacing: 0rpx;
  }
  .icon {
    width: 36rpx;
    height: 36rpx;
  }
}

.players {
  width: 100%;
  // height: 112rpx;
  display: flex;
  .center {
    width: 90%;
    margin: 0 auto;
		padding: 15rpx 0;
    display: flex;
    border-bottom: 1px solid #e5e5e5;

    .player-top {
      display: flex;
      color: rgba(22,188,199,1);
      font-weight: 600;
      justify-content: center;
      width: 5%;
    }
    .player-botton {
      margin-left: 16rpx;
      display: flex;
      width: 100%;
			flex-direction: column;
      // justify-content: space-between;
      // align-items: center;
			.player-botton-top {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.name {
					font-size: 32rpx;
					font-weight: 600;
					color: #000000;
				}
			}
			.player-botton-center{
				width: 100%;
				height: 50rpx;
				font-size: 26rpx;
				color: rgba(0,0,0,0.8);
				display: flex;
				justify-content: space-between;
				align-items: center;
			}
			.player-botton-bottom {
				width: 100%;
				word-wrap: break-word;
				word-break: break-all;
				overflow: hidden;
				text-align: left;
				color: #00000091;
			}
    }
    .icon {
      width: 36rpx;
      height: 36rpx;
			font-size: 28rpx;
			color: rgba(0,0,0,0.4);
    }
  }
}

.theOwner {
	width: 694rpx;
	display: flex;
	padding: 20rpx 0;
	border-radius: 8rpx;
	background-color: #F5F5F7;
	
	.theOwner-left-image {
		width: 100rpx;
		display: flex;
		justify-content: center;
		
		image {
			width: 48rpx;
			height: 48rpx;
		}
	}
	
	.theOwner-left {
		width: 100rpx;
		display: flex;
		justify-content: center;
		font-weight: 600;
		color: #b2b2b2;
	}
	
	.theOwner-right {
		width: 594rpx;
		
		.theOwner-right-top {
			width: 560rpx;
			font-size: 32rpx;
			font-weight: 600;
			display: flex;
			justify-content: space-between;
			
			.right {
				font-size: 28rpx;
				color: #00000091;
				font-weight: medium;
			}
		}
		
		.theOwner-right-center {
			width: 560rpx;
			font-size: 26rpx;
			color: #000000CC;
			padding: 10rpx 0;
		}
		
		.theOwner-right-bottom {
			width: 560rpx;
			font-size: 28rpx;
			color: #00000066;
			display: flex;
			flex-wrap: wrap;
		}
	}
}

.theOwner:nth-child(n+2) {
	margin-top: 20rpx;
}

.player-botton>view:last-child{
	color: rgba(242,121,0,1);
}

.name {
  word-wrap: break-word;
  word-break: normal;
  color: #000000E5;
  font-weight: bold;
  font-size: 32rpx;

}

.piao {
	width: 90%;
	height: 110rpx;
	margin: 0 auto;
	display: flex;
	
	.piao-left {
		display: flex;
		color: rgba(22,188,199,1);
		font-weight: 600;
		align-items: center;
		justify-content: center;
		width: 5%;
	}
	
	.piao-right{
		margin-left: 16rpx;
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
	}
}

.piao-right>view:first-child {
	font-size: 30rpx;
	font-weight: 600;
	color: #000000;
}
.piao-right>view:last-child {
	font-size: 28rpx;
	color: #00000091;
}
















// .playerList {
// 	display: flex;
// 	flex-wrap: wrap;
// 	justify-content: space-between;
// 	align-content: flex-start;

// 	.player {
// 		width: 270rpx;
// 		padding: 25rpx;
// 		background-color: #f4f4f4;
// 		display: flex;
// 		flex-direction: column;
// 		align-items: center;
// 		margin-bottom: 20rpx;
// 		.name {
// 			font-size: 36rpx;
// 		}

// 		.introduce {
// 			font-size: 30rpx;
// 		}

// 		.vote-num {
// 			width: 230rpx;
// 			text-align: center;
// 			font-size: 26rpx;

// 			text {
// 				color: #e74c3c;
// 			}
// 		}

// 		.view {
// 			display: flex;
// 			align-items: center;
// 			width: 230rpx;
// 			justify-content: center;
// 			font-size: 24rpx;

// 			.view-img {
// 				width: 36rpx;
// 				height: 36rpx;
// 			}
// 		}

// 		.voteBtn {
// 			padding: 10rpx 20rpx;
// 			font-size: 32rpx;
// 			color: #FFFFFF;
// 			background-color: #70d6ab;
// 		}
// 	}

// 	.page {
// 		margin-top: 50rpx;
// 	}

// 	.m10 {
// 		margin: 14rpx 0;
// 	}
// }
// .avartar{
// 	display: block;
// 	height: 200rpx;
// 	width: 200rpx;
// 	border-radius: 50%;
// }
</style>
