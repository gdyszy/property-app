<template>
  <view class='mymessage'>
	  <view class="my_message" v-for="(item, index) in myMessage" :key='index' >
	  	<view class="my_image">
	  		<image src="../../static/message/ico_01_08.png" mode=""></image>
	  	</view>
		<view class="my_right" @click="onshow(index,item.reason)">
			<view class="text">
				<view class="text_left">
					{{item.type}}
				</view>
				<view class="text_right">
					{{item.create_time | timeStamp}}
				</view>
			</view>
			<view class="text1" v-show="item.isShow">
				项目名称：{{item.title}}
			</view>
			<view class="text1" v-show="item.isShow">
				事由：{{item.reason}}
			</view>
			<view class="text1" v-show="item.isShow">
				投诉答复：{{item.reply}}
			</view>
			<view class="text1" v-show="item.isShow">
				状态：{{item.status==1?'已回复':'待回复'}}
			</view>
			<view class="more" @click.stop="showMroe(item)">
				{{item.isShow?'收起信息':'查看更多'}}
			</view>
		<!-- 	<view class="text1" v-if="item.isSelected===true">{{item.reason}}</view>
			<view class="text1" v-if="item.isSelected===false" :class="{ cen_con : text }">{{item.reason}}</view>-->
			<view class="shouqi" v-if="item.isSelected===true" @click.stop="clickshouqi1(index)" >收起 
			<image src="../../static/message/btn_01.png" mode=""></image>
			</view>
		</view>
	  </view>
	  <view class="bottom">
	  	没有更多了
	  </view>
  </view>
</template>

<script>
export default {
  props: {},
  data() {
    return {
		text: true ,
		myMessage:[]
	};
  },
  filters:{
	  timeStamp: function(value) {
	  	if (!value) return '';
	  	var now = new Date(value*1000);
	  	//console.log("time:" + JSON.stringify(now));
	  	// var year = now.getFullYear();
	  	var month = now.getMonth() + 1;
	  	if (month < 10) {
	  		month = '0' + month
	  	}
	  	var date = now.getDate();
	  	if (date < 10) {
	  		date = '0' + date
	  	}
	  	return  month + "-" + date
	  }
  },
  computed: {},
  onLoad() {
	  this.mymessage()
  },
  methods: {
	  // 点击展开收起
	  showMroe(e) {
	  	const status = e.isShow;
	  	this.myMessage.forEach(item => {
	  		item.isShow = false
	  	})
	  	e.isShow = !status
	  	this.$forceUpdate()
	  },
	  onshow(index,msg){
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
	  },
	  async mymessage(){
		  let res = await this.request({
			  url:'/v1/complains'
		  })
		  if(res.code ===200){
			  this.myMessage = res.data
			  const vm = this;
			  this.myMessage.forEach(function(res)
			  {
				  vm.$set(res,"isSelected",false)
			  })
			  // console.log( this.myMessage)
		  }else{
			  // console.log("1")
		  }
	  },
	  clickshouqi1(index){
		  this.myMessage[index].isSelected=false
	  }
  },
};
</script>

<style scoped lang="less" >
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
					margin-top: 10rpx;
					margin-bottom: 10rpx;
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
	.more {
		position: absolute;
		bottom: 0;
		right: 20rpx;
		font-size: 28rpx;
		color: #6e7069;
	}
</style>

