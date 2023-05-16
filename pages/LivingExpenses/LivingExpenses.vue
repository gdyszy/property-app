<template>
	<view>
		<swiper-tab-head :tabBars='tabBars' :tabIndex='tabIndex' @tabtap='tabtap' />
		<view class="uni-tab-bar">
			<swiper class="swiper-box" 
			:style="{height:swiperheight+'px'}" 
			:current="tabIndex"
			@change="tabChange"
			duration="200">
				<swiper-item> 
					<scroll-view scroll-y class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<view v-if="propertyList.length != 0">
							<LivingPay :list= 'propertyList' @pay='pay' />
						</view>
						<view v-else>
							<view class="nothingImg">
								<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
							</view>
							<view class="nothing">没有数据</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<view v-if="parksCarList.length != 0">
							<LivingPay :list= 'parksCarList' @pay2='pay2' />
						</view>
						<view v-else>
							<view class="nothingImg">
								<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
							</view>
							<view class="nothing">没有数据</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="list" @scrolltolower='lower' :scroll-top="scrollTop">
						<view v-if="watersList.length != 0">
							<LivingPay :list= 'watersList' @pay3='pay3' />
						</view>
						<view v-else>
							<view class="nothingImg">
								<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
							</view>
							<view class="nothing">没有数据</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>   
		</view>
	</view>
</template>

<script>
	import SwiperTabHead from '../../components/common/swiper_tab_head.vue'
	import LivingPay from '../../components/index/livingPay_item.vue'
	export default {
		components:{
			SwiperTabHead,
			LivingPay
		},
		data() {
			return {
				tabBars: [
					{'name': '物业费','id':0},
					{'name': '停车费','id':1},
					{'name': '水费','id':2}
				],
				tabIndex: 0,
				swiperheight: 500,
				propertyList: [],//物业费列表
				parksCarList: [],//停车费列表
				watersList: [],//水费列表
				isLoadMore: false ,//是否加载中
				page: 1,
				scrollTop: 0
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res)=> {
					let height=res.windowHeight-uni.upx2px(100)
					this.swiperheight=height;
				}
			});
			this.expense();
			this.parksCar();
			this.getWaters();
			 // #ifdef APP-PLUS
			uni.loadFontFace({
				 family: 'DINPro-Medium',
				// 本地字体路径需转换为平台绝对路径
				source: `url(${plus.io.convertLocalFileSystemURL('_www/static/DINPro-Medium.ttf')})`,
				success() {
				},
				fail(e) {
				}
			})
			 // #endif
		},
		onPullDownRefresh() {
			this.expense();
			this.parksCar();
			this.getWaters();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			tabtap(index){
				this.tabIndex = index;
			},
			// 左右滑动事件
			tabChange(e){
				this.tabIndex=e.detail.current;
			},
			pay(id) {
				uni.navigateTo({
					url:'../pay_detail/propertyPay?id='+id
				})
			},
			pay2(id){
				uni.navigateTo({
					url:'../pay_detail/carparker?id='+id
				})
			},
			pay3(id){
				uni.navigateTo({
					url:'../pay_detail/watersPay?id='+id
				})
			},
			//物业费
			expense(){
					this.request({
						url: '/v1/expense',
						method: 'GET',
						data: {
							page: this.page,
							limit: 10
						}
					}).then((res)=>{
						if(res.code === 200 && res.data){
							this.propertyList=this.propertyList.concat(res.data)
							if(res.data.length<this.propertyList.length){
								this.isLoadMore=true
							}else{
								this.isLoadMore=false
							}
						}else{
							   this.isLoadMore=false
						}
					});
			},
			//停车费
			parksCar(){
				this.request({
					url: '/v1/parks',
					method:'GET'
				}).then((res)=>{
					this.parksCarList = res.data
					for( var i=0;i<this.parksCarList.length;i++){
						this.parksCarList[i].isPacks = 1
					}
				})
			},
			//水费
			getWaters(){
				this.request({
					url: '/v1/waters',
					method:'GET'
				}).then((res)=>{
					this.watersList = res.data
					for( var i=0;i<this.watersList.length;i++){
						this.watersList[i].isWaters = 1
					}
				})
			},
			lower(){
				setTimeout(() => {
					if(!this.isLoadMore){  //此处判断，上锁，防止重复请求
						this.isLoadMore=true
						this.page+=1
						this.expense()
						}
				}, 1000);
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