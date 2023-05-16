<template>
	<view class="actvt">
		<swiper-tab-head :tabBars="tabBars" :tabIndex="tabIndex" @tabtap="tabtap" class="tabs" />
		<view class="uni-tab-bar">
			<view class="swiper-box" v-if="tabIndex === 0">
				<view class="actvt-arrangement">
					<view class="empty" v-if="activityList.length == 0">
						<view class="nothingImg">
							<image src="/static/common/nothing.png" mode="aspectFill"
								style="width: 100%; height: 100%">
							</image>
						</view>
						<view class="nothing">没有数据</view>
					</view>
					<view v-else>
						<view class="actvt-message" v-for="(item, index) in activityList" :key="index"
							@click="goTo(item.id)">
							<view class="actvt-message-border">
								<!-- <view class="m10 fs30">活动标题：{{item.title}}</view> -->
								<!-- <image  mode="scaleToFill" style="width: 700rpx; height: 375rpx; background-color: #CCCCCC;"></image> -->
								<image  :src="item.photo != ''? item.photo :noImg" mode="aspectFill"
									class="actvt-message-border-img"></image>
								<!-- <view class="m10 fs30">活动地点：{{item.place}}</view> -->
								<view class="actvt-message-txt">
									<view class="actvt-message-txt-top m10"> {{ item.title }} </view>

									<view class="actvt-message-txt-bottom">
										<view class="txt-bottom-right" :class="item.zhuangTai=='活动进行中'? '' : 'nozt'">
											{{ item.zhuangTai }}
										</view>
										<view class="txt-bottom-left">
											活动时间：<text>{{ item.begin_time | timeStamp }}</text><text
												v-if="parseInt(item.begin_time/1000000)!=parseInt(item.end_time/1000000)">
												- {{ item.end_time | timeStamp }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="swiper-box" v-if="tabIndex === 1">
				<view class="actvt-arrangement">
					<view class="empty" v-if="activityList1.length == 0">
						<view class="nothingImg">
							<image src="/static/common/nothing.png" mode="aspectFill"
								style="width: 100%; height: 100%">
							</image>
						</view>
						<view class="nothing">没有数据</view>
					</view>
					<view v-else>
						<view class="actvt-message" v-for="(item, index) in activityList1" :key="index"
							@click="goTo(item.id)">
							<view class="actvt-message-border">
								<!-- <view class="m10 fs30">活动标题：{{item.title}}</view> -->
								<!-- <image  mode="scaleToFill" style="width: 700rpx; height: 375rpx; background-color: #CCCCCC;"></image> -->
								<image  :src="item.photo != ''?item.photo:noImg" mode="aspectFill"
									class="actvt-message-border-img"></image>
								<!-- <view class="m10 fs30">活动地点：{{item.place}}</view> -->
								<view class="actvt-message-txt">
									<view class="actvt-message-txt-top m10"> {{ item.title }} </view>

									<view class="actvt-message-txt-bottom">
										<view class="txt-bottom-right" :class="item.zhuangTai=='活动进行中'? '' : 'nozt'">
											{{ item.zhuangTai }}
										</view>
										<view class="txt-bottom-left">
											活动时间：<text>{{ item.begin_time | timeStamp }}</text><text
												v-if="parseInt(item.begin_time/1000000)!=parseInt(item.end_time/1000000)">
												- {{ item.end_time | timeStamp }}</text>
										</view>

									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="resizeSpace"></view>
		<realty-tabbar :currentIndex="2"/>
	</view>
</template>
<script>
	import {timeStamp} from '@/utils/time.js';
	import SwiperTabHead from 'components/common/swiper_tab_head.vue';
	// import realtyTabbar from '../../componentNav/realtyTabbar.vue';

	export default {
		components: {
			SwiperTabHead,
			// realtyTabbar
		},
		data() {
			return {
				noImg:"/static/common/noImg.png",
				tabBars: [{
						name: '当前活动',
						id: 0
					},
					{
						name: '历史活动',
						id: 1
					}
				],
				tabIndex: 0,
				activityList: [],
				activityList1: [],
			}
		},
		filters: {
			timeStamp,
		},
		methods: {
			tabtap(index) {
				this.tabIndex = index;
				this.getList(index)
			},
			getList(tab_type) {
				console.log(tab_type)
				this.request({
					url: '/v1/activities',
					method: 'GET',
					data: {
						community_code: uni.getStorageSync('userInfo').community_code,
						type: tab_type==0?"now":"history"
					},
				}).then((res) => {
					// 获取当前10位时间戳
					let timestamp = new Date().valueOf() / 1000
					if(tab_type==0){
						this.activityList = res.data
						
						// 遍历添加到每一项里面
						for (let i = 0; i < this.activityList.length; i++) {
							// 开始时间
							let kaiShi = timestamp - res.data[i].begin_time
							// 结束时间
							let jieShu = timestamp - res.data[i].end_time
						
							if (kaiShi == 0) {
								this.activityList[i].zhuangTai = '活动进行中'
							} else if (kaiShi < 0) {
								this.activityList[i].zhuangTai = '活动准备中'
							} else if (kaiShi > 0) {
								if (jieShu >= 0) {
									this.activityList[i].zhuangTai = '活动已结束'
								} else {
									this.activityList[i].zhuangTai = '活动进行中'
								}
							}
						}
					}else{
						this.activityList1 = res.data
						
						// 遍历添加到每一项里面
						for (let i = 0; i < this.activityList1.length; i++) {
							// 开始时间
							let kaiShi = timestamp - res.data[i].begin_time
							// 结束时间
							let jieShu = timestamp - res.data[i].end_time
						
							if (kaiShi == 0) {
								this.activityList1[i].zhuangTai = '活动进行中'
							} else if (kaiShi < 0) {
								this.activityList1[i].zhuangTai = '1活动准备中'
							} else if (kaiShi > 0) {
								if (jieShu >= 0) {
									this.activityList1[i].zhuangTai = '活动已结束'
								} else {
									this.activityList1[i].zhuangTai = '活动进行中'
								}
							}
						}
					}
					
				})
			},
			goTo(id) {
				uni.navigateTo({
					url: 'activityDtail/activityDtail?id=' + id,
				})
			},
      gologin() {
      	if(uni.getSystemInfoSync().platform == 'ios'){
      		uni.showModal({
      			title: '提示信息',
      			content: '请先登录',
      			confirmText: '去登录',
      			cancelColor: "#262626",
      			success(res) {
      				if (res.confirm) {
      					uni.navigateTo({
      						url: '../login/index'
      					})
      				} else if (res.cancel) {
      					uni.switchTab({
      						url: '../index/index'
      					})
      				}
      			}
      		})
      	}else{
      		uni.showModal({
      			title: '提示信息',
      			content: '请先登录',
      			cancelText: '去登录',
      			confirmText:'取消',
      			cancelColor: "#262626",
      			success(res) {
      				if (res.confirm) {
      					uni.switchTab({
      						url: '../index/index'
      					})
      				} else if (res.cancel) {
      					uni.navigateTo({
      						url: '../login/index'
      					})
      				}
      			}
      		})
      	}
      },
		},
    onShow() {
      if(!uni.getStorageSync('myinfo')){
        this.gologin();
      }else{
        this.getList(0)
      }
    },
		// onLoad() {
			
		// },
	}
</script>

<style>
	page {
		background-color: #eeeeee;
	}
</style>

<style lang="scss" scoped>
  /deep/ .head .uni-tab-bar{
    background-color: #fff;
    margin: 0;
    padding-bottom: 10px;
  }
  /deep/ .head .bottom_line{
    display: none;
  }
	.resizeSpace{
		height: 140rpx;
	}

	.actvt {
		.tabs {
			background-color: #ffffff;
		}

		.actvt-arrangement {
			display: flex;
			flex-direction: column;

			.empty {
				margin-top: 30rpx;
				text-align: center;
				font-size: 34rpx;
				color: #e7e8e7;
			}

			.actvt-title {
				padding: 20rpx 0;
				font-size: 40rpx;
				font-weight: 700;
			}

			.actvt-message {
				width: 700rpx;
				margin: 0 auto;

				.actvt-message-border {
					// width: 100%;
					height: 100%;
					margin-top: 30rpx;
					padding: 36rpx 0 40rpx 28rpx;
					border-radius: 8rpx;
					overflow: hidden;
					background-color: #ffffff;
					display: flex;

					.actvt-message-txt {
						display: flex;
						flex-direction: column;
						width: 448rpx;
					}
				}
			}
		}
	}

	.actvt-message-border-img {
		width: 180rpx;
		height: 180rpx;
		margin-right: 28rpx;
		border-radius: 8rpx;


	}

	.actvt-message-txt-top {
		font-size: 34rpx;
		font-weight: 500;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;

		color: rgba(0, 0, 0, 0.9);
		font-family: PingFang SC;

	}

	.actvt-message-txt-bottom {

		.txt-bottom-left {
			font-size: 26rpx;
			color: rgba(0, 0, 0, 0.6);

			font-family: PingFang SC;
			font-weight: 400;

		}

		.txt-bottom-right {
			font-size: 28rpx;
			color: rgba(242, 121, 0, 1);
			margin-bottom: 12rpx;

			font-family: PingFang SC;
			font-weight: 500;

		}

		.nozt {
			color: rgba(26, 151, 161, 1);
		}
	}

	// 公共样式
	.m10 {
		margin: 0 0 54rpx;
	}

	.fs30 {
		font-size: 32rpx;
		color: #3c3c3c;
	}

	.btn {
		color: #fff;
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 0rpx;
		background-color: #2273f6;
	}

	.nothing {
		color: #b3b3b3;
		width: 100%;
		height: 30rpx;
		text-align: center;
		padding: 20rpx 0;
	}
</style>
