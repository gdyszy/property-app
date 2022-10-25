<template>
	<view>
		<view class="mer_list" v-for="(item, index) in berList" :key='item.id'>
			<image src="../../static/images/familyBer/ico_02_03.png" mode="scaleToFill" style="width: 78rpx; height: 78rpx; margin-right: 32rpx;" />
			<view class="mer_content">
				<view class="ber_text">
					<view class="ber_name">{{ item.name }}</view>
					<view class="ber_num">成员编号: {{ item.id }}</view>
				</view>
				<view class="ber_check" @tap='check(item.id)'>
					<view>查看信息</view>
					<image src="../../static/images/pay/btn_01.png" mode="scaleToFill" style="width: 24rpx; height: 24rpx; margin-left: 6rpx;" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			berList: {
				type: Array
			}
		},
		methods:{
			check(id) {
				this.$emit('check', id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mer_list {
		display: flex;
		width: 690rpx;
		height: 164rpx;
		margin: 0 auto;
		align-items: center;
		border-bottom: 1px solid #e6e6e6;
		.mer_content {
			width: 580rpx;
			display: flex;
			justify-content: space-between;
			.ber_text{
				.ber_name {
					font-size: 34rpx;
					color: #262626;
				}
				.ber_num {
					font-size: 24rpx;
					color: #808080;
					margin-top: 11rpx;
				}
			}
			.ber_check {
				display: flex;
				font-size: 26rpx;
				color: #60C49A;
				align-items: center;
			}
		}
	}
</style>
