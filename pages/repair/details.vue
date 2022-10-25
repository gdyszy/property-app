<template>
  <view class='detail'>
	<view>
		<view class="in_message">
		 	<view>报修单信息</view>
				<view id="undo" v-if="status == 0 ||status == 1" @click="revoke">撤销</view>
				<view id="undo" v-if="status ==2" @click="revoke">删除</view>
		 </view>
		 
		 <view class="in_info">
		 	<view class="in_inf in_details1">
		 		住户信息
		 	</view>
				<view class="in_item">
				  <view>住户号</view>
				  <view class="item_color">{{datalist.house_name}}</view>
				</view>
				</view>
				
				<view class="in_info ">
					<view class="in_inf in_details">
						维修信息
					</view>
				<view class="in_item">
					 <view>报修状态</view>
					 <view class="item_color1" :class="status == 2?'fins':''">{{datalist.status}}</view>
				</view>
				<view class="in_item">
					 <view>处理人</view>
					 <view class="item_color">{{datalist.maintainer}}</view>
				</view>
				 <view class="in_item">
					 <view>联系方式</view>
					 <view class="item_image" v-if="datalist.maintainer_tel!=''">
						 <image src="../../static/images/repair/btn_02.png" mode=""></image>
						 {{datalist.maintainer_tel}}
					 </view>
				</view>
				
				<view class="in_info ">
					<view class="in_inf in_details">
						报修信息
					</view>
				<view class="in_item">
					 <view>报修人</view>
					 <view class="item_color">{{datalist.name}}</view>
				</view>
				<view class="in_item">
					 <view>联系方式</view>
					 <view class="item_image" >
						 <image src="../../static/images/repair/btn_02.png" mode=""></image>
						 {{datalist.tel}}
					 </view>
				</view>
				<view class="in_item">
					 <view>预约日期</view>
					 <view class="item_color">{{date}}</view>
				</view>
				<view class="in_item">
					 <view>预约时间</view>
					 <view class="item_color">{{time}}</view>
				</view>		
	     </view>
		 
		 <view class="in-di">
		 	<view class="top"> 报修说明</view>
			<view class="wenzi">{{datalist.desc}}</view>
		 </view>
		 <view class="in-di">
		 	<view class="top"> 报修图片</view>
			<view class="image" v-if="photoList.length != 0">
				<view v-for="(img,index) in datalist.photo" :key='index'>
					<image class="image1" :src="img" mode="" @tap="previewImage(datalist.photo,index)" lazy-load="true"></image>
				</view>
			</view>
		 </view>
		 </view>
		</view>
  </view>
</template>

<script>
	import {timeMinute} from '../../utils/time.js'
export default {
  props: {},
  data() {
    return {
		datalist:'',
		myID:'',
		status:'',
		date: '',
		time: '',
		photoList: []
	};
  },
  computed: {},
  onLoad(e) {
	  this.undata(e.id)
	  this.myID = e.id
	  this.status = e.status
  },
  filters:{
  	  timeMinute
  },
  methods: {
	   revoke(){
		  let that = this
		  let content = ''
		  this.status == 2?content = '确认删除' : content = '确认撤销'
		  if(uni.getSystemInfoSync().platform == 'ios'){
		  	uni.showModal({
		  		content: content,
		  		confirmText: '确认',
		  		cancelColor: "#262626",
		  		success(res) {
		  			if (res.confirm) {
		  				that.request({
						  url:'/v1/repairs/'+that.myID,
						  method:"DELETE"
		  				}).then((res)=>{
						  if(res.code === 200){
							  uni.navigateBack({
								  delta:1
							  })
							  uni.$emit('chexiao')
						  }
		  				})
		  			} else if (res.cancel) {}
		  		}
		  	})
		  }else{
		  	uni.showModal({
		  		content: content,
		  		cancelText: '确认',
		  		confirmText: '取消',
		  		confirmColor: "#262626",
		  		success(res) {
		  			if (res.confirm) {
		  				
		  			} else if (res.cancel){
		  				that.request({
						  url:'/v1/repairs/'+that.myID,
						  method:"DELETE"
		  				}).then((res)=>{
						  if(res.code === 200){
							  uni.navigateBack({
								  delta:1
							  })
							  uni.$emit('chexiao')
						  }
		  				})
		  			}
		  		}
		  	})
		  }  
	  },
	  async undata(id){
		  let res = await this.request({
			  url:'/v1/repairs/'+id ,
			  method:'GET'
		  })
		  if(res.code == 200){
			  this.datalist = res.data
			  this.date = this.datalist.subscribe_time.split(' ')[0]
			  this.time = this.datalist.subscribe_time.split(' ')[1]
			  this.photoList = this.datalist.photo
			  this.datalist.maintainer ===null?this.datalist.maintainer='':this.datalist.maintainer=this.datalist.maintainer
			 this.datalist.maintainer_tel ===null?this.datalist.maintainer_tel='':this.datalist.maintainer_tel=this.datalist.maintainer_tel
			  // console.log(this.datalist.photo.length != 0)
		  }
	  },
	  previewImage(Imgurl,index){
		  uni.previewImage({
		  	urls: Imgurl,
		  	current: index
		  })
	  }
  },
};
</script>

<style lang="less">
	.detail{
		margin: 0 30rpx;
		.in_message{
			display: flex;
			justify-content: space-between;
			height: 100rpx;
			font-size: 44rpx;
			font-weight: 700;
			line-height: 100rpx;
			border-bottom: 1rpx solid #e6e6e6;
			#undo{
				font-size: 30rpx;
				color: #fbaa1a;
				font-weight: 300;
			}
		}
		.in_info{
			.in_inf{
				font-size: 30rpx;
				font-weight: 700;
			}
			.in_item{
				font-size: 28rpx;
				margin: 20rpx 0;
				color: #555555;
				display: flex;
				justify-content: space-between;
				.item_image{
					color: #57b38d;
					font-size: 30rpx;
					image{
						width: 28rpx;
						height: 28rpx;
						vertical-align: middle;
						margin-right: 8rpx;
					}
				}
			}
		}
	}
	
	.in-di{
		font-size: 28rpx;
		.wenzi{
			margin-top: 26rpx;
			color: #808080;
			line-height: 48rpx;
			font-size: 30rpx;
		}
		.image{
			margin-top: 26rpx;
			display: flex;
			image{
				height: 140rpx;
				width: 140rpx;
			}
			.image1{
				margin-left: 8rpx;
			}
		}
	}
	.in_details{
		margin-top: 46rpx;
	}
	.in_details1{
		margin-top: 20rpx;
	}
	.item_color{
		color: #C8C7CC;
	}
	.item_color1{
		color: #fbaa1a;
		font-size: 30rpx;
	}
	.fins {
		color: #78C2A3;
	}
</style>
