<template>
	<view class='account'>
		<view class="font_top">
			<view>忘记密码</view>
		</view>

		<view class="" v-if="showMessage === true">
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2">新密码
							<text class="star">*</text>
						</view>
					</view>
					<view class="input ">
						<input placeholder-class="placestyle" name="myPhone" v-model="new_password" type="password"
							placeholder="请输入新密码" />
					</view>
				</view>
			</view>
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2">重复新密码
							<text class="star">*</text>
						</view>
					</view>
					<view class="input ">
						<input placeholder-class="placestyle" name="myPhone" v-model="repassword" type="password"
							placeholder="请输入确认密码" />
					</view>
				</view>
			</view>
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2">手机号码
							<text class="star">*</text>
						</view>
					</view>
					<view class="input ">
						<input class="form_input" type="text" placeholder-style="color:#b3b3b3" v-model="tel"
							maxlength="11" placeholder="请输入手机号码" />
					</view>
				</view>
			</view>
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2">验证码
							<text class="star">*</text>
						</view>
					</view>
					<view class="input">
						<view style="display: flex; align-items: center;">
							<input type="text" placeholder-style="color:#b3b3b3;" v-model="sms_code" adjust-position
								placeholder="请输入验证码" maxlength="6" />
							<view>
								<view class="code" @tap='getCode' v-if="!resend">获取验证码</view>
								<view class="code" v-if="resend">重新获取({{ countdown }})</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="" v-else @click="hideMessage">
			<view class="message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2">新密码
							<text class="star">*</text>
						</view>
					</view>
					<view class="input ">
						<text>两次密码输入不一致</text>
					</view>
				</view>
			</view>
			<view class="message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2">重复新密码
							<text class="star">*</text>
						</view>
					</view>
					<view class="input ">
						<text>请重复新密码</text>
					</view>
				</view>
			</view>
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2">手机号码
							<text class="star">*</text>
						</view>
					</view>
					<view class="input ">
						<input class="form_input" type="text" placeholder-style="color:#b3b3b3" v-model="tel"
							maxlength="11" placeholder="请输入手机号码" />
					</view>
				</view>
			</view>
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2">验证码
							<text class="star">*</text>
						</view>
					</view>
					<view class="input">
						<view style="display: flex; align-items: center;">
							<input type="text" placeholder-style="color:#b3b3b3;" v-model="sms_code" adjust-position
								placeholder="请输入验证码" maxlength="6" />
							<view class="code" @tap='getCode' v-if="!resend">获取验证码</view>
							<view class="code" v-if="resend">重新获取({{ countdown }})</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<button class="form_button" @click="determine">提交</button>
	</view>
</template>

<script>
	export default {
		props: {},
		components: {

		},
		data() {
			return {
				resend: false, //控制重新获取
				tel: '',
				sms_code: '',
				countdown: 0,
				resend1: true,
				clear: '',
				new_password: '',
				repassword: '',
				showMessage: true,
				id: '',
				newpwd1: '请输入新密码',
				newpwd2: '请输入新密码',
				phonePlaceHolder: '请输入手机号码',
				codePlaceHolder: '请输入验证码',
			};
		},
		computed: {},
		onLoad(e) {
			this.id = e.id
		},
		methods: {
			hideMessage() {
				this.showMessage = true
				this.new_password = ''
				this.repassword = ''
			},
			async determine() {
				var that = this;
				const letter = /^[a-zA-Z0-9_-]{6,16}$/; //6到16的数字或字母
				if (this.new_password === '' || this.repassword === '') {
					uni.showToast({
						title: '密码不能为空',
						icon: 'none'
					})
				} else if (this.tel === '') {
					uni.showToast({
						title: '手机号码不能为空',
						icon: 'none'
					})
				} else if (this.sms_code === '') {
					uni.showToast({
						title: '验证码不能为空',
						icon: 'none'
					})
				} else if (this.new_password != this.repassword) {
					this.showMessage = false
				} else if (letter.test(this.new_password) && letter.test(this.repassword)) {
					that.request({
						url: '/v1/member_register/v1',
						data: {
							'new_password': this.new_password,
							'repassword': this.repassword,
							'tel': that.tel,
							'sms_code': that.sms_code
						},
						method: 'PUT'
					}).then((res) => {
						if (res.code === 200) {
							uni.showToast({
								title: '修改成功',
								icon: 'none'
							})
							this.new_password = ''
							this.repassword = ''
							uni.redirectTo({
								url: '../theLogin/index'
							})
						} else {
							uni.showToast({
								title: res.desc,
								icon: "none"
							})
						}
					});

				}
			},
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
							type: 2
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
			}, // 倒计时
			countDown() {
				if (!this.countdown) {
					this.resend = false;
					clearInterval(this.clear);
				} else {
					--this.countdown;
				}
			},
		},
	};
</script>

<style lang="less">
	.account {
		width: 100%;

		.font_top {
			margin-top: 14rpx;
			margin-left: 30rpx;
			padding-bottom: 38rpx;
			box-sizing: border-box;
			font-size: 44rpx;
			color: #333333;
			// border-bottom: 2rpx solid #E6E6E6;
			font-weight: 900;
			display: flex;
			justify-content: space-between;
		}
	}

	.dem_message {
		margin: 0 30rpx;
		box-sizing: border-box;
		// padding-left:30rpx;
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

	.message {
		margin: 0 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #f13636;

		.danxuan {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;
			color: #f13636;
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
</style>
