<template>
	<view class="member-audit">
		<tabs :tabs="tabsList" @send="handleTap">
			<view class="member-list">
				<view v-if="dataList.length==0">
					<view class="nothingImg">
						<image src="../../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
					</view>
					<view class="nothing">没有数据</view>
				</view>
				<view v-else class="member-bill" v-for="(item,index) in dataList" :key="index" @click="goTo(item.id,item.community.name)">
					<image :src="item.photo?item.photo:'../../../static/images/index/logo.png'" class="icon"></image>
					<view class="bill-detail">
						<view class="bill-num">
							投诉类型：{{item.type}}
						</view>
						<view class="appointment-time">
							联系方式：{{item.tel}}
						</view>
					</view>
				</view>

			</view>
		</tabs>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabsList: [{
						id: 0,
						value: '待回复',
						isActive: true
					},
					{
						id: 1,
						value: '已回复',
						isActive: false
					}
				],
				dataList: [],
				totalPage: 1,
				page: 1,
				limit: 20,
				status: 0,

			}
		},
		methods: {
			//切换选中项
			handleTap(res) {
				const index = res.index
				this.status = index
				this.dataList = []
				this.page = 1
				this.getList(this.status)
				this.tabsList.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
			},

			//跳转详情页
			goTo(id,name) {
				uni.navigateTo({
					url: './complainMsg/complainMsg?id=' + id +'&communityName='+encodeURIComponent(name)
				})
			},
			// 获取投诉列表
			getList(status) {
				this.request({
					url: '/mobile/complain',
					method: 'GET',
					data: {
						"filter[status]": status,
						'filter[community_code]': uni.getStorageSync('community_code'),
						page: this.page,
						limit: this.limit
					}
				}).then((res) => {
					this.dataList = [...this.dataList,...res.data.data];
					const total = res.data.total;
					// 计算总页数
					this.totalPage = Math.ceil(total / this.limit)
				});

			},


		},
		/* onShow() {
			this.getList(this.status)
		}, */
		onLoad() {
			this.getList(this.status)
		},
		onReachBottom() {
			if (this.page >= this.totalPage) {
				uni.showToast({
					title: '数据到底了',
					icon: 'none'
				})

			} else {
				uni.showLoading({
					title: '加载中'
				})
				setTimeout(function() {
					uni.hideLoading()
				}, 200)
				this.getList(this.status)
				this.page++;
			}
		},
		onPullDownRefresh() {
			this.page = 1,
			this.dataList = []
				this.getList(this.status)
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>
<style lang="scss">
	.member-audit {
		width: 100%;

		.member-list {
			border-top: 3rpx solid #e6e6e6;
			margin-top: 20rpx;

			.member-bill {
				padding: 40rpx 50rpx;
				// border-top: 3rpx solid #e6e6e6;
				border-bottom: 3rpx solid #e6e6e6;
				display: flex;

				.icon {
					width: 120rpx;
					height: 120rpx;
					border-radius: 60rpx;
					overflow: hidden;

				}

				.bill-detail {
					flex: 1;
					margin: 0 20rpx;

					.bill-num {
						margin: 15rpx 0;
						font-size: 34rpx;
					}

					.appointment-time {
						font-size: 26rpx;
						color: #959595;
					}
				}

				.information {
					margin-left: 20rpx;
					justify-content: center;
					align-items: center;
					height: 120rpx;
					line-height: 120rpx;
					font-size: 30rpx;
					color: #6bc8a1;
				}
			}
		}
	}.nothing{
		color: #B3B3B3;
		width: 100%;
		height: 30rpx;
		text-align: center;
		padding: 20rpx 0;
	}
</style>
