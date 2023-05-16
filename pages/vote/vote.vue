<template>
	<view class="activities">
		<view class="activities-arrangement">
			<!-- <view class="activities-message" v-for="(item,index) in itemList" :key="index" @click="goTo(item.id)"> -->
			<view class="activities-message" v-for="(item,index) in itemList" :key="index" @click="goTo(item)">
				<view class="m10 fs30">
					项目标题：{{item.title}}
				</view>
				<view class="m10 fs30">
					更新时间：
					<text>{{item.update_time * 1000 | timeSecond}}</text>
				</view>
				<!-- <view class="m10 fs30">
					状态：{{item.begin_time*1000>date?'隐藏':(date>item.end_time*1000?'过期':'正常')}}
				</view> -->
			</view>
		</view>
		<loadMore :list="itemList" :page="page" :totalPage="totalPage" @load="loadMore" />
	</view>
</template>

<script>
	import {timeSecond} from '@/utils/time.js'
	export default {
		data() {
			return {
				itemList: [],
				page: 1,
				totalPage: 0,
				limit: 10,
				date: new Date().getTime(),
				res:{}
			}
		},
		filters: {
			timeSecond
		},
		methods: {
			getItemList() {
				this.request({
					url: '/v1/votes',
					data: {
						handler: 'project_list',
						page: this.page,
						limit: this.limit,
						community_code: uni.getStorageSync('userInfo').community_code
					}
				}).then(res => {
          console.log(res)
					this.itemList = res.data.data
					this.totalPage = res.data.last_page
				})
			},
			// id
			goTo(item) {
				uni.navigateTo({
					// url: './item?id=' + id
					// const Item = JSON.stringify(item)
					// let e = JSON.parse(decodeURIComponent(option.Com))
					url: './item?Item=' + encodeURIComponent(JSON.stringify(item))
				})
			},
			loadMore() {
				this.page++
				this.request({
					url: '/v1/votes',
					data: {
						handler: 'project_list',
						page: this.page,
						limit: this.limit,
						community_code: uni.getStorageSync('userInfo').community_code
					}
				}).then(res => {
					this.itemList = [...this.itemList, ...res.data.data]
				})
			}
		},
		onShow() {
			this.getItemList()
		},
		
		onBackPress(e) {
		// 这里可以自定义返回逻辑，比如下面跳转其他页面
			// #ifdef H5 || APP-PLUS
			uni.switchTab({
				url: '/pages/index/index'
			});
			// #endif
			// #ifdef MP-WEIXIN
			wx.switchTab({
				url: '/pages/index/index'
			});
			// #endif
			// return true 表示禁止默认返回
			return true
		}
	}
</script>

<style lang="scss" scoped>
	.activities {
		.activities-arrangement {
			border-top: 1rpx solid #e7e8e7;
			display: flex;
			flex-direction: column;
			background-color: #fff;

			.empty {
				margin-top: 30rpx;
				text-align: center;
				font-size: 34rpx;
				color: #e7e8e7;

			}

			.activities-title {
				padding: 20rpx 0;
				font-size: 40rpx;
				font-weight: 700;
			}

			.activities-message {
				height: 200rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: flex-start;
				border-bottom: 3rpx solid #E8E7E7;

				text {
					font-size: 26rpx;
				}
			}
		}

		.loadMore {
			margin-top: 30rpx;
			display: flex;
			justify-content: center;
			font-size: 30rpx;
			color: #888888;
		}
	}

	// 公共样式

	.m10 {
		margin: 14rpx 0;
	}

	.fs30 {
		font-size: 32rpx;
		color: #3c3c3c;
		margin-left: 30rpx;
	}

	.nothing {
		color: #B3B3B3;
		width: 100%;
		height: 30rpx;
		text-align: center;
		padding: 20rpx 0;
	}
</style>
