<template>
  <view class="">
	<view class="linemassage" />
  	<view class='mymessage'>
  		  <view class="my_message" v-if="methos!=''"  v-for="(item,index) in myMessage" :key='index' @click="onshow(index,item)">
  		  	<view class="my_image">
  		  		<image src="../../static/message/ico_01_08.png" mode=""></image>
  		  	</view>
  			<view class="my_right" >
  				<view class="text">
  					<view class="text_left">
  						{{item.type | statusType}}
  					</view>
  					<view class="text_right">
  						{{item.create_time | timeDate}}
  					</view>
  				</view>
  				<view class="text1" v-if="item.isSelected===true">
  					{{item.msg}}
  				</view>
  				<view class="text1" id="selectedID" v-if="item.isSelected===false" :class="{ cen_con : text  }">
  				{{item.msg}}
  				</view>
  				<view class="shouqi" v-if="item.isSelected===true">收起
  				<image src="../../static/message/btn_01.png" mode=""></image>
  				</view>
  			</view>
  		  </view>
		  <view class="nothingImg">
		  	<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
		  </view>
  		  <view class="bottom">没有更多了</view>
  	</view>
  </view>
</template>

<script>
	import {timeDate} from '../../utils/time.js'
export default {
  props: {},
  data() {
    return {
		text: true ,
		myMessage:[] ,
		methos:uni.getStorageSync('myinfo')
	};
  },
  filters: {
	  timeDate,
			statusType:function(value){
				switch (value) {
					case 0:
						return  '系统消息';
					case 1:
						return '通知消息';
					default:
						return '';
				}
			}
	},
  computed: {},
  onLoad() {
	  this.mymessage()
  },
  methods: {
	  onshow(index,e){
		
		if(e.isSelected === false){
			let msg = e.msg
			if(msg != ''){
				var pattern = new RegExp("[\u4E00-\u9FA5]+");
				var pattern2 = new RegExp("[A-Za-z]+");
				var pattern3 = new RegExp("[0-9]+");
				if(pattern.test(msg) && msg.length > '15'){
					this.myMessage[index].isSelected=true
				}else if(pattern2.test(msg) && msg.length > 30){
					this.myMessage[index].isSelected=true
				}else if(pattern3.test(msg) && msg.length > 30){
					this.myMessage[index].isSelected=true
				}else{
					this.myMessage[index].isSelected=false
				}
			}
		}else{
			this.myMessage[index].isSelected=false
		}
		
		
	  },
	  async mymessage(){
		  let res = await this.request({
			  url:'/v1/msgs'
		  })
		  if(res.code ===200){
			  this.myMessage = res.data
			  const vm = this 
			  this.myMessage.forEach(function(res){
				  vm.$set(res,"isSelected",false)
			  })
		  }else{
		  }
	  },
	  clickshouqi1(index){
		 
	  }
  },
  mounted() {
  	
  },
};
</script>

<style scoped lang="less">
	.linemassage{
		width: 100%;
		height: 1rpx;
		border-bottom: 1rpx solid #e6e6e6;
	}
	.mymessage{
		width: 690rpx;
		margin: 0 30rpx;
		.my_message{
			margin-top: 44rpx;
			display: flex;
			.my_image{
				image{
					width: 78rpx;
					height: 78rpx;
				}
			}
			.my_right{
				margin-left: 32rpx;
				position: relative;
				padding-bottom: 40rpx;
				border-bottom: 1rpx solid #e6e6e6;
				.text{
					display: flex;
					justify-content: space-between;
					width: 580rpx;
					.text_left{
						color: #262626;
						font-size: 32rpx;
					}
					.text_right{
						color: #b3b3b3;
						font-size: 24rpx;
					}
				}
				.text1{
					color: #808080;
					font-size: 26rpx;
					width: 580rpx;
				}
				.shouqi{
					position: absolute;
					bottom: 22rpx;
					right: 0;
					font-size: 24rpx;
					color: #b3b3b3;
					image{
						width: 20rpx;
						height: 20rpx;
						margin-left: 7rpx;
					}
				}
			}
		}
	}
	
	.bottom{
		margin-top: 25rpx;
		color: #B3B3B3;
		font-size: 26rpx;
		width: 100%;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
	}
	.cen_con{
		width: 400rpx !important ;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
</style>
