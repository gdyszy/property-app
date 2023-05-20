<template>
	<view>
	<view class="demand">
		<view class="dem_title">
			业主信息
		</view>
		
			<view class="dem_message">
				<view class="header">小区信息</view>
				<view class="danxuan">
					<view class="fee_rad">
					<view class="fee_radio2">市及区
					<text class="star">*</text>
					</view>
					</view>
					<view class="radio_group">
						<picker @change="changePicker" :value="index" :range="region">
							<view class="uni-input">{{region[index]}}<view class="newNoticeRight">
								<image src="../../static/images/index/btn_12.png" mode="scaleToFill" style="width: 100%; height: 100%;"></image>
							</view></view>
							
						</picker>
					</view>
				</view>
			</view>
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
					<view class="fee_radio2">小区名称
					<text class="star">*</text>
					</view>
					</view>
					<view class="input">
						<view>{{Object.values(this.CM)[0]}}</view>
					</view>
				</view>
			</view>
			

			
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
					<view class="fee_radio2">小区编号
					<text class="star">*</text>
					</view>
					</view>
					<view class="input">
						<view >{{Object.keys(this.CM)[0]}}</view>
					</view>
				</view>
			</view>
			
			<form @submit='formsubmit' >
			<view class="dem_message">
				<view class="header">业主信息</view>
				<view class="danxuan">
					<view class="fee_rad">
					<view class="fee_radio2">业主姓名
					<text class="star">*</text>
					</view>
					</view>
					
					<view class="input ">
						<input name="myName" v-model="myName" type="text" :placeholder="namePlaeholder" @focus="namePlaeholder = ''" @blur="myName==''?namePlaeholder='请输入姓名':''" />
					</view>
				</view>
			</view>
			
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
					<view class="fee_radio2">房号
					<text class="star">*</text>
					</view>
					</view>
					<view class="input ">
						<input name="myHouse" v-model="myHouse" type="text" :placeholder="housePalceholder" @blur="myHouse==''?housePalceholder = '请输入房号':''" @focus="housePalceholder = ''" />
					</view>
				</view>
			</view>
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
					<view class="fee_radio2">身份证号
					</view>
					</view>
					<view class="input ">
						<input name="myID" v-model="peopleID" type="text" :placeholder="Idplaceholder" @blur="peopleID==''?Idplaceholder ='请输入身份证号码':Idplaceholder =''" @focus="Idplaceholder =''" cursor-spacing="80" />
					</view>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
					<view class="fee_radio2">手机号码
					<text class="star">*</text>
					</view>
					</view>
					<!-- <view class="input ">
						<input name="myPhone" v-model="inputPhone" @focus='phonePlaceholder = ""' type="text" :placeholder="phonePlaceholder" @blur="inputPhone==''?phonePlaceholder='请输入电话号码':''" cursor-spacing="80" maxlength="11" />
					</view> -->
					<view class="inputCode input ">
						<input name="myPhone" disabled="true" v-model="inputPhone" @focus='phonePlaceholder = ""' type="text" :placeholder="phonePlaceholder" @blur="inputPhone==''?phonePlaceholder='手机号码':''" cursor-spacing="80" maxlength="11" />
						<button class="code"  open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>
					</view>
					<wyb-loading ref="loading" title="加载中..."/>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 || APP-PLUS-->
			<!-- <view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2"><text class="star">*</text>手机号码</view>
					</view>
					<view class="input ">
						<input class="form_input" type="text" placeholder-style="color:#b3b3b3" v-model="inputPhone"
							maxlength="11" @focus="phonePlaceHolder=''" @blur="inputPhone==''?phonePlaceHolder='请输入手机号码':''"
							:placeholder="phonePlaceHolder" />
					</view>
				</view>
			</view>
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
						<view class="fee_radio2"><text class="star">*</text>验证码</view>
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
			</view> -->
			<view class="dem_message">
							<view class="danxuan">
								<view class="fee_rad">
								<view class="fee_radio2">手机号码
								<text class="star">*</text>
								</view>
								</view>
								<view class="input ">
									<input name="myPhone" v-model="inputPhone" @focus='phonePlaceholder = ""' type="text" :placeholder="phonePlaceholder" @blur="inputPhone==''?phonePlaceholder='请输入电话号码':''" cursor-spacing="80" maxlength="11" />
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
								<view class="inputCode input ">
									<input class="codename" name="myCode" type="text" :placeholder="codePlaceholder" v-model="code" @blur="code==''?codePlaceholder='请输入验证码':''" @focus='codePlaceholder = ""' cursor-spacing="40" />
									<view class="code" v-if="verifyShow === true"  @click="getmycode">获取验证码</view>
									<view class="code" v-else>{{second+'s'}}</view>
								</view>
							</view>
						</view>
			<!-- #endif -->
			
			<view class="checkbox-xy">
			<!-- 同意服务条款 -->
			<checkbox-group :class="checked == 1 ? 'shake-horizontal' : ''" class="auth-clause" @change="CheckboxChange">
				<checkbox class="orange" :class="checked == 2 ? 'checked' : ''" :checked="checked == 2 ? true : false" value="2" />
				<view>
					我已阅读<text class="linkxy" @tap="onDetails(8, '用户协议')">用户协议</text>及<text class="linkxy" @tap="onDetails(9, '隐私保护')">隐私权保护声明</text>
				</view>
			</checkbox-group>
			</view>
			
			<view class="checkbox-xy"></view>
			<view>
				<button class="button" type='default'  form-type="submit">提交</button>
			</view>
		</form>
		
			
		</view>
		</view>
</template>

<script>
	import wybLoading from '@/components/wyb-loading/wyb-loading.vue'
	import md5 from '../../common/md5.js'
	export default {
	props: {},
	data() {
		return {
			checked: 0,
			isChecked:false,
			region:[], // 选择地区
			index:0, //默认下标为0
			CM:'',
			myPhone:'', // 获取电话号码
			verifyShow: true,  //验证码初始值
			second: 60,
			Idplaceholder: '请输入身份证号码',
			peopleID: '',
			namePlaeholder: '请输入姓名',
			myName: '',
			myHouse: '',
			housePalceholder: '请输入房号',
			inputPhone: '',
			phonePlaceholder: '手机号码',
			codePlaceholder: '请输入验证码',
			code: ''
		};
	},
	components:{
		wybLoading
	},
	onLoad() {
		this.communities()
		wx.login({
		      success: res => {
		     this.loginRes = res.code
		      }
		    })
	},
	methods: {
		CheckboxChange(e) {
			this.checked = e.detail.value;
			this.isChecked = !this.isChecked
		},
		getPhoneNumber(e){
			let that = this
			let getData = {
				encryptedData:e.detail.encryptedData,
				iv:e.detail.iv,
				code:this.loginRes
			}
			uni.checkSession({
				success(e) {
				},
				fail() {
					wx.login({
					      success: res => {
					     that.loginRes = res.code
					      }
					    })
				},
				complete() {
			that.request({
			  url:'/v1/token/get_phone_number',
			  method:'POST',
			  data:getData
			}).then((res)=>{
				if(res.code==200){
					that.inputPhone = res.data.tel
				}
			})
				}
			})

		},
		//提交表单
		async formsubmit(e){
			if(!this.isChecked){
				uni.showToast({
					title: '请勾选同意选项',
					icon: 'none',
					duration: 2000,
				});
				return
			}
			// #ifdef APP-PLUS||H5
			if(!this.code){
				uni.showToast({
					title: '请输入验证码',
					icon: 'none',
					duration: 2000,
				});
				return
			}
			// #endif
			 let userInfo = uni.getStorageSync('myinfo');
			 let value = e.detail.value
			 const reg_sfz = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			 
			 if(!reg_sfz.test(value.myID)&&value.myID){
				 uni.showToast({
				 	title:'身份证填写错误',
				 	icon:"none"
				 })
				 return
			 }
			 
			 let res = await this.request({
				 url:'/v1/members/'+userInfo.client.user_id,
				 method:'PUT',
				 data:{
					 community_code:Object.keys(this.CM)[0],
					 house_name:value.myHouse,
					 name:value.myName,
					 identity_id:value.myID,
					 tel:value.myPhone,
					 sms_code:value.myCode
				 }
			 })
			 // console.log(res)
			 if(res.code === 200){
				 uni.switchTab({
					 url:'./index'
				 })
			 }else{
				 uni.showToast({
				 	title:res.desc,
					icon:"none"
				 })
			 }
		 },
		//获取验证码
		async getmycode(){
				if(this.inputPhone != ''){
					this.verifyShow = false
					var interval = setInterval(()=>{
						--this.second
					},1000)
					setTimeout(()=>{
						clearInterval(interval)
						this.verifyShow = true
						this.second = 60
					},60000)
					let res = await this.request({
						url:"/v1/sms",
						method:"GET",
						data:{
							phones:this.inputPhone
						}
					})
					uni.showToast({
						title:res.desc,
						icon:"none"
					})
				}else{
					uni.showToast({
						title:'请填写手机号',
						icon:"none"
					})
				}
			
			
		},
		//获取手机号
		myphone(e){
			this.myPhone = e.detail.value
			this.phonePlaceholder = '请输入电话号码'
		},
		//changePicker
		async changePicker(e){
			this.index = e.detail.value
			let res = await this.request({
				url:'/v1/communities',
			 method:'GET',
				data:{
					handler:'community_kv',
					'filter[address]' : this.region[this.index]
				}
			})
			// console.log(res)
			if(res.code === 200 ){
				this.CM =  res.data
				
			}else{
				uni.showToast({
					title: res.desc,
					icon:"none"
				})
			}
		},
		async communities(){
			let res = await this.request({
				url:'/v1/communities',
				method:'GET',
				data:{
					handler:'address_kv'
				}
			})
			this.region = res.data
			let data = await this.request({
				url:'/v1/communities',
				method:'GET',
				data:{
					handler:'community_kv',
					'filter[address]' : this.region[0]
				}
			})
			// console.log(res)
			if(data.code === 200 ){
				this.CM =  data.data	
			}else{
				uni.showToast({
					title: data.desc,
					icon:"none"
				})
			}
		}
	},
	};
</script>

<style scoped lang="less">
	.demand{
		box-sizing: border-box;
		.dem_title{
			padding: 0 28rpx;
			padding-top: 12rpx;
			padding-bottom: 38rpx;
			border-bottom: 1rpx solid #e6e6e6;
			font-size: 44rpx;
			font-weight: 900;
			color: #333333;
		}
		.dem_message{
			padding: 32rpx 28rpx;
			box-sizing: border-box;
			border-bottom: 1rpx solid #e6e6e6;
			.header{
				font-size: 32rpx;
				font-weight: 900;
				color: #333333;
				margin-bottom: 28rpx;
			}
			.danxuan{
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30rpx;
				color: #333333;
			}
		}
	}
	.fee_rad{
		display: flex;
		align-items: center;
		
	}
	.star{
		color: red;
	}
	
	.input{
		text-align: right;
		padding-right: 30rpx;
	}
		
	.fee_button{
		width: 100%;
		height: 100rpx;
		background-color: #68cda2;
		border: 0;
		color: white;
		position: absolute;
		bottom: 0;
	}
	.uni-input{
		padding-right: 30rpx;
		display: flex;
	}
	
	.inputCode{
		display: flex;
		align-items: center;
		// height: 100rpx;
		.code{
			margin-left: 20rpx;
			 width: 240rpx;
			font-size: 32rpx;
			text-align: center;
			color: #28b07c;
		}
	}
	
	.button{
		margin-top: 80rpx;
		width: 100%;
		height: 100rpx;
		background-color: #68cda2;
		border: 0;
		color: white;
		padding: 0 !important;
		position: fixed;
		bottom: 0;
	}
	.newNoticeRight {
		width: 36rpx;
		height: 36rpx;
		margin-left: 12rpx;
		margin-right: -30rpx;
	}
	.checkbox-xy{
		display: flex;
		margin-top: 20px;
		margin-bottom:60px;
	}
	.auth-clause {
		display: flex;
		align-items: center;
		font-size: 30rpx;
		color: #909090;
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