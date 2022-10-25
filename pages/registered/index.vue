<template>
 	<view class="zhuce">
 		<view class="zc_title">
 			<text>注册</text>
 			<view class="zc_ious"></view>
 		</view>

 		<view class="form">
 			<input class="form_input" type="text" placeholder-style="font-size: 30rpx;color: #B3B3B3;" v-model="username" placeholder="请输入用户名" />
 			<input class="form_input" type="password" placeholder-style="font-size: 30rpx;color: #B3B3B3;" v-model="password" placeholder="请输入密码"   />
 			<input class="form_input" type="password" placeholder-style="font-size: 30rpx;color: #B3B3B3;" v-model="repassword" placeholder="请再次输入密码"   />
 			<input class="form_input" type="text" placeholder-style="font-size: 30rpx;color: #B3B3B3;" v-model="tel" maxlength="11" @focus="phonePlaceHolder=''"  placeholder="请输入手机号码" />
 			<view class="msg">
 				<view class="text">验证码</view>
 				<view style="display: flex; align-items: center;">
 					<input type="text" placeholder-style="font-size: 30rpx;color: #B3B3B3;" v-model="sms_code" @focus="codePlaceHolder=''"
 						@blur="sms_code==''?codePlaceHolder='请输入验证码':''" adjust-position
 						placeholder="请输入验证码" maxlength="6"/>
 					<view class="code" @tap='getCode' v-if="!resend">获取验证码</view>
 					<view class="resend" v-if="resend">重新获取({{ countdown }})</view>
 				</view>
 			</view>
			<text class="errtext">{{errmsg}}</text>
 			<button class="form_button" @click="zhuce" >注册</button>
 		</view>

 		<view class="zc_text">
 			<text class="dltext1">已有账号？</text><text class="dltext2" @click="theLogin">现在登录</text>
 		</view>

 	</view>
 </template>

 <script>
 	export default {
 		props: {},
 		data() {
 			return {
				resend:false, //控制重新获取
				tel: '',
				sms_code: '',
				countdown: 0,
				resend1: true,
				clear: '',
 				errmsg: '',
 				username: '',
 				password: '',
 				repassword: ''
 			};
 		},
 		computed: {},
 		onLoad() {

 		},
 		onShow() {},
 		methods: {
 			theLogin() {
 				// uni.navigateBack({
 				//     delta: 1
 				// });
 				/* uni.navigateTo({
 					url: "/pages/theLogin/index"
 				}); */
				this.$emit('switchStatus',0)
 			},
 			zhuce() {
 				var that = this;
				const letter = /^[a-zA-Z0-9_-]{3,12}$/; //请填写3-12位数字、字母、下划线
				const pwdletter = /^[a-zA-Z0-9_-]{6,16}$/;//请填写6-16位字符，不能包含空格
				let username = that.username
				let password = that.password
				let repassword = that.repassword
				if (username === '') {
					that.errmsg = '用户名不能为空';
					return false;
				} else if (password === '') {
					that.errmsg = '密码不能为空';
					return false;
				} else if (repassword === '') {
					that.errmsg = '确认密码不能为空';
					return false;
				} else if (password != repassword) {
					that.errmsg = '两次密码不相同';
					return false;
				} else if (password === username) {
					that.errmsg = '账号密码不能一致';
					return false;
				}else if(letter.test(username)==false){
					that.errmsg = '请填写3-12位数字、字母、下划线';
					return false;
				}else if(letter.test(password)==false||letter.test(repassword)==false){
					that.errmsg = '请填写6-16位字符，不能包含空格';
					return false;
				}else if (that.tel === '') {
					that.errmsg = '手机号码不能为空';
					return false;
				}else if (that.sms_code === '') {
					that.errmsg = '验证码不能为空';
					return false;
				}
				 else {
					that.errmsg = '';
				
				}
 				if(that.errmsg!=''){
 				}else{
 				that.request({
 					url: '/v1/member_register',
 					data: {
 						'username': that.username,
 						'password': that.password,
 						'repassword': that.repassword,
						'tel':that.tel,
						'sms_code':that.sms_code
 					},
 					method: 'POST'
 				}).then((res) => {
 					if (res.code === 200) {
						uni.showToast({
							title:'注册成功',
							duration:1000
						})
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
 			},getCode(){
				const c_mobile = /^1(3|4|5|6|7|8|9)\d{9}$/;  //判断手机号码正则
				const _this = this;
				if(!c_mobile.test(_this.tel)){
					uni.showToast({
						title: '请输入正确手机号码',
						icon: 'none',
						duration:2000
					})
					return false;
				}else{
					_this.resend1 = false
				}
			
				if(!_this.resend1){
					_this.request({
						url: '/v1/sms',
						method: 'GET',
						data: {
							phones: _this.tel,
							type:1
						}
					}).then((res)=>{
						if(res.code != 202){
							uni.showToast({
								title: res.desc,
								icon: 'none',
								duration:2000
							})
							_this.resend = false
						}else if(res.code === 202){
							_this.countdown = 60;
							_this.resend = true;
							_this.clear = setInterval(_this.countDown,1000);
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
 		},
 	};
 </script>

 <style lang="less">
 	.zhuce {
 		.zc_title {
 			margin: 0 74rpx;
 			margin-top: 72rpx;

 			text {
 				font-size: 54rpx;
 				font-weight: 700;
 				color: #262626;
 			}

 			.zc_ious {
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

 			.errtext {
 				margin-top: 26px;
 				font-size: 26rpx;
 				color: #f13535;
 			}
 		}

 		.zc_text {
 			position: absolute;
 			bottom: 129rpx;
 			width: 100%;
 			text-align: center;
 			font-size: 24rpx;

 			.dltext1 {
 				color: #b3b3b3;
 			}

 			.dltext2 {
 				font-size: 26rpx;
 				color: #3c78e6;
 			}
 		}
 	}.msg {
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
 </style>