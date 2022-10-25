<template>
	<view>
		<view class="font_top">
			<view>绑定手机号</view>
		</view>
		<view class="dem_message">
			<view class="danxuan">
				<view class="fee_rad">
					<view class="fee_radio2">手机号码</view>
				</view>
				<view class="input ">
					<input class="form_input" type="text" placeholder-style="color:#b3b3b3" v-model="tel"
						maxlength="11" @focus="phonePlaceHolder=''" @blur="tel==''?phonePlaceHolder='请输入手机号码':''"
						:placeholder="phonePlaceHolder" />
				</view>
			</view>
		</view>
		<view class="dem_message">
			<view class="danxuan">
				<view class="fee_rad">
					<view class="fee_radio2">验证码</view>
				</view>
				<view class="input" style="margin-left: -20%;">
					<view style="display: flex; align-items: center;">
						<input type="text" placeholder-style="color:#b3b3b3;" v-model="sms_code"
							@focus="codePlaceHolder=''" @blur="sms_code==''?codePlaceHolder='请输入验证码':''"
							adjust-position :placeholder="codePlaceHolder" maxlength="6"/>
						<view class="code" @tap='getCode' v-if="!resend">获取验证码</view>
						<view class="code" v-if="resend">重新获取({{ countdown }})</view>
					</view>
				</view>
			</view>
		</view>
		<button type="default" class="btn" @tap="finish">完成</button>
	</view>
</template>

<script>
	import md5 from '../../common/md5.js'
	export default {
		data(){
			return {
				tel:'',
				phonePlaceHolder: '请输入手机号码',
				sms_code: '',
				codePlaceHolder: '请输入验证码',
				resend: false,
				countdown: 0,
				resend1: true,
				clear: '',
				openId: ''
			}
		},
		onLoad(options) {
			if(options.openId){
				this.openId = options.openId
			}
		},
		methods:{
			getCode() {
				const c_mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //判断手机号码正则
				const _this = this;
				if (!c_mobile.test(_this.tel)) {
					uni.showToast({
						title: '请输入正确手机号码',
						icon: 'none',
						duration: 2000
					})
					return false;
				} else {
					_this.resend1 = false
				}
				if (!_this.resend1) {
					_this.request({
						url: '/v1/sms',
						method: 'GET',
						data: {
							phones: _this.tel,
							type: 1
						}
					}).then((res) => {
						if (res.code != 202) {
							uni.showToast({
								title: res.desc,
								icon: 'none',
								duration: 2000
							})
							_this.resend = false
						} else if (res.code === 202) {
							_this.countdown = 60;
							_this.resend = true;
							_this.clear = setInterval(_this.countDown, 1000);
						}
					})
				}
			},// 倒计时
			countDown(){
				if(!this.countdown){                    
					this.resend = false;
					clearInterval(this.clear);
				}else{
					--this.countdown;
				}
			},
			finish(){
				let that = this
				let nonce = Math.random().toString(36).substr(2)
				let time_stamp = Date.parse(new Date())/1000
				const c_mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //判断手机号码正则
				const c_code = /^\d{6}$/; 
				const _this = this;
				if (!c_mobile.test(_this.tel)) {
					uni.showToast({
						title: '请输入正确手机号码',
						icon: 'none',
						duration: 2000
					})
					return false;
				}else if(!this.sms_code){
					uni.showToast({
						title: '请输入短信验证码',
						icon: 'none',
						duration: 2000
					})
					return false;
				}
				let bindtelUrl= "/v1/token/web_wechat";
				let datas =  {
						tel: this.tel,
						sms_code: this.sms_code,
						open_id: this.openId,
						time_stamp:time_stamp,
						nonce:nonce,
						signature:md5(`app_key=`+this.$appKey+`&app_secret=`+this.$app_secret+`&nonce=`+nonce+`&time_stamp=`+time_stamp),
						app_key:this.$appKey,
					}
				// #ifdef APP-PLUS
				bindtelUrl= "/v1/token/check_code"
				datas =  {
						tel: this.tel,
						sms_code: this.sms_code,
						time_stamp:time_stamp,
						nonce:nonce,
						signature:md5(`app_key=`+this.$appKey+`&app_secret=`+this.$app_secret+`&nonce=`+nonce+`&time_stamp=`+time_stamp),
						app_key:this.$appKey,
					}
				// #endif
				that.request({
					url:bindtelUrl,
					method:'post',
					data:datas,
				}).then(res=> {
					if(res.code === 200){
						// #ifdef H5
						uni.setStorage({
							key: 'myinfo',
							data: res.data
						})
						uni.switchTab({
							url: '../my/index'
						})
						// #endif
						// #ifdef APP-PLUS 
						//微信静默登录
						that.weChat(res.data.tel)
						// #endif
						
					}else {
						uni.showToast({
							title:res.desc,
							icon:'none'
						})
					}
				})
			},
			weChat(tel) {
				let that = this
				let nonce = Math.random().toString(36).substr(2)
				let time_stamp = Date.parse(new Date()) / 1000
				let getData = {}
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						uni.getUserInfo({
							provider: "weixin",
							success: (infoRes) => {
								getData = {
									tel:tel,
									user_info: JSON.stringify(infoRes.userInfo),
									time_stamp: time_stamp,
									nonce: nonce,
									signature: md5(`app_key=` + this.$appKey + `&app_secret=` +
										this.$app_secret + `&nonce=` + nonce + `&time_stamp=` +
										time_stamp),
									app_key: this.$appKey,
									os_type:2,
									times: 2
								}
								that.request({
									url: '/v1/token/wechat',
									method: 'post',
									data: getData
								}).then((res) => {
									if (res.code === 200) {
										uni.setStorage({
											key: 'myinfo',
											data: res.data
										})
										uni.switchTab({
											url: '../my/index'
										})
										// #ifdef APP-PLUS
										//app 端注册推送信息client_id
										this.$save_client(res.data.client.user_id);
										// #endif
									} else if (res.code == 400) {
										uni.showModal({
											title: res.desc,
											showCancel: false,
											success() {
												uni.switchTab({
													url: '../index/index'
												})
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
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.font_top {
		margin-top: 14rpx;
		margin-left: 30rpx;
		padding-bottom: 38rpx;
		box-sizing: border-box;
		font-size: 44rpx;
		color: #333333;
		font-weight: 900;
		display: flex;
		justify-content: space-between;
	}
	.dem_message {
		margin: 0 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #e6e6e6;
	
		.danxuan {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;
			color: #333333;
		}
	}
	.fee_rad {
		display: flex;
		// justify-content: center;
		align-items: center;
	
		.fee_radio2 {
			height: 100rpx;
			line-height: 100rpx;
		}
	}
	.star {
		color: red;
	}
	
	.input {
		text-align: right;
		padding-right: 30rpx;
	}
	
	.topRight {
		margin-right: 30rpx;
		font-size: 26rpx;
		color: #28b07c;
		padding-top: 10rpx;
		padding-right: 10rpx;
	}
	
	.placestyle {
		font-size: 30rpx;
		color: #b3b3b3;
	}
	
	.msg {
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 104rpx;
		align-items: center;
		border-bottom: 1px solid #e6e6e6;
	}
	
	.text {
		display: flex;
		font-size: 30rpx;
		color: #262626;
	}
	
	.code {
		margin-left: 20px;
	}
	
	.form_button {
		margin: 0 74rpx;
		margin-top: 98rpx;
		background-color: #88DFBA;
		border-radius: 8rpx;
		height: 100rpx;
		line-height: 100rpx;
		font-size: 36rpx;
		color: #FFFFFF;
	}
	.btn {
		background-color: #88dfba;
		color: #FFFFFF;
		margin: 30rpx;
	}
</style>
