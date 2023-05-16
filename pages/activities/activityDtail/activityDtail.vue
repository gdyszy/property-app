<template>
	<view class="activityDtail">
		<view class="title">
			活动标题：{{acData.title}}
		</view>
		
		<view class="center">
			<view class="m20 fs32">
				主办单位<view class="font-color"> {{acData.sponsor_unit}} </view>
			</view>
			<view class="m20 fs32">
				开始时间<view class="font-color"> {{acData.begin_time * 1000 | timeSecond}} </view>
			</view>
			<view class="m20 fs32">
				结束时间<view class="font-color"> {{acData.end_time * 1000 | timeSecond}} </view>
			</view>
			<view class="m20 fs32">
				活动地点<view class="font-color"> {{acData.place}} </view>
			</view>
		</view>
		
		<view class="text" v-html="acData.content">
			<!-- <rich-text :nodes="acData.content"></rich-text> -->
		</view>

		<view class="nocontent"></view>

		<view v-if="acData.show_button && visbutton" class="regbutton_login" @click="goTo">
			<button class="regbutton">{{acData.join_activity ? '已报名' : '报名'}}</button>
		</view>
		
	</view>
</template>

<script>
	
	import {
		timeSecond
	} from '@/utils/time.js'
	export default {
		data() {
			return {
				acData: [],
				visbutton: false
			}
		},
		filters: {
			timeSecond
		},
		methods: {
			goTo() {
				if(!this.acData.join_activity){
					uni.showLoading()
					this.request({
						url: '/v1/activities',
						method: 'POST',
						data: {
							activity_id: this.acData.id
						}
					}).then((res) => {
						uni.hideLoading()
						if (res.code == 200) {
							uni.showToast({
								title: '报名成功',
								duration: 2000,
								success:function() {
									setTimeout(function(){
									      uni.navigateBack()
									    }, 2000)
									
								}
							})
						} else {
							uni.showToast({
								title: res.desc,
								icon: "none"
							})
						}
					})
				}
				
			},
			getDtail(id) {
				this.request({
					url: '/v1/activities/' + id,
					data:{
						community_code: uni.getStorageSync('saveTheDistrict').community_code,
					}
				}).then(res => {
					this.acData = res.data
					var timestamp = Date.parse(new Date())/1000
					if(this.acData.begin_time < timestamp && this.acData.end_time > timestamp){
						this.visbutton = true
					}
				})
			}
		},
		onLoad(e) {
			this.getDtail(e.id)
		}
	}
</script>

<style lang="scss" scoped>
	.nocontent{
		height: 100rpx;
	}
	.activityDtail {
		margin: 5%;
		
		.title {
			color: #1A1A1A;
			font-family: PingFang SC;
			font-weight: 600;
			font-size: 40rpx;
			line-height: 64rpx;
			letter-spacing: 0rpx;
			text-align: left;
		}
		
		.center{
			margin: 30rpx 0;
			border-radius: 8rpx;
			background: #F5F6F7;
			padding: 15rpx 25rpx;
		}

		.m20 {
			margin: 10rpx 0;
			display: flex;
		}

		.fs32 {
			font-size: 32rpx;
			color: rgba(110,110,110,1);
		}
		
		.font-color{
			padding-left: 25rpx;
			color: #1A1A1A;
		}
		
		.text{
			color: #1A1A1A;
			font-family: PingFang SC;
			font-weight: medium;
			font-size: 30rpx;
			line-height: 50rpx;
			letter-spacing: 2rpx;
			text-align: left;
			margin-bottom: 120rpx;
		}
		
		.regbutton_login{
			position: fixed;
			bottom: 0;
			width: 90%;
			margin-bottom: 20rpx;
			
			.regbutton {
				
					background-color: #FFFFFF;
					font-size: 32rpx;
					color: #16bcc7;
					border: 1px solid #16bcc7;
			}
		}
		
		
	}
</style>
