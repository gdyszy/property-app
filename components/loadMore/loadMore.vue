<template>
	<view>
		<view class="nothingImg" v-if="list.length == 0">
			<image src="/static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;">
			</image>
			<view class="nothing">没有数据</view>
		</view>
		<view v-if="list.length!=0">
			<view class="loadMore" v-if="page==totalPage">
				数据加载完毕~
			</view>
			<view class="loadMore" @click="loadMore" v-else>
				点击加载更多
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "loadMore",
		props: {
			list: {
				type: Array,
				default: []
			},
			page: {
				type: Number,
				default: 0
			},
			totalPage: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {

			};
		},
		methods: {
			loadMore() {
				this.$emit('load')
			}
		}
	}
</script>

<style lang="scss">
	.loadMore {
		margin-top: 30rpx;
		display: flex;
		justify-content: center;
		height: 70rpx;
		font-size: 28rpx;
		color: #888888;
	}
	.nothing {
		color: #b3b3b3;
		width: 100%;
		height: 30rpx;
		text-align: center;
		padding: 20rpx 0;
	}
</style>
