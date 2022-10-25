<template>
  <view class='account'>
		  <view class="font_top">
		  		  <view>修改密码</view>
		  		 <view class="topRight" @click="determine">确定</view>
		  </view>
	  	
	  	<view class="dem_message" style="border-top: 2rpx solid #E6E6E6;">
	  		<view class="danxuan">
	  			<view class="fee_rad">
	  			<view class="fee_radio2">原始密码
	  			<text class="star">*</text>
	  			</view>
	  			</view>
	  			<view class="input ">
	  				<input placeholder-class="placestyle" v-model="originalPassword" name="myPhone" type="text" password :placeholder="oldpwd" @focus="oldpwd=''" @blur="originalPassword==''?oldpwd='请输入原始密码':''" />
	  			</view>
	  		</view>
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
						<input placeholder-class="placestyle" name="myPhone" v-model="newPassword"   type="text" password :placeholder="newpwd1" @focus="newpwd1=''" @blur="newPassword==''?newpwd1='请输入新密码':''" />
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
						<input placeholder-class="placestyle" name="myPhone"  v-model="newPasswords" type="text" password :placeholder="newpwd2" @focus="newpwd2=''" @blur="newPasswords==''?newpwd2='请输入新密码':''" />
					</view>
				</view>
			</view>
		</view>
		
		<view class="" v-else @click="hideMessage">
			<view  class="message">
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
			<view  class="message">
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
		</view>
	  
  </view>
</template>

<script>
	
export default {
  props: {},
  components:{
	  
  },
  data() {
    return {
		originalPassword:'',
		newPassword:'',
		newPasswords:'',
		showMessage:true,
		id:'',
		oldpwd: '请输入原始密码',
		newpwd1: '请输入新密码',
		newpwd2: '请输入新密码'
	};
  },
  computed: {},
  onLoad(e) {
	  this.id = e.id
  },
  methods: {
	  hideMessage(){
		  this.showMessage = true
		  this.newPassword =''
		  this.newPasswords =''
		  },
	  async determine(){
		  // console.log(this.originalPassword , this.newPassword , this.newPasswords)
		  const letter = /^[a-zA-Z0-9_-]{6,16}$/; //6到16的数字或字母
		  if(this.originalPassword === '' || this.newPassword=== '' || this.newPasswords === ''){
			  uni.showToast({
				  title:'密码不能为空',
				  icon:'none'
			  })
		  }else if (this.newPassword != this.newPasswords ){
			  this.showMessage = false
		  }else if (letter.test(this.newPassword) && letter.test(this.newPasswords)){
			  let res = await this.request({
				  url:'/v1/members/'+this.id+'?handler=changePassword',
				  old_password:this.originalPassword,
				  new_password:this.newPassword,
				  repassword:this.newPasswords
			  })
			  if(res.code ===200){
				  uni.showToast({
					  title:'修改成功',
					  icon:'none'
				  })
				  this.newPassword =''
				  this.newPasswords =''
				  this.originalPassword =''
			  }
			  
		  }
	  }
  },
};
</script>

<style lang="less">
	.account{
		width: 100%;
		.font_top{
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
	
	.dem_message{
		margin: 0 30rpx;
		box-sizing: border-box;
		// padding-left:30rpx;
		border-bottom: 1rpx solid #e6e6e6;
		.danxuan{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;
			color: #333333;
		}
	}
	.message{
		margin: 0 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #f13636;
		.danxuan{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			line-height: 100rpx;
			font-size: 30rpx;
			color: #f13636;
		}
	}
	.fee_rad{
		display: flex;
		// justify-content: center;
		align-items: center;
		.fee_radio2{
			height: 100rpx;
			line-height: 100rpx;
		}
	}
	.star{
		color: red;
	}
	.input{
		text-align: right;
		padding-right: 30rpx;
	}
	.topRight{
		margin-right: 30rpx;
		font-size: 26rpx;
		color: #28b07c;
		padding-top: 10rpx;
		padding-right: 10rpx;
	}
	.placestyle{
		font-size: 30rpx;
		color: #b3b3b3;
	}
</style>
