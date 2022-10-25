<template>
	<!-- <view>123</view> -->
	<view class="tabs">
		<view class="tabs_title">
			<view v-for="(item,index) in tabs" :key="index" :class="'tabs_item' + (item.isActive?' active':'')"
				@tap="change" :data-index="index">
				{{item.value}}
			</view>
		</view>
		<view class="tabs_content">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["tabs"],
		data() {
			return {}
		},
		methods: {
			change(e) {
				const index = e.currentTarget.dataset;
				this.$emit('send', index)
			}
		}
	}
</script>

<style lang="scss">
	.tabs {
		.tabs_title {
			display: flex;

			.tabs_item {
				display: flex;
				justify-content: center;
				align-items: center;
				flex: 1;
				padding: 20rpx 0;
			}
		}

		.tabs_content {}
	}

	.active {
		color: #0faeff;
		// border-bottom: 5rpx solid #0faeff;
		position: relative;
		&::after {
			position: absolute;
			content: "";
			left: 50%;
			margin-left:-25rpx;
			bottom: 0;
			width: 50rpx;
			height: 0rpx;
			border-bottom: 5rpx solid #0faeff;
			
		}
	}
</style>
