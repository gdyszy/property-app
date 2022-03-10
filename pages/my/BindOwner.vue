<template>
  <view class='information'>
	  <view class="inform">
	  	<view class="in_message">
	  		<view class="message">业主信息</view>
			<view class="zhuxiao" @click="jiebang" v-if="ownerType == 1">解绑</view>
	  	</view>
	  	<block v-for="(item,index) in data" :key='index'>
	  	<view class="in_info" >
				<view class="in_inf">
					小区信息
				</view>
					
					<view class="in_item">
					 <view>市及区</view>
					 <view class="item_color">{{item.address}}</view>
					</view>
					<view class="in_item">
						<view>小区名称</view>
						<view class="item_color">{{item.name}}</view>
					</view>
					<view class="in_item bianhao">
						<view>小区编号</view>
						<view class="item_color">{{item.code}}</view>
					</view>
	  	</view>
		
		<view class="in_info" v-if="ownerType==1">
				<view class="in_inf">
					业主信息
				</view>
					
					<view class="in_item">
					 <view>业主姓名</view>
					 <view class="item_color">{{code.name}}</view>
					</view>
					<view class="in_item">
						<view>业主编号</view>
						<view class="item_color">{{code.house_code}}</view>
					</view>
					<view class="in_item">
						<view>身份证号</view>
						<view class="item_color">{{code.identity_id}}</view>
					</view>
					<view class="in_item">
						<view>手机号</view>
						<view class="item_color">{{code.tel}}</view>
					</view>
		</view>
		</block>
	  </view>
  </view>
</template>

<script>
export default {
  props: {},
  data() {
    return {
		Height: 0 ,
		data:[], //列表数据
		code:'',
		ownerType:1
	};
  },
  computed: {},
  onLoad(data) {
	  const item =  JSON.parse(data.code);
	  this.code = item
	  this.getxinxi()
	  this.showxiaoqu()
	  this.ownerType = uni.getStorageSync('userInfo').owner_type;
  },
  methods: {
	  //解绑
	  async jiebang(){
		  let that = this 
		  let userInfo = uni.getStorageSync('myinfo');
		  if(uni.getSystemInfoSync().platform == 'ios'){
		  	uni.showModal({
		  		title: '提示',
		  		content: '确认解除绑定',
		  		confirmText: '确认',
		  		cancelColor: "#262626",
		  		success(res) {
		  				if (res.confirm) {
							 that.request({
								url:'/v1/members/'+userInfo.client.user_id+'?handler=unbundle',
								method: 'PUT'
							}).then( (res)=>{
								  if(res.code === 200){
									  uni.$emit('login', "未绑定");
									  uni.switchTab({
										  url:'./index'
									  })
								  }else{
									  uni.showToast({
										title:res.desc,
										icon:"none"
									  })
								  }
							  })
							
						} else if (res.cancel) {}
				  }
		  	})
		  }else{
			  uni.showModal({
			  	title: '提示',
			  	content: '确认解除绑定',
			  	cancelText: '确认',
			  	confirmText: '取消',
			  	confirmColor: "#262626",
			  	success(res) {
			  		if (res.confirm) {} else if (res.cancel) {
			  				that.request({
			  					 url:'/v1/members/'+userInfo.client.user_id+'?handler=unbundle',
								 method: 'PUT'
			  				}).then( (res)=>{
			  					  if(res.code === 200){
			  						  uni.$emit('login', "未绑定");
			  						  uni.switchTab({
			  							  url:'./index'
			  						  })
			  					  }else{
			  						  uni.showToast({
			  							title:res.desc,
			  							icon:"none"
			  						  })
			  					  }
			  				})
			  			}
			  		}
			  })
			
		  }
	  },
	  //数据显示
	  async showxiaoqu(){
		  let res = await this.request({
			  url:"/v1/communities",
			  method:'GET',
			  data:{
				  'filter[code]' : this.code.community_code
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

<style lang="less">
	.information{
		margin: 0 28rpx;
		.in_message{
			border-bottom: 1rpx solid #e6e6e6;
			padding-top: 12px;
			padding-bottom: 38rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.message{
				font-size: 44rpx;
				font-weight: 900;
				color: #333333;
			}
			.zhuxiao{
				color: #F0AD4E;
				font-size: 30rpx;
			}
		}
		.in_info{
			.in_inf{
				margin-top: 32rpx;
				font-size: 32rpx;
				font-weight: 700;
				color: #333333;
			}
			.in_item{
				font-size: 30rpx;
				display: flex;
				justify-content: space-between;
				margin-top: 28rpx;
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
	}
	.baccolor{
		height: 300rpx;
		width: 100%;
		background-color: #C8C7CC;
	}
	
	.bianhao{
		margin-bottom: 56rpx;
	}
</style>
