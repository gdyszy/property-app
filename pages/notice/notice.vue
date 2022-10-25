<template>
	<view>
		<SwiperTabHead :tabBars='tabBars' :tabIndex='tabIndex' @tabtap="tabtap" />
		<view class="uni-tab-bar">
			<swiper class="swiper-box" 
			:style="{height:swiperheight+'px'}" 
			:current="tabIndex"
			@change="tabChange"
			duration="200">
				<swiper-item> 
					<scroll-view scroll-y class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<template v-if="list1.length>0">
							<ListItem :list='list1' @noticeDetail='noticeDetail'  />
							<uni-load-more :status="status" :content-text="contentText" />
						</template>
						<template v-else>
							<view class="nothingImg">
								<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
							</view>
							<view class="nothing">没有数据</view>
						</template>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<template v-if="list2.length>0">
							<ListItem :list='list2' @noticeDetail='noticeDetail' />
							<uni-load-more :status="status" :content-text="contentText" />
						</template>
						<template v-else>
							<view class="nothingImg">
								<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
							</view>
							<view class="nothing">没有数据</view>
						</template>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<template v-if="list3.length>0">
							<ListItem :list='list3' @noticeDetail='noticeDetail' />
							<uni-load-more :status="status" :content-text="contentText" />
						</template>
						<template v-else>
							<view class="nothingImg">
								<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
							</view>
							<view class="nothing">没有数据</view>
						</template>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<template v-if="list4.length>0">
							<ListItem :list='list4' @noticeDetail='noticeDetail' />
							<uni-load-more color="#b3b3b3" :status="status" :content-text="contentText" />
						</template>
						<template v-else>
							<view class="nothingImg">
								<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
							</view>
							<view class="nothing">没有数据</view>
						</template>
					</scroll-view>
				</swiper-item>
			</swiper>   
		</view>
	</view>
</template>

<script>
	import SwiperTabHead from '../../components/common/swiper_tab_head.vue'
	import ListItem from '../../components/index/list_item.vue'
	import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue'
	
	export default {
		components:{
			SwiperTabHead,
			ListItem,
			uniLoadMore
		},
		data() {
			return {
				swiperheight:500,
				tabBars:[],
				tabIndex: 0,
				classId: 0,
				list1: [],
				list2: [],
				list3: [],
				list4: [],
				page: 1,
				scrollTop: 0,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '',
					contentnomore: '没有更多'
				},
				isEnd:false, //isEnd用于判断是否还有数据，没有数组停止数组请求
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res)=> {
					let height=res.windowHeight-uni.upx2px(100)
					this.swiperheight=height;
				}
			});
			this.getTabBars()
		},
		methods: {
			// tabbar点击事件
			tabtap(index,id){
				this.tabIndex=index;
				this.classId = id;
				this.getList(this.classId)
			},
			// 左右滑动事件
			tabChange(e){
				this.tabIndex=e.detail.current;
				this.classId = this.tabBars[this.tabIndex].id
				// if(this.tabBars[this.tabIndex].ed != true){
				// 	this.page = 1
				// 	this.isEnd=false;
				// 	this.getList(this.classId)
				// }
				if(this.list1.length == 0 && this.tabIndex ==0){
					this.page = 1
					this.isEnd = false
					this.getList(this.classId)
				} else if(this.list2.length == 0 && this.tabIndex ==1){
					this.page = 1
					this.isEnd = false
					this.getList(this.classId)
				} else if(this.list3.length == 0 && this.tabIndex ==2){
					this.page = 1
					this.isEnd = false
					this.getList(this.classId)
				} else if(this.list4.length == 0 && this.tabIndex ==3){
					this.page = 1
					this.isEnd = false
					this.getList(this.classId)
				}
				
			},
			//点击进入详细
			noticeDetail(id){
				uni.navigateTo({
					url:'../noticeDetail/noticeDetail?id='+id
				})
			},
			//获取分类 
			getTabBars(){
				this.request({
					url: '/v1/notices_classify',
					method: 'GET'
				}).then((res)=>{
					this.tabBars = res.data
					this.classId = this.tabBars[0].id
					for (let t of this.tabBars) {
						t['ed']=true
					}
					this.getList(this.classId)
				});
			},
			//获取列表
			getList(id){
				if(this.isEnd){
					     return
				}
				 this.request({
					 url: '/v1/notices',
					 method: 'GET',
					 data: {
					 	"filter[classify_id]": id,
					 	page: this.page,
					 	limit: 10
					 }
				 }).then((res) =>{
					 if(id == this.tabBars[this.tabIndex].id){
						 this.tabBars[this.tabIndex].ed = true
					 }
						
							if(this.tabIndex===0){
								let newArrData=res.data.data;
								this.list1=this.list1.concat(newArrData);
								if(res.data.data.length<=0){
									 this.isEnd=true;
									 this.status="noMore";
								 }else{
									 this.page++
								 }
							}else if(this.tabIndex===1){
								let newArrData=res.data.data;
								this.list2=this.list2.concat(newArrData);
								if(res.data.data.length<=0){
									 this.isEnd=true;
									 this.status="noMore";
								 }else{
									 this.page++
								 }
							}else if(this.tabIndex===2){
								let newArrData=res.data.data;
								this.list3=this.list3.concat(newArrData);
								if(res.data.data.length<=0){
									 this.isEnd=true;
									 this.status="noMore";
								 }else{
									 this.page++
								 }
							}else if(this.tabIndex===3){
								let newArrData=res.data.data;
								this.list4=this.list4.concat(newArrData);
								if(res.data.data.length<=0){
									 this.isEnd=true;
									 this.status="noMore";
								 }else{
									 this.page++
								 }
							}
				 })
			},
			lower(id){
				// this.status = 'more'; //设置sataus是更多
				if(this.isEnd===true){
					return
				}
				this.getList(this.classId)
			},
			//滚动时触发事件
			scroll: function(e) {
				this.scrollTop = e.detail.scrollTop;
			},
			//切换scroll-view事件
			changeScrollView(){
				this.scrollTop=0;//回到最顶部
			},
		}
	}
</script>

<style lang="scss" scoped>
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
			width: 750upx;
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
