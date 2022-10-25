<template>
	<view>
		<view class="pay_content" v-for="i in list" :key="i.id" @tap='pay(i)'>

			<view class="image_content" v-if="i.house_number">
				<image style="width: 78rpx; height: 78rpx;" src="../../static/images/pay/ico_02_01.png" mode="scaleToFill"></image>
			</view>
			<view class="image_content" v-if="!i.house_number">
				<image style="width: 78rpx; height: 78rpx;" src="../../static/images/pay/ico_03_02.png" mode="scaleToFill"></image>
			</view>
			<view class="content_right">
				<view class="title">
					<view class="title_left">{{ i.title }}</view>
					<view class="title_right">{{ i.expense }}</view>
				</view>
				<view class="detail">
					<view class="detail_left">
						<view v-show="i.house_number">门户号：{{ i.house_number }}</view>
						<view v-show="i.license_plate">车牌号：{{ i.license_plate }}</view>

						<view>创建时间：{{ i.start_time |timeStamp }}</view>
						<view>费用编号：{{ i.id }}</view>
					</view>
					<template>
						<view>
							<view class="detail_right" v-if="i.status === 0" >
								<image src="../../static/images/pay/ico_01_01.png" mode="scaleToFill" style="width: 24rpx; height: 24rpx;" />
								<view>缴费</view>
							</view>
							<view class="checkMessage" v-if="i.status === 1" >
								<view>查看更多</view>
								<image src="../../static/images/pay/btn_01.png" mode="scaleToFill" style="width: 20rpx; height: 20rpx; margin-left: 6rpx;"></image>
							</view>
						</view>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {timeStamp} from '../../utils/time.js'
	export default {
		props: {
			list: {
				type: Array
			}
		},
		data() {
			return {

			}
		},
		filters:{
			timeStamp
		},
		onLoad() {
		},
		created() {
			// #ifdef APP-PLUS
			uni.loadFontFace({
				 family: 'DINPro-Medium',
				// 本地字体路径需转换为平台绝对路径
				source: `url(${plus.io.convertLocalFileSystemURL('_www/static/DINPro-Medium.ttf')})`,
				success() {
				},
				fail(e) {
				}
			})
			 // #endif
		},
		methods: {
			pay(e) {
				if(e.isPacks === 1){
					this.$emit('pay2', e.id)
				}else{
					this.$emit('pay', e.id)
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	.pay_content {
		display: flex;
		width: 690rpx;
		/* height: 150rpx; */
		margin: 0 auto;
		padding: 34rpx 0;
		border-bottom: 1px solid #e6e6e6;

		.image_content {
			width: 110rpx;
			height: 100%;
			display: flex;
			align-items: center;
		}
		.content_right {
			.title {
				width: 580rpx;
				display: flex;
				justify-content: space-between;
				.title_left {
					font-weight: bold;
					font-size: 32rpx;
					color: #262626;
				}

				.title_right {
					display: block;
					font-family: DINPro-Medium;
					font-size: 34rpx;
					color: #323232;
				}
			}

			.detail {
				display: flex;
				justify-content: space-between;

				.detail_left {
					font-size: 24rpx;
					color: #808080;

					view {
						margin-top: 9rpx;
					}
				}

				.detail_right {
					display: flex;
					background-color: #60C49A;
					width: 124rpx;
					height: 52rpx;
					border-radius: 30rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #FFFFFF;
					font-size: 24rpx;
					margin-top: 60rpx;
				}

				.detail_right:active {
					background-color: #4ea98b;
				}

				.checkMessage {
					display: flex;
					align-items: center;
					font-size: 24rpx;
					color: $color2;
					margin-top: 90rpx;
				}
			}
		}
	}
</style>
