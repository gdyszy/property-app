<template>
	<view class="uni-tab-bar">
		<swiper class="swiper-box" 
		:style="{height:swiperheight+'px'}" 
		:current="tabIndex"
		@change="tabChange">
			<swiper-item v-for="items in list1" :key="items.id"> 
				<scroll-view scroll-y class="list">
					<template v-if="items.list2.length>0">
						<ListItem :list='items.list2' />
					</template>
					<template v-else>
						<view>没有数据{{ height }}</view>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>   
	</view>
</template>

<script>
	import ListItem from '../index/list_item.vue'
	export default {
		components:{
			ListItem
		},
		props:{
			list1:{
				type: Array
			},
			height:{
				type: Number,
				default: 1212
			}
		},
		data() {
			return {
				swiperheight: 500,
				tabIndex: 0
			}
		},
		onLoad() {
			uni.getSystemInfo({
				success: (res)=> {
					let height=res.screenHeight
					this.swiperheight=height;
				}
			});
		},
		methods:{
			// 左右滑动事件
			tabChange(e){
				this.tabIndex=e.detail.current;
			}
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
</style>
