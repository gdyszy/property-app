<template>
	<view>
		<view class="lo_icon">
			<view class="lo_image">
				<image src="../../static/common/icon.png" mode=""></image>
			</view>
				<view class="lo_text">
					<image src="../../static/common/iconfont.png" mode=""></image>
				</view>
		</view>
		
		<view class="content" style="border-top: 1px solid #CCCCCC;">
			<view>申请获取以下权限</view>
			<view class="content_text">获得你的公开信息(昵称、头像等)</view>
			<button type="primary" style="background-color: #65bb25;" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信验证登录</button>
			<button type="default" @tap="cancel">取消登录</button>
			<wyb-loading ref="loading" title="登录中..."/>
		</view>
	</view>
</template>

<script>
	import md5 from '../../common/md5.js'
	import wybLoading from '@/components/wyb-loading/wyb-loading.vue'
	export default {
		data(){
			return {
				tel: '',
				loginRes: ''
			}
		},
		components:{
			wybLoading
		},
		onLoad() {
			wx.login({
			      success: res => {
			       this.loginRes = res.code
			      }
			    })
		},
		methods:{
			cancel(){
				uni.navigateBack({
					delta:1
				})
			},
			weChat(){
				let that = this
				this.$refs.loading.showLoading() 
				let nonce = Math.random().toString(36).substr(2)
				let  time_stamp = Date.parse(new Date())/1000
				let getData = {}
				uni.login({
					provider:"weixin",
					success:(loginRes) =>{
						uni.getUserInfo({
							provider:"weixin",
							success: (infoRes)=> {
								// #ifdef MP-WEIXIN
									getData={
										 code:loginRes.code,
										 encryptedData:infoRes.encryptedData,
										 iv:infoRes.iv,
										 time_stamp:time_stamp,
										 nonce:nonce,
										 signature:md5(`app_key=`+this.$appKey+`&app_secret=`+this.$app_secret+`&nonce=`+nonce+`&time_stamp=`+time_stamp),
										 app_key:this.$appKey,
										 times: 2,
										 os_type:1,
										 tel: that.tel
								}
								// #endif
								that.request({
								  url:'/v1/token/wechat',
								  method:'POST',
								  data:getData
								}).then((res)=>{
									that.$refs.loading.showLoading() 
									  if(res.code === 200){
										  uni.setStorage({
											 key: 'myinfo',
											 data: res.data,
											 success() {
											 }
										  })
										  uni.switchTab({
											 url:'../index/index'
										  })
									  }else if(res.code == 400){
										  uni.showModal({
										  	title:res.desc,
											showCancel:false,
											success() {
												uni.switchTab({
													url:'../index/index'
												})
											}
										  })
									  }else{
										  uni.showToast({
											  title:res.desc,
											  icon:"none"
										  })
									  }
								})
							}
						})
					}
				})
			},
			async getPhoneNumber(e){
				let that = this
				that.$refs.loading.showLoading() 
				if (!e.target.iv) {
				    uni.showModal({
				      content: '获取手机号失败！',
				      showCancel: false
				    })
					that.$refs.loading.hideLoading() 
				    return;
				  }
				let nonce = Math.random().toString(36).substr(2)
				let  time_stamp = Date.parse(new Date())/1000
				let getData = {}
				
				uni.checkSession({
					success() {
						
					},
					fail() {
						wx.login({
						      success: res => {
						       that.loginRes = res.code
						      }
						    })
					},
					complete() {
						getData={
							 code:that.loginRes,
							 encryptedData:e.detail.encryptedData,
							 iv:e.detail.iv,
							 time_stamp:time_stamp,
							 nonce:nonce,
							 signature:md5(`app_key=`+that.$appKey+`&app_secret=`+that.$app_secret+`&nonce=`+nonce+`&time_stamp=`+time_stamp),
							 app_key:that.$appKey,
							 times: 1
						}
						that.request({
						  url:'/v1/token/wechat',
						  method:'POST',
						  data:getData
						}).then((res)=>{
							that.$refs.loading.hideLoading()
							  if(res.code === 200){
								  that.tel = res.data.tel
								  that.weChat()
							  }else{
								  uni.showToast({
									  title:res.desc,
									  icon:"none"
								  })
								  return
							  }
						})
					}
				})
				
			},
		}
	}
</script>

<style scoped lang="scss">
	.lo_icon{
		margin-bottom: 95rpx;
		margin-top: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.lo_image{
			margin-bottom: 22rpx;
			image{
				width: 124rpx;
				height: 124rpx;
			}
		}
		.lo_text{
			image{
				width: 196rpx;
				height: 54rpx;
			}
		}
	}
	.content {
		width: 80%;
		margin: 0 auto;
		padding: 20rpx 0;
		.content_text {
			font-size: 24rpx;
			color: #CCCCCC;
			margin: 30rpx 0 60rpx 0;
		}
		button{
			margin-bottom: 30rpx;
		}
	}
</style>
