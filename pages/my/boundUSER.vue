<template>
	<view class='demand'>
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
					<view class="fee_radio2">房产编号
					<text class="star">*</text>
					</view>
					</view>
					<view class="input ">
						<input name="myHouse" v-model="myHouse" type="text" :placeholder="housePalceholder" @blur="myHouse==''?housePalceholder = '请输入房产编号':''" @focus="housePalceholder = ''" />
					</view>
				</view>
			</view>
			<view class="dem_message">
				<view class="danxuan">
					<view class="fee_rad">
					<view class="fee_radio2">身份证号
					<text class="star">*</text>
					</view>
					</view>
					<view class="input ">
						<input name="myID" v-model="peopleID" type="text" :placeholder="Idplaceholder" @blur="peopleID==''?Idplaceholder ='请输入身份证号码':Idplaceholder =''" @focus="Idplaceholder =''" cursor-spacing="80" />
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
						<input class="codename" name="myCode" type="text" :placeholder="codePlaceholder" v-model="code" @blur="code==''?codePlaceholder='请输入电话号码':''" @focus='codePlaceholder = ""' cursor-spacing="40" />
						<view class="code" v-if="verifyShow === true"  @click="getmycode">获取验证码</view>
						<view class="code" v-else>{{second+'s'}}</view>
					</view>
				</view>
			</view>
			
			<view>
				<button class="button" type='default'  form-type="submit">提交</button>
			</view>
		</form>
		
			
		</view>
</template>

<script>
	export default {
	props: {},
	data() {
		return {
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
			housePalceholder: '请输入房产编号',
			inputPhone: '',
			phonePlaceholder: '请输入电话号码',
			codePlaceholder: '请输入验证码',
			code: ''
		};
	},
	onLoad() {
		this.communities()
		
	},
	methods: {
		//提交表单
		async formsubmit(e){
			 let userInfo = uni.getStorageSync('myinfo');
			 let value = e.detail.value
			 const reg_sfz = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			 
			 if(!reg_sfz.test(value.myID)){
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
					 house_code:value.myHouse,
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
			margin-left: 58rpx;
			// width: 200rpx;
			font-size: 28rpx;
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
</style>