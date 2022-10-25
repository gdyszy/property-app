<template>
	<view class="news_list">
		<view class="list_box" v-for="(item, index) in list" :key="index" @tap="noticeDetail(item.id, item.views)" v-if="item.status == 1">
			<image style="width: 200rpx; height: 140rpx; border-radius: 6rpx;" :src="item.photo" mode="scaleToFill" lazy-load v-if="item.photo != ''" />
			<image style="width: 200rpx; height: 140rpx; border-radius: 6rpx; z-index: 999;" src="../../static/common/noImg.png" v-if="item.photo == ''" mode="scaleToFill" lazy-load></image>
			<view class="box_detail">
				<view class="title">{{ item.title }}</view>
				<view class="detail">
					<image src="../../static/images/index/btn_07_time.png" style="width: 36rpx; height: 36rpx;margin-left: -10rpx;" mode="scaleToFill" />
					<view class="detail_text">{{ item.create_time | timeStamp }}</view>
					<image src="../../static/images/index/btn_06_view.png" style="width: 36rpx; height: 36rpx; margin-left: 34rpx; margin-right: 5rpx;" mode="scaleToFill" />
					<view class="detail_text">{{ item.views }}</view>
				</view>
				<view v-if="item.source" class="detail_source">来源:  {{ item.source }}</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import { timeStamp } from '../../utils/time.js'
	export default {
		props: {
			list: {
				type: Array,
				default: []
			}
		},
		filters:{
			timeStamp
		},
		methods:{
			noticeDetail(id, allViews){
				this.$emit('noticeDetail', id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.news_list {
		width: 95%;
		margin: 0 auto;
		margin-top: 34rpx;
	}
	.list_box {
		display: flex;
		border-bottom: 1px solid #e6e6e6;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		.box_detail {
			margin-left: 36rpx;
			.title {
				width: 472rpx;
				height: 80rpx;
				font-size: 30rpx;
				color: #323232;
				line-height: 40rpx;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient:vertical;
				overflow: hidden;
				word-break:break-all;
			}
			.detail {
				display: flex;
				margin-top: 30rpx;
				align-items: center;
				.detail_text {
					font-size: 24rpx;
					color: #b3b3b3;
				}
			}
			.detail_source{
				margin-top: 15rpx;
				font-size: 22rpx;
				color: #b3b3b3;
			}
		}
	}
	.list_box:last-child {
		border-bottom: none;
	}
</style>
