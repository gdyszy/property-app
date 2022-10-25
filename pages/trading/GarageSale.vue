<template>
	<view class='Garagesale'>
		<view class="G_title" v-for="(item,index) in listData" :key='index'>
			<view class="G_image">
				<image src="../../static/images/GarageSale/ico_01_03.png" v-if="typeID == 1"></image>
				<image src="../../static/images/GarageSale/ico_02_04.png" v-if="typeID == 2"></image>
			</view>
			<view class="G_center">
				<view class="cen_title">
					<view class="tlt_left jiaoyi" v-if="item.status == 1">
						交易中
					</view>
					<view class="tlt_left guanbi" v-if="item.status == 2">
						交易已关闭
					</view>
					<view class="tit_right">
						{{item.create_time | timeStamp}}
					</view>
				</view>
				<view class="cen_content">
					<view :class="item.explain.length < maxLen?'':'tj'" v-if="!item.openStatus">
						{{item.explain}}
					</view>
					<view v-if="item.openStatus">
						<view>{{item.explain}}</view>
						<view class="cen_image">
							<block v-for="(image,dindex) in item.product_image" :key='dindex'>
								<image class="image" :src="image" @tap='previewImage(item.product_image,dindex)'>
								</image>
							</block>
						</view>
						<view class="cen_price">
							<view class="pri_left">
								¥ {{item.price}}
							</view>
							<view class="pri_rifht" v-if="item.status === 1" @click="openDown(item.id)">
								<image src="../../static/images/GarageSale/btn_02_del.png"></image>
								<view class="">关闭交易</view>
							</view>
							<view class="pri_rifht" v-if="item.openStatus" @click="showMore(index,item,false)">
								<image src="../../static/images/GarageSale/btn_15.png"></image>
								<view class="">收起信息</view>
							</view>
						</view>
					</view>
					<view class="checkDetailMsg" v-if="!item.openStatus" @click="showMore(index,item,true)">
						<view>查看详情</view>
						<view class="downIcon">
							<image src="../../static/my/btn_01.1.png" />
						</view>
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
				type: Array,
				default: []
			},
			typeID: {
				type: Number,
				default: 1
			}
		},
		filters: {
			timeStamp
		},
		data() {
			return {
				maxLen: 20,
			};
		},
		methods: {
			openDown(e) {
				let that = this

				if (uni.getSystemInfoSync().platform == 'ios') {
					uni.showModal({
						content: '确认关闭交易',
						confirmText: '确认',
						cancelColor: "#262626",
						success(res) {
							if (res.confirm) {
								that.request({
									url: '/v1/deals/' + e,
									method: 'PUT',
									data: {
										status: '2'
									}
								}).then((res) => {
									if (res.code == 200) {
										that.$emit('showlist')
									}
								})
							} else if (res.cancel) {}
						}
					})
				} else {
					uni.showModal({
						content: '确认关闭交易',
						cancelText: '确认',
						confirmText: '取消',
						confirmColor: "#262626",
						success(res) {
							if (res.confirm) {

							} else if (res.cancel) {
								that.request({
									url: '/v1/deals/' + e,
									method: 'PUT',
									data: {
										status: '2'
									}
								}).then((res) => {
									if (res.code == 200) {
										that.$emit('showlist')
									}
								})
							}
						}
					})
				}
			},
			previewImage(Imgurl, index) {
				uni.previewImage({
					urls: Imgurl,
					current: index
				})
			},
			showMore(i, item, t) {
				item.openStatus = t
				item.dindex = i
				uni.$emit('update', item)
			}
		},
	};
</script>

<style scoped lang="less">
	.G_title {
		display: flex;

		.G_image {
			margin-top: 50rpx;
			margin-left: 30rpx;

			image {
				height: 78rpx;
				width: 78rpx;
			}
		}

		.G_center {
			margin-top: 34rpx;
			width: 588rpx;
			margin-left: 24rpx;
			padding-bottom: 34rpx;
			border-bottom: 1rpx solid #e6e6e6;

			.cen_title {
				display: flex;
				justify-content: space-between;

				.tlt_left {
					font-size: 30rpx;
				}

				.tit_right {
					color: #B3B3B3;
				}
			}

			.cen_content {
				margin-top: 24rpx;
				font-size: 30rpx;
				color: #262626;
				// height: 44rpx;
				// line-height: 44rpx;
			}

			.cen_Garagesale {
				margin-top: 22rpx;
				color: #b3b3b3;
				font-size: 24rpx;
				height: 30rpx;

				image {
					width: 6rpx;
					height: 6rpx;
				}
			}

			.cen_image {
				margin-top: 22rpx;
				display: flex;

				image {
					width: 142rpx;
					height: 142rpx;
				}

				.image {
					margin-left: 7rpx;
				}
			}

			.cen_price {
				margin-top: 16rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.pri_left {
					font-size: 40rpx;
					color: #474747;
				}

				.pri_rifht {
					display: flex;
					align-items: center;
					height: 28rpx;
					font-size: 28rpx;
					color: #b3b3b3;

					image {
						height: 25rpx;
						width: 26rpx;
						margin-right: 2rpx;
					}
				}
			}
		}
	}

	.cen_con {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 588rpx;
	}

	.guanbi {
		color: #60c49a;
	}

	.jiaoyi {
		color: #f89a1e;
	}

	.checkDetailMsg {
		font-size: 26rpx;
		color: #b3b3b3;
		display: flex;
		align-items: center;
		margin-top: 20rpx;
	}

	.tj {
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		line-clamp: 1;
		-webkit-box-orient: vertical;
	}

	.downIcon {
		width: 25rpx;
		height: 30rpx;
	}

	.downIcon image {
		width: 100%;
		height: 100%;
	}
</style>
