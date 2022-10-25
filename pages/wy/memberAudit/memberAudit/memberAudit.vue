<template>
	<view class="member-audit">
		<tabs :tabs="tabsList" @send="handleTap">
			<!-- 未审核 -->
			<view class="member-list">
				<view class="member-bill" v-for="(item,index) in dataList" :key="index" @click="goTo(item.id)">
					<image :src="item.photo?item.photo:'../../static/img/logo.png'" class="icon"></image>
					<view class="bill-detail">
						<view class="bill-num">
							{{item.username}}
						</view>
						<view class="appointment-time">
							注册时间：{{item.create_time | timeStamp}}
						</view>
					</view>
				</view>

			</view>
		</tabs>
	</view>
</template>

<script>
	import tabs from '../../../../components/tabs/tabs.vue';
	import {
		timeStamp
	} from '../../../../utils/time.js'
	export default {
		components: {
			tabs
		},
		data() {
			return {
				tabsList: [{
						id: 0,
						value: '未审核',
						isActive: true
					},
					{
						id: 1,
						value: '审核通过',
						isActive: false
					},
					{
						id: 2,
						value: '未通过',
						isActive: false
					}

				],
				dataList: [],
				totalPage: 1,
				page: 1,
				limit: 20,
				is_audit: 0,

			}
		},
		filters: {
			timeStamp
		},
		methods: {
			//切换选中项
			handleTap(res) {
				const index = res.index
				this.is_audit = index
				this.page = 1
				this.dataList = []
				this.getAuditList(this.is_audit)
				this.tabsList.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
			},

			//跳转详情页
			goTo(id) {
				uni.navigateTo({
					url: '../auditMessage/auditMessage?id=' + id
				})
			},
			// 获取审核列表
			getAuditList(audit) {
				this.request({
					url: '/mobile/audit',
					method: 'GET',
					data: {
						"filter[is_audit]": audit,
						page: this.page,
						limit: this.limit
					}
				}).then((res) => {
					this.dataList = [...this.dataList, ...res.data.data];
					const total = res.data.total;
					// 计算总页数
					this.totalPage = Math.ceil(total / this.limit)
				});

			},


		},
		onLoad() {
			this.getAuditList(this.is_audit)
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
				this.getAuditList(this.is_audit)
				this.page++;
			}
		},
		onPullDownRefresh() {
			this.page = 1
			this.dataList = []
			this.getAuditList(this.is_audit)
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
	}
</style>
