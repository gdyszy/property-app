<template>
	<view class="layout-column">
		<view class="layout-content">
			<view>标题：{{msgInfo.title}}</view>
			<view>内容：{{msgInfo.msg}}</view>
			<view>创建时间:{{(msgInfo.create_time * 1000) | timeSecond}}</view>
			<view>状态：{{msgInfo.status == 0 ? "隐藏" : "显示"}}</view>
			<view>类型：{{msgInfo.type == 0 ? "系统消息" : "通知消息"}}</view>
			<view>接收人：{{msgInfo.member_name|| "无"}}</view>
		</view>		
	</view>
</template>

<script>
	import {
		timeSecond,
		timeStamp,
		timeMinute
	} from '../../../utils/time.js'
	
	export default {
		data() {
			return {
				msgInfo:{
					title:"",
					msg:"",
					create_time:"",
					status:0,
					type:0,
					member_name:""
				}
			}
		},
		filters: {
			timeStamp,
			timeMinute,
			timeSecond
		},
		onLoad(data){
			this.request({
				url:"/mobile/msg/" + data.id,
			}).then(res => {
				this.msgInfo = res.data;
			})
		},
		methods: {
			goBack(){
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	
	.layout-column{
		display: flex;
		flex-direction: column;
	}
	
	.layout-content{
		margin: 10rpx 20rpx 10rpx 20rpx;
		
		view {
			font-size: 35rpx;
			margin-bottom: 20rpx;
		}
	}
	
	.header {
		// #ifdef MP
		margin-top: 130rpx;
		// #endif
		// #ifdef APP-PLUS
		margin-top: 80rpx;
		// #endif
		// #ifdef H5
		margin-top: 20rpx;
		// #endif
	}
</style>

 