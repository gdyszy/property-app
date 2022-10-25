<template>
	<view>
		<view class="box">
			<view class="head">成员信息</view>
			<view class="title">基本信息</view>
			<view class="msg">
				<view class="text">姓名<i style="color: #d93232;">*</i></view>
				<input type="text" v-model="name" placeholder-style="color:#b3b3b3" :placeholder="namePlaceHolder" @focus="namePlaceHolder=''" @blur="name==''?namePlaceHolder='请输入报修人姓名':''" />
			</view>
			<view class="msg">
				<view class="text">性别<i style="color: #d93232;">*</i></view>
				<view class="select">
					<view class="select_option" :class="{'selected':sex === 0}" @tap='selectSex(0)'>
						<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin-right: 8rpx;" v-if="sex === 1" />
						<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin-right: 8rpx;" v-else />
						<view>男</view>
					</view>
					<view class="select_option" :class="{'selected':sex === 1}" @tap='selectSex(1)'>
						<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin: 0 8rpx 0 52rpx;" v-if="sex === 0"/>
						<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin: 0 8rpx 0 52rpx;" v-else />
						<view>女</view>
					</view>
				</view>
			</view>
			<view class="msg">
				<view class="text">出生日期<i style="color: #d93232;">*</i></view>
				<picker class="pickerSelect" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
					<view style="font-size: 30rpx; color: #4d4d4d;display: flex;">{{date}}<view class="selImg"><image src="../../static/images/index/btn_12.png" style="width: 100%; height: 100%;" mode="scaleToFill" /></view></view>
					
				</picker>
			</view>
			<view class="msg">
				<view class="text">身份证号<i style="color: #d93232;">*</i></view>
				<input type="text" placeholder-style="color:#b3b3b3" v-model="peopleID" maxlength="18"  @focus="IdPlaceholder=''" @blur="peopleID==''?IdPlaceholder='请输入身份证号码':''" :placeholder="IdPlaceholder" />
			</view>
			<view class="msg">
				<view class="text">成员类型<i style="color: #d93232;">*</i></view>
				<view class="select">
					<view class="select_option" :class="{'selected':owner_type === 0}" @tap='selectOtype(2)'>
						<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin-right: 8rpx;" v-if="owner_type === 3" />
						<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin-right: 8rpx;" v-else />
						<view>家庭成员</view>
					</view>
					<view class="select_option" :class="{'selected':owner_type === 1}" @tap='selectOtype(3)'>
						<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin: 0 8rpx 0 52rpx;" v-if="owner_type === 2"/>
						<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 48rpx; height: 48rpx; margin: 0 8rpx 0 52rpx;" v-else />
						<view>租户</view>
					</view>
				</view>
			</view>
			<view class="title" style="margin-top: 60rpx;">联系信息</view>
			<view class="msg">
				<view class="text">手机号码<i style="color: #d93232;">*</i></view>
				<input type="text" placeholder-style="color:#b3b3b3" v-model="phone" maxlength="11" @focus="phonePlaceHolder=''" @blur="phone==''?phonePlaceHolder='请输入手机号码':''" :placeholder="phonePlaceHolder" />
			</view>
			<view class="msg">
				<view class="text">验证码<i style="color: #d93232;">*</i></view>
				<view style="display: flex; align-items: center;">
					<input type="text" placeholder-style="color:#b3b3b3" v-model="code" @focus="codePlaceHolder=''" @blur="code==''?codePlaceHolder='请输入验证码':''" adjust-position :placeholder="codePlaceHolder" />
					<view class="code" @tap='getCode' v-if="!resend">获取验证码</view>
					<view class="resend" v-if="resend">重新获取({{ countdown }})</view>
				</view>
			</view>
		</view>
		<view class="btn" @tap="add()">创建</view>
	</view>
</template>

<script>
	export default {
		data() {
			const currentDate = this.getDate({
			            format: true
			        })
			return {
				sex: 0, 
				resend:false, //控制重新获取
				name: '',
				peopleID: '',
				phone: '',
				code: '',
				countdown: 0,
				timestatus: false,
				clear: '',
				resend1: true,
				gender: '男',
				date: currentDate,
				namePlaceHolder: '请输入姓名',
				IdPlaceholder: '请输入身份证号码',
				phonePlaceHolder: '请输入手机号码',
				codePlaceHolder: '请输入验证码',
				otype:'家庭成员',
				owner_type:2
			}
		},
		 computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		methods: {
			selectOtype(n) {
				this.owner_type = n
				if(n === 2){
					this.otype = '家庭成员'
				}else{
					this.otype = '租户'
				}
			},
			selectSex(n) {
				this.sex = n
				if(n === 0){
					this.gender = 1
				}else{
					this.gender = 0
				}
			},
			getCode(){
				const c_mobile = /^1(3|4|5|6|7|8|9)\d{9}$/;  //判断手机号码正则
				if(!c_mobile.test(this.phone)){
					uni.showToast({
						title: '请输入正确手机号码',
						icon: 'none',
						duration:2000
					})
				}else{
					this.resend1 = false
				}

				if(!this.resend1){
					this.request({
						url: '/v1/sms',
						method: 'GET',
						data: {
							phones: this.phone
						}
					}).then((res)=>{
						if(res.code != 202){
							uni.showToast({
								title: res.desc,
								icon: 'none',
								duration:2000
							})
							this.resend = false
						}else if(res.code === 202){
							this.countdown = 60;
							this.resend = true;
							this.clear = setInterval(this.countDown,1000);
						}
					})
				}
			},
			// 倒计时
			countDown(){
				if(!this.countdown){                    
					this.resend = false;
					clearInterval(this.clear);
				}else{
					--this.countdown;
				}
			},
			add(){
				this.request({
					url: '/v1/members',
					method: 'POST',
					data: {
						name: this.name,
						gender: this.gender,
						tel: this.phone,
						identity_id: this.peopleID,
						sms_code: this.code,
						birth: this.date
					}
				}).then((res)=>{
					uni.showToast({
						title: res.desc,
						icon: 'none',
						duration: 2000
					})
					if(res.code === 200){
						uni.navigateBack({
							delta: 2
						})
					}
				})
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
	
				if (type === 'start') {
					year = year - 50;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../common/common.css';
	.select {
		display: flex;
		.select_option {
			display: flex;
			font-size: 30rpx;
			color: #b3b3b3;
		}
		.selected {
			display: flex;
			font-size: 30rpx;
			color: #808080;
		}
	}
	.code {
		width: 150rpx;
		height: 70rpx;
		color: #28b07c;
		font-size: 28rpx;
		margin-left: 58rpx;
		text-align: center;
		line-height: 70rpx;
	}
	.resend {
		width: 150rpx;
		height: 70rpx;
		background-color: #B3B3B3;
		color: #FFFFFF;
		font-size: 24rpx;
		margin-left: 24rpx;
		text-align: center;
		line-height: 70rpx;
	}
	.pickerSelect {
		display: flex;
		align-items: center;
	}
	.selImg {
		width: 36rpx;
		height: 36rpx;
		// margin-top: -15rpx;
		margin-left: 12rpx;
	}
</style>
