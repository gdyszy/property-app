<template>
	<view>
		<view style="position: fixed; z-index: 9999; width: 100%;">
		<view class="stateBar"></view>
		<view class="uni-tab-bar1">
			<view class="addicon" @click="addtop"><image src="../../static/images/familyBer/btn_07.png" mode="scaleToFill" style="width: 100%; height: 100%;" /></view>
			<view class="tabs" style="display: flex;">
				<block v-for="(tab,index) in tabBars" :key="tab.id">
					<view class="swiper-tab-list" 
					:class="{'active':tabIndex==index}"
					@tap="tabtap(index,tab.id)"
					>
						{{tab.name}}
						<view class="swiper-tab-line"></view>
					</view>
				</block>
			</view>
		</view>
		</view>
		<!-- <view class="status-no"></view> -->

		<view class="uni-tab-bar" style="padding-top: 140rpx;">
			<swiper class="swiper-box" :current='tabIndex' @change='currentindex' :style="{height:swiperheight+'px'}" duration="200">
				<swiper-item> 
					<scroll-view scroll-y="true" class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<junk :listData='oldShop'></junk>
						<view ><uni-load-more color="#b3b3b3"  :status="status" :content-text="contentText" /></view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y="true" class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<junk :listData='newNeed' ></junk>
						<view ><uni-load-more color="#b3b3b3" :status="status" :content-text="contentText" /></view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		
	</view>
</template>

<script>
	import  junk from "./juihuo.vue"
	import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue"
	export default {
		components:{
			 junk,
			 uniLoadMore
	
		},
		data() {
			return {
				tabBars: [
					{'name': '旧货出售','id':1},
					{'name': '求购需求','id':2}
				],
				tabIndex: 0,
				swiperheight:500,
				oldShop: [],
				newNeed: [],
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '',
					contentnomore: '没有更多',
				},
				scrollTop: 0,
				isEnd:false, //isEnd用于判断是否还有数据，没有数组停止数组请求
				classId: 1,
				page: 1,
				clickId:''
				
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res)=> {
					let height=res.windowHeight-uni.upx2px(100)
					this.swiperheight=height;
				}
			});
			this.showlist(this.classId)
		},
		onShow() {
			let that = this
			uni.getSystemInfo({
				success: (res)=> {
					let height=res.windowHeight-uni.upx2px(100)
					this.swiperheight=height;
				}
			});
			uni.$on('shaxing',(data) => {
				if(this.clickId === ''){
					this.request({
					 url:'/v1/deals',
					 data:{
						  page:1,
						  limit:10,
						  'filter[e.basic_type]': this.classId,
						  'filter[status]':'1'
						  }
					 }).then((list)=>{
						 if(this.clickId === '1'){ this.oldShop =list.data.data}
						 else if (this.clickId === '2'){this.newNeed = list.data.data}
					 })
				}
					this.showlist(this.classId)
			    })
		},
		methods: {
			addtop(){
				let userInfo = uni.getStorageSync('myinfo');
				if(!userInfo) {
					if(uni.getSystemInfoSync().platform == 'ios'){
						 uni.showModal({
							title: '提示',
							content:'请先登录',
							confirmText:'去登录',
							cancelColor:"#262626",
							success: function(res){
								if (res.confirm) {
									uni.navigateTo({
										url:'../login/index'
									})
								} else if (res.cancel) {
									
								}
							}
						 })
					}else{
						uni.showModal({
							title: '提示',
							content:'请先登录',
							cancelText:'去登录',
							confirmText:'取消',
							confirmColor:"#262626",
							success: function(res){
								if (res.confirm) {
									
								} else if (res.cancel) {
									uni.navigateTo({
										url:'../login/index'
									})
								}
							}
						})
					}
				 
				}else{
					uni.navigateTo({
						url:'../demand/demand'
					})
				}
			},
			tabtap(index,id){
				this.tabIndex = index;
			},
			currentindex(e){
				this.tabIndex=e.detail.current;
				this.classId = this.tabBars[this.tabIndex].id
				if(this.oldShop.length===0 || this.newNeed.length===0){
					this.page = 1
					this.isEnd=false;
					this.showlist(this.classId)
				}
			},
			lower(id){
				this.status = 'more'; //设置sataus是更多
				if(this.isEnd===true){
					return
				}
				this.showlist(this.classId)
			},
			//滚动时触发事件
			scroll: function(e) {
				this.scrollTop = e.detail.scrollTop;
			},
			//切换scroll-view事件
			changeScrollView(){
				this.scrollTop=0;//回到最顶部
			},
			showlist(id){
				if(this.isEnd){
					return
				}
					this.request({
						  url:'/v1/deals',
						  data:{
							  page:this.page,
							  limit:10,
							  'filter[e.basic_type]':id,
							  'filter[status]':'1'
						  }
					  }).then((res)=>{
							  if(this.tabIndex===0){
							  	let newArrData=res.data.data;
							  	this.oldShop=this.oldShop.concat(newArrData);
							  	if(res.data.data.length<=0){
							  		 this.isEnd=false;
							  		 this.status="noMore";
							  	 }else if(res.data.data.length <= 10){
							  		 this.oldShop=res.data.data;
									 this.isEnd=false;
									 this.status="noMore";
							  	 }else{
									 this.page++
								 }
							  }else if(this.tabIndex===1){
							  	let newArrData=res.data.data;
							  	this.newNeed=this.newNeed.concat(newArrData);
							  	if(res.data.data.length<=0){
							  		 this.isEnd=false;
							  		 this.status="noMore";
							  	 }else if(res.data.data.length <= 10){
									 this.newNeed=res.data.data;
									 this.isEnd=false;
									 this.status="noMore";
								 }
								 else{
							  		 this.page++
							  	 }
							  }
						  })
				  }
		}
	}
</script>

<style scoped lang="scss">
	.uni-tab-bar {
		// margin-top: 112rpx;
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
		.swiper-box {
		flex: 1;
		width: 100%;
		height: calc(100% - 100upx);
		}
		.list {
			width: 750rpx;
			height: 100%;
		}
	}
	.stateBar {
			height: var(--status-bar-height);
			width:750rpx;
			z-index:99;
	}
	.uni-tab-bar1 {
		display: flex;
		padding: 20rpx 34rpx;
		background-color: #FFFFFF;
		// padding-bottom: 10rpx;
		// padding-top: 20rpx;
		.tabs{
			flex: 1;
			display: flex;
			justify-content: center;
		}
		.swiper-tab-list {
			font-size: 28rpx;
			color: #999999;
			// text-align: center;
			padding-top: 10rpx;
			margin-right: 44rpx;
		}
		.active {
			color: #333333;
			font-weight: bold;
			font-size: 36rpx;
			padding-top: 0;
			.swiper-tab-line {
				width: 24rpx;
				height: 8rpx;
				background-color: $color2;
				margin: 0 auto;
				margin-top: 14rpx;
				border-radius: 4rpx;
			}
		}
	}
	.addicon {
		width: 48rpx;
		height: 48rpx;
	}
	
	.status-no {
		width: 100%;
		height: var(--status-bar-height);
		margin-bottom: 80rpx;
	}
	.genduo{
		margin-top: 25rpx;
		color: red;
	}
</style>
