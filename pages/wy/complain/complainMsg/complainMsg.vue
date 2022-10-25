<template>
	<view class="repair-message">
		<view class="title">
			投诉信息
		</view>
		<view class="detail">
			<!-- 信息详情 -->
			<view class="user-info-title">
				用户详情
			</view>
			<view class="m10 fs30">
				所属小区：{{complainMessage.community_code=='null'?'':complainMessage.community_code}}
			</view>
			<view class="m10 fs30">
				小区名：{{communityName}}
			</view>
			
	<view class="m10 fs30" style="display: flex;">
				联系方式：<view style="color: #007AFF;font-size: 18px;margin-top: -10rpx;" @click="makePhone(complainMessage.tel)">{{complainMessage.tel}}</view>
			</view>
			<!-- 用户信息 -->
			<view class="user-info-title">
				投诉信息
			</view>
			<view class="m10 fs30">
				投诉名称：{{complainMessage.title}}
			</view>
			<view class="m10 fs30">
				投诉事由：{{complainMessage.reason}}
			</view>
			<view class="m10 fs30">
				投诉类型：{{complainMessage.type}}
			</view>
			<view class="m10 fs30">
				投诉时间：{{complainMessage.create_time | timeStamp}}
			</view>
			<view class="m10 fs30" v-if="complainMessage.status==1">
				投诉答复：{{complainMessage.reply}}
			</view>
			<view class="m10 fs30">
				是否匿名：{{complainMessage.is_anonymity==1?'是':'否'}}
			</view>
			<view class="m10 fs30 mb20">
				状态：{{complainMessage.status==1?'已回复':'待回复'}}
			</view>



			<!-- 回复操作 -->
			<textarea class="input-msg" v-if="complainMessage.status==0" v-model="replyData.reply" placeholder="  请输入回复信息" />
			
		</view>
		<view  v-if="complainMessage.status==0 && updateAuth">
			<button type="primary" class="btn" @tap="replyMsg(complainMessage.id)">回复</button>
		</view>
	</view>
</template>

<script>
	import {
		timeStamp
	} from '../../../../utils/time.js'
	import QueryAuth from '@/mixins/QueryAuth.js'
	export default {
		data() {
			return {
				complainMessage: [],
				replyData:{
					reply:'',
					status:1
				},
				communityName:uni.getStorageSync('community_name')
			}
		},created() {
			this.queryAuth('complain');
		},
		mixins: [QueryAuth],
		computed: {
			updateAuth() {
				return this.authList.includes("complain_update")
			}
		},
		methods: {
			makePhone(tel) {
				// #ifdef MP||APP-PLUS
				uni.makePhoneCall({
					phoneNumber: tel,
					success() {}
				})
				// #endif
				// #ifdef H5
				uni.showToast({
					title: "当前运行环境不支持拨打电话！",
					icon: 'none'
				})
				// #endif
			},
			// 获取单个详情
			getComplainMsg(id) {
				this.request({
					url: '/mobile/complain/' + id,
					method: 'GET',
				}).then(res => {
					this.complainMessage = res.data
				})
			},
			// 回复按钮
			replyMsg(id) {
				if(this.replyData.reply==''){
					uni.showToast({
						title: "回复内容不能为空！",
						icon: 'none'
					})
					return
				}else{
				this.request({
					url: '/mobile/complain/' + id,
					method: 'PUT',
					data: this.replyData
				}).then(res => {
					uni.showToast({
						title:'已回复',
						icon:'none'
					})
					setTimeout(function(){
						uni.navigateBack({
						
						})
					},1000)
				})	
				}
				
			}
		},
		filters: {
			timeStamp
		},
		async onLoad(e) {
			await this.getComplainMsg(e.id)
		}
	}
</script>

<style lang="scss">
	.repair-message {
		.title {
			margin: 32rpx;
			padding: 20rpx 0;
			font-size: 40rpx;
			font-weight: 700;
			border-bottom: 3rpx solid #e7e8e7;
		}

		.detail {
			margin: 32rpx;
			.user-info-title {
				padding: 20rpx 0;
				font-size: 35rpx;
				font-weight: 700;
			}

			.check-btn {
				display: flex;
				// justify-content: flex-end;
				// margin-left: auto;
				padding:10rpx 0 10rpx 540rpx;

			}

			.input-msg {
				width: 100%;
				border: 3rpx solid #999999;
				border-radius:10rpx;
			}
		}

		.m10 {
			margin: 10rpx 0;
		}

		.fs30 {
			font-size: 30rpx;
			color: #6e7069
		}

		.mb20 {
			margin-bottom: 20rpx;
		}
	}
	.btn {
		color: #fff;
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 0rpx;
		background-color: #2273f6;
	}
</style>
