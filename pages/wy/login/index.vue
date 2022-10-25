<template>
	<view class="login">
		<view class="login-title">
			智慧家园物业版
		</view>
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<input class="input" type="text" clearable focus v-model="username" placeholder="请输入账号"></input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<input type="password" displayable v-model="password" placeholder="请输入密码"></input>
			</view>

		</view>
		<view class="btn-row">
			<button type="primary" class="primary" @tap="goLogin()">登录</button>
		</view>
	</view>
</template>

<script>
	import md5 from '../../../common/md5.js'
	export default {

		data() {
			return {
				username: '',
				password: ''
			}
		},
		methods: {
			goLogin() {
				var that = this;
				let username = this.username
				let password = this.password
				let nonce = Math.random().toString(36).substr(2)
				let time_stamp = Date.parse(new Date()) / 1000
				uni.setStorageSync('loginType','wuye');
				uni.removeStorageSync('wymyinfo')
				uni.removeStorageSync('community_code')
				uni.removeStorageSync('community_name')
				if (username === '') {
					uni.showToast({
						title: '用户名不能为空',
						icon: 'none'
					});
				} else if (password === '') {
					uni.showToast({
						title: '密码不能为空',
						icon: 'none'
					});
				} else {
					that.request({
						url: '/mobile/login/login_in',
						data: {
							app_key: this.$appKey,
							account: username,
							password: password,
							time_stamp: time_stamp,
							nonce: nonce,
							signature: md5(`app_key=` + this.$appKey + `&app_secret=` + this.$app_secret + `&nonce=` + nonce +
								`&time_stamp=` +
								time_stamp)
						},
						method: 'POST'
					}).then((res) => {
						if(res.code == 200){
							if(res.data.client.community!=0){
								uni.setStorage({
									key: 'wymyinfo',
									data: res.data,
								})
								uni.reLaunch({
									url: '../index/index',
								})
							}else{
								uni.showToast({
									title: "您没有权限访问！",
									icon: 'none'
								})
							}
							

						} else if (res.code = 402) {
							uni.showToast({
								title: res.desc,
								icon: 'none'
							})
						}
					});
					
				}
			},
		}
	}
</script>

<style lang="scss">
	.login {
		width: 100%;
		height: 100%;

		.login-title {
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 38rpx;
			margin: 20rpx 0;
		}

		.input-group {
			margin-bottom: 100rpx;
			.input-row {
				padding: 0 30rpx;
				display: flex;
				align-items: center;
				height: 90rpx;

			}
		}

		.btn-row {
			margin: 30rpx 30rpx;
		}

		.action-row {
			text-align: center;
			font-size: 28rpx;
			color: #007aff;
		}.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
		/* font-size: 18px; */
		height: 40px;
		line-height: 40px;
	}

	.input-row .title {
		width: 70px;
		padding-left: 15px;
	}

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 8rpx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}
	.input-group {
		background-color: #ffffff;
		margin-top: 20px;
		position: relative;
	}

	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	}
</style>
