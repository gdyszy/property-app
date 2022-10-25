<template>
	<view class='login'>

		<view class="lo_icon">
			<view class="lo_image">
				<image src="../../static/common/icon.png" mode=""></image>
			</view>
			<view class="lo_text">
				<image src="../../static/common/iconfont.png" mode=""></image>
			</view>
		</view>

		<!--  <view class="regbutton_login"  @click='wechatLogin' v-if="H5Wechat">
	  	<button class="button"  open-type='getUserInfo'>微信快捷登录/注册</button>
	  </view> -->
	  <!-- 同意服务条款 -->
	  <checkbox-group :class="checked == 1 ? 'shake-horizontal' : ''" class="auth-clause" @change="CheckboxChange" v-if="H5Wechat">
	  	<checkbox class="orange" :class="checked == 2 ? 'checked' : ''" :checked="checked == 2 ? true : false" value="2" />
	  	<view>
	  		我已阅读<text class="linkxy" @tap="onDetails(8, '用户协议')">用户协议</text>及<text class="linkxy" @tap="onDetails(9, '隐私保护')">隐私权保护声明</text>
	  	</view>
	  </checkbox-group>
		<view class="regbutton_login" @click='wechatLogin' v-if="H5Wechat">
			<button class="button" open-type='getUserInfo'>微信快捷登录/注册</button>
		</view>
		<view class="regbutton_login" @click="clickonlog" v-if="!H5Wechat">
			<button class="regbutton">账号快捷登录/注册</button>
		</view>

		<view class="lo_font">
			优势智云信息科技股份有限公司技术支持
		</view>
		<wyb-loading ref="loading" title="登录中..." />
	</view>
</template>

<script>
	import md5 from '../../common/md5.js'
	import wybLoading from '@/components/wyb-loading/wyb-loading.vue'
	export default {
		data() {
			return {
				checked: 0,
				isChecked:false,
				H5Wechat: true,
				appid: '',
				code: '',
				tel: '',
				smsCode: '',
				openId: ''
			};
		},
		onLoad() {
			uni.clearStorageSync();
			// #ifdef H5
			var ua = navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				this.H5Wechat = true
			} else {
				this.H5Wechat = false
			}
			this.getAppid()
			this.getUrlParam()
			// #endif
			// #ifdef MP-WEIXIN
			this.H5Wechat = true
			// #endif

		},
		components: {
			wybLoading
		},
		methods: {
			CheckboxChange(e) {
				this.checked = e.detail.value;
				this.isChecked = !this.isChecked
			},
			// 跳转到账号密码页面
			clickonlog() {
				//console.log(JSON.stringify())
				//在起始页面跳转到test.vue页面并传递参数
				uni.navigateTo({
					url: "../theLogin/index"
				});
			},
			wechatLogin() {
				if(!this.isChecked){
					uni.showToast({
						title: '请勾选同意选项',
						icon: 'none',
						duration: 2000,
					});
					return
				}
				let that = this
				this.$refs.loading.showLoading()
				let nonce = Math.random().toString(36).substr(2)
				let time_stamp = Date.parse(new Date()) / 1000
				let getData = {}
				let natUrl  = "/pages/login/wechat"
				// #ifdef MP-WEIXIN || APP-PLUS
				uni.login({
					provider: "weixin",
					success: (loginRes) => {
						uni.getUserInfo({
							provider: "weixin",
							success: (infoRes) => {
								// #ifdef MP-WEIXIN||APP-PLUS
								// #ifdef MP-WEIXIN
								getData = {
									code: loginRes.code,
									encryptedData: infoRes.encryptedData,
									iv: infoRes.iv,
									time_stamp: time_stamp,
									nonce: nonce,
									signature: md5(`app_key=` + this.$appKey + `&app_secret=` +
										this.$app_secret + `&nonce=` + nonce + `&time_stamp=` +
										time_stamp),
									app_key: this.$appKey
								}
								natUrl  = "/pages/login/wechat"
								// #endif
								// #ifdef APP-PLUS
								getData = {
									user_info: JSON.stringify(infoRes.userInfo),
									time_stamp: time_stamp,
									nonce: nonce,
									signature: md5(`app_key=` + this.$appKey + `&app_secret=` +
										this.$app_secret + `&nonce=` + nonce + `&time_stamp=` +
										time_stamp),
									app_key: this.$appKey
								}
								natUrl  = "/pages/login/bindtel"
								// #endif
								that.request({
									url: '/v1/token/wechat_check_tel',
									method: 'post',
									data: getData
								}).then(res => {
									that.$refs.loading.hideLoading()
									if (res.data.have_tel) {
										that.weChat(res.data.tel)
									} else {
										uni.navigateTo({
											url: natUrl
										})
									}
								})
								// #endif
							}
						})
					}
				})
				// #endif
				// #ifdef H5
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					let local = encodeURIComponent(this.$websiteUrl + '/h5/#/pages/login/index');
					window.location.href =
						"https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
						this.appid +
						"&redirect_uri=" +
						local +
						"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
				} else {
					return
				}
				// #endif
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
								// #ifdef MP-WEIXIN
								getData = {
									code: loginRes.code,
									encryptedData: infoRes.encryptedData,
									iv: infoRes.iv,
									time_stamp: time_stamp,
									nonce: nonce,
									signature: md5(`app_key=` + this.$appKey + `&app_secret=` +
										this.$app_secret + `&nonce=` + nonce + `&time_stamp=` +
										time_stamp),
									app_key: this.$appKey,
									times: 2,
									os_type:1
								}
								// #endif
								// #ifdef APP-PLUS
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
								// #endif
								that.request({
									url: '/v1/token/wechat',
									method: 'POST',
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
			getUrlParam() {
				let url = window.location.href.split('#')[0]
				let serch = url.split('?')[1]
				let _this = this;
				if (serch) {
					let arr = serch.split('&')
					let code = arr[0].split('code=')[1]
					_this.code = code
					_this.H5WechatLogin()
					// 此时获取到的code码需要你传给后端，因为微信的安全机制，前端不能做处理
				} else {
					return null
				}
			},
			getAppid() {
				let that = this
				let nonce = Math.random().toString(36).substr(2)
				let time_stamp = Date.parse(new Date()) / 1000
				let getData = {
					time_stamp: time_stamp,
					nonce: nonce,
					signature: md5(`app_key=` + this.$appKey + `&app_secret=` + this.$app_secret + `&nonce=` + nonce +
						`&time_stamp=` + time_stamp),
					app_key: this.$appKey,
				}
				this.request({
					url: '/v1/token/get_appid',
					method: 'post',
					data: getData
				}).then(res => {
					if (res.code === 200) {
						that.appid = res.data.appid
					} else {
						uni.showToast({
							title: res.desc,
							icon: none
						})
					}
				})
			},
			H5WechatLogin() {
				let that = this
				let nonce = Math.random().toString(36).substr(2)
				let time_stamp = Date.parse(new Date()) / 1000
				that.request({
					url: '/v1/token/web_wechat',
					method: 'post',
					data: {
						times: 1,
						code: this.code,
						time_stamp: time_stamp,
						nonce: nonce,
						signature: md5(`app_key=` + this.$appKey + `&app_secret=` + this.$app_secret + `&nonce=` + nonce +
							`&time_stamp=` + time_stamp),
						app_key: this.$appKey,
					}
				}).then(res => {
					if (res.code === 901) {
						let openId = res.data.open_id
						uni.navigateTo({
							url: `/pages/login/bindtel?openId=${openId}`
						})
					} else if (res.code === 200) {
						uni.setStorage({
							key: 'myinfo',
							data: res.data
						})
						uni.switchTab({
							url: '../my/index'
						})
					} else {
						uni.showToast({
							title: res.desc,
							icon: none
						})
					}
				})
			}
		},
	};
</script>

<style lang="less">
	.lo_icon {
		margin-bottom: 95rpx;
		margin-top: 120rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		.lo_image {
			margin-bottom: 22rpx;

			image {
				width: 124rpx;
				height: 124rpx;
			}
		}

		.lo_text {
			image {
				width: 196rpx;
				height: 54rpx;
			}
		}
	}

	.regbutton_login {
		width: 630rpx;
		height: 48rpx;
		text-align: center;
		line-height: 48rpx;
		border: #b2b2b2 1rpx;
		margin: 70rpx auto;
	}

	.lo_font {
		width: 100%;
		position: absolute;
		bottom: 145rpx;
		font-size: 24rpx;
		color: #808080;
		text-align: center;
	}

	.button {
		background-color: #65bb25;
		font-size: 32rpx;
		color: #FFFFFF;
	}

	.regbutton {
		background-color: #FFFFFF;
		font-size: 32rpx;
		color: #4D4D4D;
	}
	.auth-clause {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #909090;
		margin-top: 80rpx;
		margin-left: 50rpx;
	}
	switch.orange[checked] .wx-switch-input,
	checkbox.orange[checked] .wx-checkbox-input,
	radio.orange[checked] .wx-radio-input,
	switch.orange.checked .uni-switch-input,
	checkbox.orange.checked .uni-checkbox-input,
	radio.orange.checked .uni-radio-input {
		background-color: #686868 !important;
		border-color: #000000 !important;
		color: #ffffff !important;
	}
	.linkxy{
		margin-left: 10px;
		margin-right: 10px;
		color: #0055ff;
	}
</style>
