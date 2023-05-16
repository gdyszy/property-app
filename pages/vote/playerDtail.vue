<template>
	<view class="activityDtail">
		<view class="title">
			<view class="left">
				选手详情
			</view>
			<view class="right">
				<image src="/static/images/index/btn_06_view.png" class="view-img"></image>
				总浏览量：{{playerData.total_view}}
			</view>
		</view>
		<view class="detail">
			<view class="font_image">
				<view>选手编号</view>
				<view class="font_icon">
					{{playerData.sno}}
				</view>
			</view>

			<view class="font_image">
				<view>选手头像</view>
				<view class="font_icon">
					<image class="icon" :src="playerData.image" mode=""></image>
				</view>
			</view>

			<view class="font_image">
				<view>选手姓名</view>
				<view class="font_icon">
					{{playerData.name}}
				</view>
			</view>

			<view class="font_image">
				<view>选手简介</view>
				<view class="font_icon">
					{{playerData.introduce}}
				</view>
			</view>

			<view class="font_image">
				<view>选手票数</view>
				<view class="font_icon">
					{{playerData.vote_num}}
				</view>
			</view>

			<view class="font_image">
				<view>状态</view>
				<view class="font_icon">
					{{playerData.status==0?'隐藏':(playerData.status==1?'正常':'过期')}}
				</view>
			</view>
		</view>
		<button type="primary" class="btnfixed" @click.stop="$antishake(toVote,playerData.id)" v-if="isVote == 'true'">点击投票</button>

	</view>
</template>

<script>
	import {timeSecond} from '@/utils/time.js'
	export default {
		data() {
			return {
				playerData: [],
				pid: '',
				noClick: true ,//防抖必需,
				isVote: ''
			}
		},
		filters: {
			timeSecond
		},
		methods: {
			getDtail(id) {
				this.request({
					url: '/v1/votes/' + id
				}).then(res => {
					this.playerData = res.data
				})
			},
			toVote(id) {
				let header = {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
				let data = {
					handler: "vote"
				}
				this.request({
					url: '/v1/votes/' + id,
					method: 'PUT',
					header: header,
					data: data
				}).then(res => {
					if (res.code == 200) {
						uni.showLoading({
							title: '投票中'
						})
						setTimeout(() => {
							uni.showToast({
								title: res.desc,
								icon: 'none'
							})
							this.getDtail(this.playerData.id)
							// #ifdef H5 || APP-PLUS
							uni.redirectTo({
								url: './item?id=' + this.pid
							})
							// #endif
							// #ifdef MP-WEIXIN
							wx.redirectTo({
								url: './item?id=' + this.pid
							})
							// #endif
						}, 1700)
						
					}

					if (res.code == 400) {
						uni.showToast({
							title: res.desc,
							icon: 'none'
						})
					} else if (res.code == 409) {
						uni.showToast({
							title: res.desc,
							icon: 'none'
						})
					}
				})
			},
		},
		onLoad(e) {
			this.getDtail(e.id)
			this.isVote = e.isVote
			this.pid = e.pid
		},
	}
</script>

<style lang="scss" scoped>
	.activityDtail {
		width: 100%;

		.title {
			margin:0 32rpx;
			padding: 20rpx 0;
			border-bottom: 3rpx solid #e7e8e7;

			.left {
				font-size: 40rpx;
				font-weight: 700;
			}

			.right {
				display: flex;
				align-items: center;
				font-size: 24rpx;
				color: #888888;

				.view-img {
					width: 36rpx;
					height: 36rpx;
				}
			}
		}

		.detail {
			margin: 30rpx 40rpx;
		}

		.font_image {
			border-bottom: 1rpx solid #e7e8e7;
		}

		.voteBtn {
			display: flex;
			justify-content: center;
			padding: 10rpx 20rpx;
			color: #FFFFFF;
			background-color: #70d6ab;
		}
	}
</style>
