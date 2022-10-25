<template>
	<!-- daichuli  -->
  <view class='container'>
	  <view class="rep_banner" v-for="(item,index) in allList" :key='index' @click="clickmessage(item.id)">
	  		<view class="ban_image">
	  		<image v-if="TypeStatus == 0" src="../../static/images/repair/ico_01_05.png"></image>
	  		<image v-if="TypeStatus == 1" src="../../static/images/repair/ico_02_06.png"></image>
	  		<image v-if="TypeStatus == 2" src="../../static/images/repair/ico_03_07.png"></image>
	  		</view>
	  		<view class="ban_text" >
	  			<view class="ban_text1">{{item.house_name}}</view>
	  			<!-- <view class="ban_text3">创建类型：{{item.create_time | timeMinute}}</view> -->
				<view class="ban_text3">预约时间：{{item.subscribe_time}}</view>
	  		</view>
	  		<view class="look_message">
	  			<view class="">查看信息
	  			<image src="../../static/images/pay/btn_01.png"></image>
	  			</view>
	  		</view>
	  </view>
  </view>
</template>

<script>
	import {timeMinute} from '../../utils/time.js'
export default {
  props: {
	  allList:{
		   type: Array,
	  },
	  TypeStatus: {
		  type: Number,
		  default: 0
	  }
  },
  filters:{
	  timeMinute
  },
  methods: {
	  clickmessage(id){
	  		  uni.navigateTo({
	  			  url:"details?id="+id+"&status="+this.TypeStatus
	  		  })
	  }
  },
};
</script>

<style scoped lang='less'>
	.rep_banner{
		
		margin: 0 30rpx;
		height: 188rpx;
		border-bottom: 1rpx solid #e6e6e6;
		display: flex;
		justify-content: space-between;
		.ban_image{
			margin:55rpx 30rpx;
			image{
				height: 78rpx;
				width: 78rpx;
			}
		}
		.ban_text{
			flex: 1;
			display: flex;
			flex-direction: column;
			height: 116rpx;
			margin-top: 34rpx;
			.ban_text1{
				color: #333333;
				font-size: 34rpx;
			}
			.ban_text2{
				color: #808080;
				font-size: 24rpx;
				margin-top: 11rpx;
			}
			.ban_text3{
				margin-top: 8rpx;
				color: #808080;
				font-size: 24rpx;
			}
		}
		.look_message{
			color: #60C49A;
			font-size: 24rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			image{
				width: 26rpx;
				height: 26rpx;
				margin-right: 30rpx;
				vertical-align:middle;
			}
		}
	}

</style>
