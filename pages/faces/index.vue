<template>
  <view class='account'>
	  <view class="font_top">
		  <text>门禁人脸管理</text>
	  </view>
	  <!-- <picker mode = selector :range='arrayData' @change='changePicker'> -->
		  <view class="font_image" @click="open">
		  		<view>更换人脸照片</view>
		  			<view class="font_icon"> 
		  			<image  class="icon" :src='data.photo' mode=""></image>
		  			<image class="icon1 fontImage" src="../../static/common/btn_01.png" mode=""></image>
		  		</view>
		  </view>
	  <!-- </picker> -->
	  
	  <uni-popup :maskClick='false' ref="popup" type="bottom">
		  <view class="popups">
		  	<view class="paishe" @click="selectPic(1)">
		  		拍摄
		  	</view>
		  	<view class="quxiao" @click="quexiaos">
		  		取消
		  	</view>
		  </view>
	  </uni-popup>
	  
	
  </view>
</template>

<script>
import { Base64 } from '../../utils/base64.js'
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
export default {
  components:{
	  uniPopup,
	  uniPopupMessage,
	  uniPopupDialog
  },
  data() {
    return {
		data:'',
		arrayData:['拍摄','从相册选取'] ,
		H5Status: true,
		userInfo: ''
	};
  },
  onLoad() {
	 this.userInfo = uni.getStorageSync('myinfo')
	 // #ifdef H5
	 	this.H5Status = false
	 // #endif
  },
  methods: {
	  quexiaos(){
		  this.$refs.popup.close()
	  },
	  open(){
	      this.$refs.popup.open()
	  },
	  selectPic(type){
		  let id =  this.data.id
		  let that = this
		  let sourceType = null
		  
		  type == 1 ? sourceType = ['camera'] : sourceType = ['album']

		  uni.chooseImage({
		      count: 1, //默认9
		      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
		      sourceType: sourceType,
			  success: function (res){
					uni.showLoading({
						  title: '上传中'
					 });
					 that.quexiaos()
					let userInfo = uni.getStorageSync('myinfo');
					let header = {}
					if (userInfo) {
						let access_token = userInfo.access_token;
						let user_id = userInfo.client.user_id;
						let app_key = userInfo.client.app_key;
						header = {
							'authentication': 'USERID '+ Base64.encode(app_key+':'+access_token+':'+user_id)
						}
					}
					let filePath = res.tempFilePaths[0]
					uni.uploadFile({
							url:that.$websiteUrl+'/v1/faces',
							method:'POST',
							header: header,
							filePath:filePath,
							name:'file'
						 }).then((res)=>{
							   let resData = JSON.parse(res[1].data)
							 if(resData.code==200){
								 uni.showToast({
								 	title:resData.desc,
									icon:'none',
									duration:2000
								 })
								 
							 }else{
								 uni.showToast({
								 	title:resData.desc,
								 	icon:'none',
									duration:2000
								 })
							 }
							 uni.hideLoading()
							})
			  },
			  fail:function(res){
				uni.hideLoading()
			  }
		  })
	  },
	 
	
	 
  },
};
</script>

<style lang="less">
	.account{
		width: 100%;
		.font_top{
			margin-top: 14rpx;
			margin-left: 30rpx;
			margin-right: 30rpx;
			padding-bottom: 38rpx;
			box-sizing: border-box;
			font-size: 44rpx;
			color: #333333;
			border-bottom: 2rpx solid #E6E6E6;
			font-weight: 900;
		}
		.font_image{
			height: 116rpx;
			display: flex;
			justify-content:space-between;
			align-items: center;
			margin-left: 30rpx;
			margin-right: 30rpx;
			border-bottom: 2rpx solid #E6E6E6;
			font-size: 30rpx;
			color: #262626;
			.icon{
				height: 88rpx;
				width: 88rpx;
				border-radius: 6rpx;
			}
			.icon1{
				margin-left: 24rpx;
				margin-right: 26rpx;
				height: 24rpx;
				width: 24rpx;
			}
		}
	}
	
	.fontImage{
		margin-left: 24rpx;
		margin-right: 26rpx;
		height: 116rpx;
	}
	.font_icon{
		display: 1;
		display: flex;
		align-items: center;
	}
	
	.popups{
		border-radius: 20rpx;
		height: 350rpx;
		width: 100%;
		padding: 0 28rpx;
		background-color: #FFFFFF;
		.paishe{
			font-size: 34rpx;
			color: #28b07c;
			border-bottom: 1rpx solid #e6e6e6;
			height: 108rpx;
			line-height: 108rpx;
			text-align: center;
		}
		.quxiao{
			height: 134rpx;
			padding-top: 36rpx;
			font-size: 34rpx;
			color: #C8C7CC;
			text-align: center;
		}
	}
</style>
