<template>
	<view>
		<view class="denglu" v-show="PageStatus ==0">
			<view class="dl_title">
				<text>登录</text>
				<view class="dl_ious"></view>
			</view>

			<view class="form">
				<input class="form_input" placeholder-style="font-size: 30rpx;color: #B3B3B3;" type="text"
					v-model="username"  auto-blur="true" 
					placeholder="请输入账号" />
				<input class="form_input" placeholder-style="font-size: 30rpx;color: #B3B3B3;" type="password"
					v-model="password"  auto-blur="true" 
					placeholder="请输入密码" />
				<text class="errtext">{{errmsg}}</text>
				<button class="form_button" @click="goLogin">登录</button>
			</view>
			<view class="dl_text">
				<text class="dltext1">没有账号？</text><text class="dltext2" @click="pushregistered">现在注册</text>
				<text class="dltext2" @click="pushForgetPasswd">忘记密码</text>
			</view>
		</view>

		<register v-show="PageStatus == 1" @switchStatus="switchStatus"></register>
		<forgetPasswd v-show="PageStatus == 2" @switchStatus="switchStatus"></forgetPasswd>

	</view>
</template>

<script>
	import md5 from '../../common/md5.js'
	import register from '../registered/index.vue'
	import forgetPasswd from '../forgetPasswd/index.vue'
	export default {
		components: {
			register,
			forgetPasswd
		},

		props: {},
		data() {
			return {
				errmsg: '',
				username: '',
				password: '',
				PageStatus: 0
			};
		},
		computed: {},
		onLoad() {

		},
		onShow() {},
		methods: {
			//跳转到注册页面
			pushregistered() {
				this.PageStatus = 1
			}, //跳转到忘记密码页面
			pushForgetPasswd() {
				this.PageStatus = 2
			},
			checkvalue(value) {
				var that = this;
				let username = that.username
				let password = that.password
				if (value == 'username' && username === '') {
					that.errmsg = '用户名不能为空';
					this.userPlaceholder = '用户名'
				} else if (value == 'password' && password === '') {
					that.errmsg = '密码不能为空';
					this.pwdPlaceholder = '用户密码'
				} else {
					that.errmsg = '';
				}

			},
			goLogin() {
				var that = this;
				let username = that.username
				let password = that.password
				let nonce = Math.random().toString(36).substr(2)
				let time_stamp = Date.parse(new Date()) / 1000

				if (username === '') {
					that.errmsg = '用户名不能为空';
				} else if (password === '') {
					that.errmsg = '密码不能为空';
				} else {
					that.errmsg = '';
					that.request({
						url: '/v1/token/login',
						data: {
							app_key: this.$appKey,
							account: username,
							password: password,
							time_stamp: time_stamp,
							nonce: nonce,
							signature: md5(`app_key=` + this.$appKey + `&app_secret=` + this.$app_secret +
								`&nonce=` + nonce +
								`&time_stamp=` +
								time_stamp)
						},
						method: 'POST'
					}).then((res) => {
						if (res.code === 200) {
							uni.setStorage({
								key: 'myinfo',
								data: res.data
							})
							uni.setStorage({
								key: 'loginWay',
								data: 0
							})
							uni.reLaunch({
								url: '../my/index'
							})
							// #ifdef APP-PLUS
							//app 端注册推送信息client_id
							this.$save_client(res.data.client.user_id);
							// #endif
						} else {
							this.errmsg = res.desc
						}
					});
				}
			},
			switchStatus(p) {
				this.PageStatus = p
			}
		},
	};
</script>

<style lang="less">
	.denglu {
		.dl_title {
			margin: 0 74rpx;
			margin-top: 72rpx;

			text {
				font-size: 54rpx;
				font-weight: 700;
				color: #262626;
			}

			.dl_ious {
				margin-top: -16rpx;
				height: 14rpx;
				width: 106rpx;
				background-color: #88DFBA;
				border-radius: 4rpx;

			}
		}

		.form {
			margin: 0 74rpx;
			margin-top: 56rpx;
			width: 630rpx;

			.form_input {
				width: 630rpx;
				height: 110rpx;
				border-bottom: 1rpx solid #cccccc;
			}

			.form_button {
				margin-top: 98rpx;
				background-color: #88DFBA;
				border-radius: 8rpx;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 36rpx;
				color: #FFFFFF;
			}
		}

		.errtext {
			margin-top: 26px;
			font-size: 26rpx;
			color: #f13535;
		}

		.dl_text {
			// position: absolute;
			position: fixed;
			bottom: 129rpx;
			width: 100%;
			text-align: center;
			font-size: 24rpx;

			.dltext1 {
				color: #b3b3b3;
			}

			.dltext2 {
				margin-left: 10px;
				font-size: 26rpx;
				color: #3c78e6;
			}
		}
	}
</style>
