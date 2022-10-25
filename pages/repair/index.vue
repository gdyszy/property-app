<template>
	<view>
		<swiper-tab-head :tabBars='tabBars' :tabIndex='tabIndex' @tabtap='tabtap' />
		
		<view class="uni-tab-bar">
			<swiper class="swiper-box" :current='tabIndex' @change='currentindex' :style="{height:swiperheight+'px'}" duration="200" >
				<swiper-item> 
				<template v-if="oldShop.length != 0">
					<scroll-view scroll-y="true" class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<baoxui :allList='oldShop' :TypeStatus = "0"></baoxui>
						<uni-load-more :status="status" :content-text="contentText" />
					</scroll-view>
				</template>
				<template v-else>
					<view class="nothingImg">
						<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
					</view>
					<view class="nothing">没有数据</view>
				</template>
				</swiper-item>
				<swiper-item>
					<template v-if="newNeed.length != 0">
						<scroll-view scroll-y="true" class="list" @scrolltolower='lower' :scroll-top="scrollTop">
							<baoxui :allList='newNeed' :TypeStatus = "1"></baoxui>
							<uni-load-more :status="status" :content-text="contentText" />
						</scroll-view>
					</template>
					<template v-else>
						<view class="nothingImg">
							<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
						</view>
						<view class="nothing">没有数据</view>
					</template>
				</swiper-item>
				<swiper-item>
					<template v-if="wancheng.length != 0">
						<scroll-view scroll-y="true" class="list" @scrolltolower='lower' :scroll-top="scrollTop">
							<baoxui :allList='wancheng' :TypeStatus = "2"></baoxui>
							<uni-load-more color="#b3b3b3" :status="status" :content-text="contentText" />
						</scroll-view>
					</template>
					<template v-else>
						<view class="nothingImg">
							<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
						</view>
						<view class="nothing">没有数据</view>
					</template>
				</swiper-item>
			</swiper>
		</view>
		
	</view>
</template>

<script>
	import SwiperTabHead from "../../components/common/swiper_tab_head.vue"
	import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue'
	import baoxui from './baoxou.vue'
	export default {
		components:{
			SwiperTabHead,
			baoxui
		},
		data() {
			return {
				tabBars: [
					{'name': '待处理','id':0},
					{'name': '处理中','id':1},
					{'name': '已完成','id':2}
				],
				tabIndex: 0,
				swiperheight:500,
				oldShop: [],
				newNeed: [],
				wancheng:[],
				status: 'noMore',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '',
					contentnomore: '没有更多'
				},
				scrollTop: 0,
				isEnd:false, //isEnd用于判断是否还有数据，没有数组停止数组请求
				classId: 0
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
			let that = this
			uni.$on('chexiao',function(){
				 that.showlist(this.classId)
			    })
		},
		methods: {
			tabtap(index){
				this.tabIndex = index;
				this.showlist(this.classId)
			},
			currentindex(e){
				this.tabIndex=e.detail.current;
				this.classId = this.tabBars[this.tabIndex].id
				if(this.oldShop.length===0 || this.newNeed.length===0 || this.wancheng.length===0){
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
						  url:'/v1/repairs',
						  data:{
							  'filter[status]': id
						  }
					  }).then((res)=>{
						  // console.log(res)
							  if(this.tabIndex===0){
							  	let newArrData=res.data;
								this.oldShop = newArrData
							  }else if(this.tabIndex===1){
							  	let newArrData=res.data;
								this.newNeed = newArrData
							  }else if(this.tabIndex===2){
							  	let newArrData=res.data;
								this.wancheng = newArrData
							  }
							 if(res.data.length<=0){
							 	 this.isEnd=true;
							 	 this.status="noMore";
							  }
						  })
				  }
		}
	}
</script>

<style scoped lang="scss">
	
	.uni-tab-bar {
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
	.nothing{
		color: #B3B3B3;
		width: 100%;
		height: 30rpx;
		text-align: center;
		padding: 20rpx 0;
	}
</style>
