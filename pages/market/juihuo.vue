<template>
	<view>
		<view class="market_item" v-for="(item,index) in listData " :key='index'>
			<view class="item_image">
				<image :src="item.user_avatar" mode="scaleToFill"></image>
			</view>

			<view class="right">
				<view class="item_text">
					<view class="tetx1">
						<!-- member_id -->
						<view class="jiankang">{{item.nickname}}</view>
						<image v-if="id != item.member_id&& id != ''" @click="deleteList(item.id)" src="../../static/market/btn_01_del.png"
						 mode=""></image>
					</view>
					<view class="tetx2">{{item.create_time | timeStamp}}</view>
					<view class="tetx3">{{item.explain}}</view>
				</view>
				<view class="image" v-if="item.product_image">
					<view class="imageitem" v-for=" (item1,dindex) in item.product_image" :key='dindex'>
						<image :src="item1" @tap='previewImage(item.product_image,dindex)' lazy-load="true"></image>
					</view>
				</view>

				<view class="item_price">
					<view class="pri_left">￥{{item.price}}</view>
					<view class="pri_right" @tap='call(item.tel)'>
						<image src="../../static/market/btn_02.png" mode=""></image>
						<text class="lianxi">电话联系</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		timeStamp
	} from '../../utils/time.js'
	export default {
		props: {
			listData: {
				type: Array
			}
		},
		data() {
			return {
				page: 1,
				id: ''
			};
		},
		filters: {
			timeStamp
		},
		mounted() {
			let userInfo = uni.getStorageSync('myinfo');
			if (userInfo != '') {
				this.id = userInfo.client.user_id
			}
		},
		methods: {
			//删除不喜欢的list列表
			deleteList(id) {
				let userInfo = uni.getStorageSync('myinfo');
				let that = this
				if(uni.getSystemInfoSync().platform == 'ios'){
					uni.showModal({
						content: '是否隐藏该动态',
						confirmText:'隐藏',
						cancelColor: "#262626",
						success: function(res) {
							if (res.confirm) {
								if (userInfo != '') {
									that.request({
										url: '/v1/unlike_deal',
										method: 'POST',
										data: {
											deal_id: id
										}
									}).then((res) => {
										if (res.code === 200) {
											uni.$emit('shaxing', {
												msg: '页面更新'
											})
										}
									})
								}
					
							} else if (res.cancel) {
					
							}
						}
					});
					//
				}else{
					uni.showModal({
						content: '是否隐藏该动态',
						cancelText:"隐藏",
						confirmText:'取消',
						confirmColor: "#262626",
						success: function(res) {
							if (res.confirm) {
							} else if (res.cancel) {
								if (userInfo != '') {
									that.request({
										url: '/v1/unlike_deal',
										method: 'POST',
										data: {
											deal_id: id
										}
									}).then((res) => {
										if (res.code === 200) {
											uni.$emit('shaxing', {
												msg: '页面更新'
											})
										}
									})
								}
							}
						}
					});
				}
			},
			previewImage(Imgurl, index) {
				uni.previewImage({
					urls: Imgurl,
					current: index
				})
			},
			call(tel) {
				let userInfo = uni.getStorageSync('myinfo');
				if (!userInfo) {
					if(uni.getSystemInfoSync().platform == 'ios'){
						uni.showModal({
							title: '提示',
							content: '请先登录',
							confirmText: '去登录',
							cancelColor: "#262626",
							success: function(res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '../login/index'
									})
								} else if (res.cancel) {
									
								}
							}
						})
					}else{
						uni.showModal({
							title: '提示',
							content: '请先登录',
							cancelText: '去登录',
							confirmText:'取消',
							confirmColor: "#262626",
							success: function(res) {
								if (res.confirm) {
									
								} else if (res.cancel) {
									uni.navigateTo({
										url: '../login/index'
									})
								}
							}
						})
					}
					
				} else {
					uni.makePhoneCall({
						phoneNumber: tel
					})
				}
			}

		},

	};
</script>

<style scoped lang="less">
	.market_item {
		margin: 0 28rpx;
		display: flex;

		.item_image {
			margin-top: 30rpx;
			margin-right: 26rpx;

			image {
				display: block;
				width: 72rpx;
				height: 72rpx;
				border-radius: 50%;
			}
		}

		.item_text {
			margin-top: 20rpx;

			.tetx1 {
				display: flex;
				justify-content: space-between;

				image {
					height: 28rpx;
					width: 28rpx;
				}

				.jiankang {
					color: #252525;
					font-size: 30rpx;
				}
			}

			.tetx2 {
				color: #b3b3b3;
				font-size: 24rpx;
				margin-top: 14rpx;
			}

			.tetx3 {
				margin-top: 12rpx;
				color: #262626;
				font-size: 30rpx;
				line-height: 44rpx;
			}
		}

		.image {
			margin-top: 10rpx;
			display: flex;
			flex-wrap: wrap;

			.imageitem {
				height: 160rpx;
				width: 160rpx;
				margin: 8rpx;

				image {
					height: 160rpx;
					width: 160rpx;
				}
			}

		}

		.item_price {
			display: flex;
			justify-content: space-between;
			margin-top: 58rpx;

			.pri_left {
				color: #faa320;
				font-size: 40rpx;
				margin-bottom: 38rpx;
			}

			.pri_right {
				display: flex;
				height: 50rpx;
				width: 160rpx;
				background-color: #60C49A;
				color: #FFFFFF;
				border-radius: 30rpx;
				align-items: center;
				justify-content: center;
				padding: 6rpx;

				.lianxi {
					font-size: 26rpx;
					text-align: center;
				}

				image {
					width: 28rpx;
					height: 28rpx;
					margin-right: 4rpx;
				}
			}
		}
	}

	.right {
		flex: 1;
		border-bottom: 1rpx solid #e6e6e6;
	}
</style>
