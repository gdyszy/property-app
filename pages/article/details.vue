<template>
	<view class="article">
		<view class="edgeInsetTop"></view>
		<!-- 进度条 -->
		<view class="load-progress" :class="loadProgress!=0?'show':'hide'">
			<view class="load-progress-bar bg-orange" :style="[{transform: 'translate3d(-' + (100-loadProgress) + '%, 0px, 0px)'}]"></view>
		</view>
		<view class="margin-bj content">
			<mp-html :content="detailsData" />
		</view>
	</view>
</template>

<script>
	import htmlParser from '@/common/html-parser';
	export default {
		data() {
			return {
				loadProgress: 0, //进度条
				detailsData: ''
			}
		},
		onLoad(option) {
			// 进度条
			this.LoadProgress();
			this.loadData(option.id);
			if (option.title) {
				uni.setNavigationBarTitle({
					title: option.title
				});
			}
		},
		methods: {
			// 异步加载
			async loadData(id) {
				this.request({
					url: '/v1/disclaimers/'+id,
					method: 'get'
				}).then((res)=>{
					this.detailsData = res.data.content;
					this.loadProgress = 90;
				});
			},
			// 进度条
			LoadProgress() {
				this.loadProgress = this.loadProgress + 2;
				if (this.loadProgress < 100) {
					setTimeout(() => {
						this.LoadProgress();
					}, 100)
				} else {
					this.loadProgress = 0;
				}
			}
		}
	}
</script>

<style>
	.article .content{
		
	}
	.margin-bj{
		margin: 25rpx;
	}
</style>
