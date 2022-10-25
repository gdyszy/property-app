<template>
  <view class='information'>
	  <view class="inform">
	  	<view class="in_message">
	  		<text>物业信息</text>
	  	</view>
	  	<view class="in_info" >
			<block v-for="(item,index) in data" :key='index'>
				<view class="in_inf">
					小区信息
				</view>
					
					<view class="in_item">
					 <view>小区名称</view>
					 <view class="item_color">{{item.name}}</view>
					</view>
					<view class="in_item">
						<view>物业名称</view>
						<view class="item_color">{{item.developer}}</view>
					</view>
					<view class="in_item">
						<view>物业编号</view>
						<view class="item_color">{{item.total_owner}}</view>
					</view>
					<view class="in_item">
						<view>公司地址</view>
						<view class="item_color in_number">
						<view class="">{{item.address}}</view>
						<!-- <view class="">309号-359号</view> -->
						</view>
					</view>
					
					<view class="in_item">
						<view>联系电话</view>
						<view class="item_color">{{item.update_time}}</view>
					</view>
			</block>
	  	</view>
		<!-- <view class="baccolor"></view> -->
	  </view>
	  
	  
  </view>
</template>

<script>
export default {
  props: {},
  data() {
    return {
		Height: 0 ,
		data:[] ,//列表数据
		code:''
	};
  },
  computed: {},
  onLoad(data) {
	  // console.log(data.code)
	  this.code = data.code
	  this.getxinxi()
	  this.showxiaoqu()
  },
  methods: {
	  //数据显示
	  async showxiaoqu(){
		  let res = await this.request({
			  url:"/v1/communities",
			  method:"GET",
			  data:{
				  "filter[code]":this.code
			  }
		  })
		  this.data = res.data
	  },
	  getxinxi(){
		  uni.getSystemInfo({
		     success: function (res) {
				let winheight = res.windowHeight
			 }
		  })
	  }
  },
};
</script>

<style lang="less" scoped>
	.information{
		margin: 0 30rpx;
		.in_message{
			height: 100rpx;
			font-size: 44rpx;
			font-weight: 700;
			line-height: 100rpx;
			border-bottom: 1rpx solid #e6e6e6;
		}
		.in_info{
			.in_inf{
				margin-top: 20rpx;
				font-size: 35rpx;
				font-weight: 700;
			}
			.in_item{
				font-size: 30rpx;
				margin: 36rpx 0;
				display: flex;
				justify-content: space-between;
				.item_color{
					color: #808080;
				}
			}
		}
	}
	
	.in_number{
		width: 480rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
	}
	.inform{
		background-color: #FFFFFF;
		height: 540rpx;
		// display: flex;
		// flex-direction: column;
	}
	.baccolor{
		height: 300rpx;
		width: 100%;
		background-color: #C8C7CC;
	}
</style>
