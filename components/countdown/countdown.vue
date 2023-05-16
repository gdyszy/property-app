<template>
	<view class="countdown-box">
		<!-- <view class="over" v-if="startTime*1000>date">
			投票未开始
		</view> -->
		
		<!-- <view class="countdown" v-else-if="startTime*1000<date && endTime*1000>date">
			<view class="tips">
				距离投票结束还有：
			</view>
			<uni-countdown :backgroundColor="bgc" :show-day="true" :showColon="false" :day="d" :hour="h" :minute="m"
				:second="s">
			</uni-countdown>
			<view class="vote-time">
				投票时间：{{startTime * 1000 | timeYD}} ~ {{endTime * 1000 | timeYD}}
			</view>
		</view> -->
		
		<!-- <view class="over" v-else-if="leftTime<0">
			投票已结束
		</view> -->
		
		
		<view class="top">
			<view class="top-to">
				{{Obj.title}}
			</view>
			<view class="issue">
				发布于<text class="item">{{Obj.update_time_text}}</text>
			</view>
			<view class="issue">
				投票时间：<text class="item">{{startTime * 1000 | timeYD}} ~ {{endTime * 1000 | timeYD}}</text>
			</view>
			<view class="botton">
				{{Obj.introduce}}
			</view>
		</view>
		
		
		
	</view>
</template>

<script>
	import {
		timeYD
	} from '../../utils/time.js'
	export default {
		props: {
			endTime: {
				type: Number,
				default: 0
			},
			startTime: {
				type: Number,
				default: 0
			},
			bgc: {
				type: String,
				default: '#ffffff'
			},
			Obj: {
				type:Object
			}
		},
		data() {
			return {
				d: 0,
				h: 0,
				m: 0,
				s: 0,
				leftTime: 0,
				date: new Date().getTime()
			}
		},
		methods: {
			init() {
				let that = this
				var date = new Date();
				var now = date.getTime(); //获得当前时间与1970年1月1日时间相差的毫秒数
				var end = this.endTime * 1000; //结束时间与1970年1月1日时间相差的毫秒数
				this.leftTime = end - now; //计算两日期之间相差的毫秒数
				if (this.leftTime >= 0) {
					this.d = Math.floor(this.leftTime / 1000 / 60 / 60 / 24);
					this.h = Math.floor(this.leftTime / 1000 / 60 / 60 % 24);
					this.m = Math.floor(this.leftTime / 1000 / 60 % 60);
					this.s = Math.floor(this.leftTime / 1000 % 60);
					// console.log(this.d + '天' + this.h + '时' + this.m + '分' + this.s + '秒')
				}
			}
		},
		filters: {
			timeYD
		},
		mounted() {
			setTimeout(() => {
				this.$nextTick(() => {
					this.init()
				})
			}, 100)
		}
	}
</script>
<style lang="scss" scoped>
	
	.countdown-box {
		// height: 200rpx;
		background-color: #FFFFFF;
		
		.top-to {
			color: #000000E5;
			font-family: PingFang SC;
			font-weight: medium;
			font-size: 40rpx;
			line-height: 64rpx;
			letter-spacing: 0rpx;
			text-align: left;
			word-break:break-all; /*支持IE，chrome，FF不支持*/
			word-wrap:break-word;/*支持IE，chrome，FF*/
		}
		
		.issue {
			color: #00000091;
			font-family: PingFang SC;
			font-weight: medium;
			font-size: 26rpx;
			line-height: 38rpx;
			letter-spacing: 0rpx;
			text-align: left;
			margin-top: 12rpx;
			.item {
				margin-left: 10rpx;
			}
		}
		
		.botton {
			color: #404040;
			font-size: 30rpx;
			letter-spacing: 2rpx;
			text-align: left;
			margin-top: 12rpx;
		}
	}
	
	// .countdown-box {
	// 	display: flex;
	// 	justify-content: center;
	// 	align-items: center;
	// 	width: 100%;
	// 	height: 400rpx;
	// }

	// .over {
	// 	font-size: 60rpx;
	// }

	// .countdown {
	// 	display: flex;
	// 	flex-direction: column;
	// 	align-items: center;

	// 	.tips {
	// 		margin: 30rpx 0;
	// 		font-size: 38rpx;
	// 	}

	// 	.vote-time {
	// 		margin: 50rpx 0;
	// 	}
	// }

	// /deep/.uni-countdown {
	// 	// display: flex;
	// 	// align-items: center;

	// 	.uni-countdown__splitor[data-v-6cd74fee],
	// 	.uni-countdown__number[data-v-6cd74fee] {
	// 		margin: 0 10rpx;
	// 		// font-size: 60rpx;
	// 	}
	// }
	
	
	
	
</style>
