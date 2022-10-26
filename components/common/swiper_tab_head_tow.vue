<template>
	<view class="head">
		<view class="uni-tab-bar">
			<scroll-view scroll-x="true" style="white-space: nowrap;">
				<view v-for="(tab,index) in tabBars" :key="tab.id" class="finalview" style="display: inline-block;margin-left: 40rpx;">
					<view class="swiper-tab-list" 
					:class="{'active':tabIndex==index}"
					@tap="tabtap(index,tab.id)"
					>
						{{tab.name}}
						<view class="swiper-tab-line"></view>
					</view>
				</view>
				<view class="bottom_line"></view>
			</scroll-view>
		</view>
		
		<!-- <view class="uni-tab-bar">
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
		<view class="bottom_line"></view> -->
		
	</view>
</template>

<script>
	export default {
		props: {
			tabBars: {
				type: Array
			},
			tabIndex: {
				type: Number
			}
		},
		methods: {
			tabtap(index,id) {
				this.$emit('tabtap', index, id)
			}
		}
		
	}
</script>

<style lang="scss" scoped>
	.head{
		background-color: #FFFFFF;
	}
	.finalview :last-child{	
		margin-right: 40rpx;
	}
	.uni-tab-bar {
		// margin: 0 34rpx;
		padding-top: 14rpx;
		.swiper-tab-list {
			font-size: 32rpx;
			color: #999999;
			text-align: center;
		}
		.active {
			color: #16bcc7;
			font-weight: bold;
			.swiper-tab-line {
				width: 40rpx;
				height: 6rpx;
				background-color: #16bcc7;
				margin: 0 auto;
				margin-top: 14rpx;
				border-radius: 3rpx;
			}
		}
	}
	.bottom_line {
		border-bottom: 1px solid #e6e6e6;
		margin-top: 18rpx;
	}
	// .head {
	// 	position: -webkit-sticky;
	// 	position: sticky;
	// 	top: var(--window-top);
	// 	z-index: 99;	  
	// 	background-color: #FFFFFF;
	// }
</style>
