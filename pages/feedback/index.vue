<template>
 <view class="">
	  <view>
	       <view class="status_bar">	
	           <!-- 这里是状态栏 -->
	       </view>
	       <view class="tabbar"> 
			<image @click="fanhui" src="../../static/common/btn_05.png" mode=""></image>
			<image @click="lishiyijang" class="img" src="../../static/common/btn_08.png" mode=""></image>
		   </view>
	   </view>
	 
	 <view class='feedback'>
	 	  <view class="fee_message">
	 	  	<view class="fee_tit1">意见反馈</view>
	 		<view class="fee_tit" @click="submit_form">提交</view>
	 	  </view>
	 	  <form>
	 
	 	  	<view class="fee_message1">
	 	  	 	<view class="fee_radio">反馈信息</view>
	 	  			<view class="fee_radio1">
	 	  				<view class="fee_rad">
	 	  				<view class="fee_radio2">反馈类型</view>
	 	  				<text class="star">*</text>
	 	  				</view>
	 
	 	  				<picker name='picker' @click="pickerdata"  @change='changedata' class="radio_group" :value='index' :range='pickerData'>
							<view style="display: flex; align-items: center;">
								<view v-model="index" :class="index ==0?'norSel':'sel'"> {{ pickerData[index]}} </view>
								<view class="selImg"><image src="../../static/images/index/btn_12.png" style="width: 100%; height: 100%;" mode="scaleToFill" /></view>
							</view>
	 	  				</picker>
	 
	 	  			</view>
	 	  	 </view>
	 <view class="fee_input">
	 	<view class="">项目名称</view>
	 	 	  			<input v-model="title" type="text" placeholder-style="color:#b3b3b3" style="text-align: right; width: 80%; color: #4d4d4d;"  name='title' :placeholder="titlePlaceholder" @focus="telPlaceholder = ''" @blur = "title==''?titlePlaceholder='请输入反馈项目':''" />
	 </view>
	 	  	 <view class="fee_text">
	 	  	 	<view class="text_title">
	 	  				<view class="text_left">
	 	  					<view class="">意见反馈</view>
	 	  					<text class="text_star">*</text>
	 	  				</view>
	 	  				<view class="text_right">
	 	  					{{linenumber}}/140
	 	  				</view>
	 	  	 	</view>
	 	  			<textarea maxlength='140' value=""
	 	  			 @input='textfocus'
	 				 v-model="textData"
					style="width: 100%; color: #4d4d4d;"
					:placeholder="desPlaceholder"
					@focus="desPlaceholder = ''"
					@blur = "textData==''?desPlaceholder='请描述你遇到的问题或者反馈的意见':''"
					placeholder-style="color:#b3b3b3"
	 	  			 />
	 	  	 </view>
			 
	 	  	 <view class="fee_input">
	 	  	 	<view class="">联系方式</view>
	 	  			<input v-model="iphone" type="number" placeholder-style="color:#b3b3b3" style="text-align: right; width: 80%; color: #4d4d4d;" maxlength="11" name='phone' :placeholder="telPlaceholder" @focus="telPlaceholder = ''" @blur = "iphone==''?telPlaceholder='填写联系方式,以便我们联系您':''" />
	 	  	 </view>
			 
			 <view class="fee_input">
			 	<view class="">是否匿名</view>
			 	<view class="select">
			 		<view class="select_option" :class="{'selected':anonymity === 1}" @tap='selectType(1)'>
			 			<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin-right: 4rpx;" v-if="anonymity === 0" />
			 			<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin-right: 4rpx;" v-else />
			 			<view>是</view>
			 		</view>
			 		<view class="select_option" :class="{'selected':anonymity === 0}" @tap='selectType(0)'>
			 			<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin: 0 4rpx 0 24rpx;" v-if="anonymity === 1"/>
			 			<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin: 0 4rpx 0 24rpx;" v-else />
			 			<view>否</view>
			 		</view>
			 	</view>  			
			 </view>
	 	  </form>
	 </view>
 </view>
</template>

<script>
	import {Base64} from '../../utils/base64.js'
export default {
  props: {},
  data() {
    return {
		lineValue:'', //输入的数量
		linenumber: 0 ,
		pickerData:'' ,
		index: 0 ,
		textData: '',
		code:'',
		pickerdatas:'',
		iphone:'',
		title:'',
		titlePlaceholder:'请输入项目名称',
		desPlaceholder: '请描述你遇到的问题或者反馈的意见',
		telPlaceholder: '填写联系方式,以便我们联系您',
		anonymity: 0
	};
  },
  computed: {},
  onLoad(e) {
	  this.pickerdata()
	  this.code = Object.keys(e)[0]
  },
  methods: {
	  fanhui(){
		  uni.switchTab({
			  url:"../my/index"
		  })
	  },
	  async submit_form(){
		  const photo = /^1(3|4|5|6|7|8|9)\d{9}$/;  //判断手机号码正则
		  if(!photo.test(this.iphone)){
			  uni.showToast({
				  title:"请填写正确的手机号",
				  icon:'none'
			  })
			  return
		  }
		  
		  let type  = this.index
		  let res = await this.request({
			  url:'/v1/complains',
			  method:'POST',
			  data:{
				  title:this.title,
				  community_code:this.code,
				  tel:this.iphone,
				  reason: this.textData,
				  type:type,
				  is_anonymity: this.anonymity
			  }
		  })
		  if(res.code === 200){
			  uni.showToast({
			     title:res.desc,
			  	 icon:'none'
			  })
			  this.index = 0
			  this.title=""
			  this.textData = ""
			  this.iphone = ""
		  }else{
			  uni.showToast({
			     title:res.desc,
				 icon:'none'
			  })
		  }
	  },
	  changedata(e){
		  this.index = e.detail.value
	  },
	  async pickerdata(){
		  this.show = true
		  let res = await this.request({
			  url:'/v1/feedback_type'
		  })
		  this.pickerData = res.data
		  this.pickerData.unshift('请选择类型')
	  },
	  //历史记录
	  lishiyijang(){
		  uni.navigateTo({
		    url:"../yijang/index"
		  });
	  },
	  textfocus(e){
		  this.linenumber= e.detail.cursor
		  this.lineValue = e.detail.value
	  },
	  selectType(n){
	  	this.anonymity = n
	  },
  },
};
</script>

<style lang="less">
	.fee_message{
		margin: 0 30rpx;
		height: 100rpx;
		line-height: 100rpx;
		border-bottom: 1rpx solid #e6e6e6;
		display: flex;
		justify-content: space-between;
	}
	.fee_tit{
		font-size: 28rpx;
		color: #28B07C;
	}
	.fee_tit1{
		font-size: 44rpx;
		font-weight: 700;
	}
	.fee_message1{
		margin: 0 30rpx;
		border-bottom: 1rpx solid #e6e6e6;
		.fee_radio{
			font-size: 30rpx;
			font-weight: 700;
			margin-top: 30rpx;
		}
		.fee_radio1{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100rpx;
			image{
				width: 38rpx;
				height: 38rpx;
				vertical-align:middle;
				margin-left: 10rpx;
			}
			.radio_group{
				color: #C8C7CC;
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
				font-size: 25rpx;
				display: inline-block;
				height: 100rpx;
				padding-top: 50rpx;
				margin-left: 5rpx;
			}
		}
	}

	.fee_text{
		margin: 0 30rpx;
		border-bottom: 1rpx solid #e6e6e6;
		padding-top: 30rpx;
		.text_title{
			display: flex;
			justify-content: space-between;
			.text_left{
				display: flex;
				.text_star{
					color: red;
					font-size: 25rpx;
					margin-left: 5rpx;
				}
			}
			.text_right{
				color: #C8C7CC;
			}
		}
		textarea{
			margin-top: 20rpx;
			height: 200rpx;
		}
	}



	.fee_input{
		margin: 0 30rpx;
		display: flex;
		justify-content: space-between;
		height: 100rpx;
		line-height: 100rpx;
		border-bottom: 1rpx solid #e6e6e6;
		input{
			width: 390rpx;
			height: 100rpx;
			line-height: 100rpx;
		}
	}
	.fee_button{
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		border-radius: 0;
		// margin-top: 80rpx;
	}
	
	.status_bar {
	      height: var(--status-bar-height);
	      width: 100%;
	  }
	 .tabbar{
		 height: 84rpx;
		 display: flex;
		 align-items: center;
		 padding: 0 22rpx;
		 image{
			 width: 48rpx;
			 height: 48rpx;
		 }
		 .img{
			 margin-left: 18rpx;
		 }
	 }
	 .selImg {
	 	width: 36rpx;
	 	height: 36rpx;
	 	margin-top: -15rpx;
	 	// margin-left: 12rpx;
	 }
	 .norSel {
		 color: #b3b3b3;
	 }
	 .sel {
		 color: #4d4d4d;
	 }
	 .select {
	 	display: flex;
	 	.select_option {
	 		display: flex;
			align-items: center;
	 		font-size: 30rpx;
	 		color: #b3b3b3;
	 	}
	 	.selected {
	 		display: flex;
	 		font-size: 30rpx;
	 		color: #808080;
	 	}
	 }
</style>
