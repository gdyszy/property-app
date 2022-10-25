<template>
	<view>
		<swiper-tab-head :tabBars='tabBars' :tabIndex='tabIndex' @tabtap='tabtap' />

		<view class="uni-tab-bar">
			<swiper class="swiper-box" :current='tabIndex' @change='currentindex' :style="{height:swiperheight+'px'}"
				duration="200">
				<swiper-item>
					<template v-if="oldShop.length != 0">
						<scroll-view scroll-y="true" class="list" @scrolltolower='lower' :scroll-top="scrollTop">
							<GarageSale :listData='oldShop' :typeID='1' @showlist="reshowlist(1)"></GarageSale>
							<uni-load-more color="#b3b3b3" :status="status" :content-text="contentText" />
						</scroll-view>
					</template>
					<template v-else>
						<view class="nothingImg">
							<image src="../../static/common/nothing.png" mode="aspectFill"
								style="width: 100%; height: 100%;"></image>
						</view>
						<view class="nothing">没有数据</view>
					</template>
				</swiper-item>
				<swiper-item>
					<template v-if="newNeed.length != 0">
						<scroll-view scroll-y="true" class="list" @scrolltolower='lower' :scroll-top="scrollTop">
							<GarageSale :listData='newNeed' :typeID='2' @showlist="reshowlist(2)"></GarageSale>
							<uni-load-more color="#b3b3b3" :status="status" :content-text="contentText" />
						</scroll-view>
					</template>
					<template v-else>
						<view class="nothingImg">
							<image src="../../static/common/nothing.png" mode="aspectFill"
								style="width: 100%; height: 100%;"></image>
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
	import GarageSale from "./GarageSale.vue"
	import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue'
	export default {
		components: {
			SwiperTabHead,
			GarageSale
		},
		data() {
			return {
				tabBars: [{
						'name': '旧货出售',
						'id': 1
					},
					{
						'name': '求购需求',
						'id': 2
					}
				],
				tabIndex: 0,
				swiperheight: 500,
				oldShop: [],
				newNeed: [],
				status: '',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '',
					contentnomore: '没有更多'
				},
				scrollTop: 0,
				isEnd: false, //isEnd用于判断是否还有数据，没有数组停止数组请求
				classId: 1,
				page: 1

			}
		},
		onLoad() {
			let _this = this;
			uni.getSystemInfo({
				success: (res) => {
					let height = res.windowHeight - uni.upx2px(100)
					_this.swiperheight = height;
				}
			});
			_this.showlist(_this.classId)
			 uni.$on('update',function(data){
					if(_this.tabIndex==0){
						_this.oldShop[data.dindex] = data
					}else{
						_this.newNeed[data.dindex] = data
					}
					_this.$forceUpdate()
			    })
				
		},
		methods: {
			//添加列表
			setlist() {
				uni.navigateTo({
					url: '../demand/demand',
				})
			},
			tabtap(index) {
				this.tabIndex = index;
				this.showlist(this.classId)
			},
			currentindex(e) {
				this.tabIndex = e.detail.current;
				this.classId = this.tabBars[this.tabIndex].id
				if (this.oldShop.length == 0 && this.tabIndex == 0) {
					this.page = 1
					this.isEnd = false;
					this.showlist(this.classId)
				} else if (this.newNeed.length == 0 && this.tabIndex == 1) {
					this.page = 1
					this.isEnd = false;
					this.showlist(this.classId)
				}
			},
			lower(id) {
				this.status = 'more'; //设置sataus是更多
				if (this.isEnd === true) {
					return
				}
				this.showlist(this.classId)
			},
			//滚动时触发事件
			scroll: function(e) {
				this.scrollTop = e.detail.scrollTop;
			},
			//切换scroll-view事件
			changeScrollView() {
				this.scrollTop = 0; //回到最顶部
			},
			showlist(id) {
				let userData = uni.getStorageSync('myinfo')
				let user_id = userData.client.user_id
				if (this.isEnd) {
					return
				}
				this.request({
					url: '/v1/deals',
					data: {
						page: this.page,
						limit: 10,
						'filter[e.basic_type]': id,
						'filter[e.member_id]': user_id
					}
				}).then((res) => {
					if (this.tabIndex === 0) {
						let newArrData = res.data.data;
						for (let i of newArrData) {
							i['openStatus'] = false
						}
						this.oldShop = this.oldShop.concat(newArrData);
						// this.oldShop=newArrData;
						if (res.data.data.length <= 0) {
							this.isEnd = true;
							this.status = "noMore";
						} else {
							this.page++
						}
					} else if (this.tabIndex === 1) {
						let newArrData = res.data.data;
						for (let i of newArrData) {
							i['openStatus'] = false
						}
						this.newNeed = this.newNeed.concat(newArrData);
						if (res.data.data.length <= 0) {
							this.isEnd = true;
							this.status = "noMore";
						} else {
							this.page++
						}
					}
				})
			},
			reshowlist(a) {
				a == 1 ? this.oldShop = [] : this.newNeed = []
				this.page = 1
				this.showlist(a)
			},refreshData(item){
				// console.log("refreshData  Data:"+JSON.stringify(item))
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

	.nothing {
		color: #B3B3B3;
		width: 100%;
		height: 30rpx;
		text-align: center;
		padding: 20rpx 0;
	}
</style>
