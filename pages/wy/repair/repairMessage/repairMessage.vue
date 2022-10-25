<template>
	<view class="repair-message">
		<view class="title">
			报修信息
		</view>
		<view class="detail">
			<!-- 用户信息 -->
			<view class="m10 fs30">
				报修人姓名：{{repairMessage.name}}
			</view>
			<view class="m10 fs30" style="display: flex;">
				报修人手机号码：<view style="color: #007AFF;font-size: 18px;margin-top: -10rpx;"
					@click="makePhone(repairMessage.tel)">{{repairMessage.tel}}</view>
			</view>
			<view class="m10 fs30">
				报修时间：{{repairMessage.subscribe_time}}
			</view>
			<view class="m10 fs30" style="display: flex;" v-if="repairMessage.repair_category">
				报修类型：<view style="font-size: 16px;margin-top: -10rpx;">{{repairMessage.repair_category.name}}</view>
			</view>
			<view class="m10 fs30" style="display: flex;">
				报修描述：<view style="font-size: 18px;margin-top: -10rpx;">{{repairMessage.desc}}</view>
			</view>
			<view class="m10 fs30 image" v-if="repairMessage.photo">
				图片：
				<view class="imageitem" v-for=" (item1,dindex) in repairMessage.photo" :key='dindex'>
					<image :src="item1" @tap='tpreviewImage(repairMessage.photo,dindex)' lazy-load="true"></image>
				</view>
			</view>

			<!-- 信息详情 -->
			<view class="user-info-title">
				用户详情
			</view>
			<view class="m10 fs30">
				所属小区：{{repairMessage.community_code}}
			</view>
			<view class="m10 fs30">
				小区名：{{communityName}}
			</view>
			<view class="m10 fs30">
				所属房产：{{repairMessage.house_code}}
			</view>
			<view class="m10 fs30" style="display: flex;">
				联系方式：<view style="color: #007AFF;font-size: 18px;margin-top: -10rpx;"
					@click="makePhone(repairMessage.tel)">{{repairMessage.tel}}</view>
			</view>
			<view class="m10 fs30 mb20">
				状态：{{repairMessage.status==0?'待受理':(repairMessage.status==1?'已受理':'已维修')}}
			</view>

			<!-- 维修信息 -->
			<view class="user-info-title">
				维修信息
			</view>
			<!-- 待受理、已受理状态 -->
			<view class="untreat" v-if="repairMessage.status!=2">
				<view class="msg">
					<view class="text">维修人姓名</view>
					<input type="text" placeholder-style="color:#b3b3b3" placeholder="请输入维修人姓名"
						v-model="maintainerData.maintainer" />
				</view>
				<view class="msg">
					<view class="text">维修人手机号码</view>
					<input type="text" placeholder-style="color:#b3b3b3" placeholder="请输入联系电话"
						v-model="maintainerData.maintainer_tel" maxlength="11" />
				</view>
				<view class="msg">
					<view class="text">维修处理过程</view>
					<view class="text">{{textNum}}/300</view>
				</view>
				<textarea value="" placeholder-style="color:#b3b3b3" placeholder="请简要描述维修过程" maxlength='300'
					@input='descInput' v-model="maintainerData.deal_process" />
			</view>
			<!-- 已维修状态 -->
			<view class="processed" v-else>
				<view class="m10 fs30">
					维修人姓名：{{repairMessage.maintainer}}
				</view>
				<view class="m10 fs30" style="display: flex;">
					维修人手机号码：<view style="color: #007AFF;font-size: 18px;margin-top: -10rpx;"
						@click="makePhone(repairMessage.maintainer_tel)">{{repairMessage.tel}}</view>
				</view>
				<view class="m10 fs30">
					维修处理过程:{{repairMessage.deal_process}}
				</view>
				<view style="margin-buttom: 200rpx;"></view>
			</view>
			<!-- 操作按钮  -->
			<view v-if="repairMessage.status=== 0 && updateAuth">
				<view style="display: flex;">
					<button type="primary" class="btnw" @click="accepted(repairMessage.id)">已受理</button>
					<button type="primary" class="btnw" @click="fixed(repairMessage.id)">已维修</button>
				</view>
			</view>
			<view v-if="repairMessage.status=== 1 && updateAuth">
				<button type="primary" class="btn" @click="fixed(repairMessage.id)">已维修</button>
			</view>
		</view>

	</view>
</template>

<script>
	import QueryAuth from '@/mixins/QueryAuth.js'
	export default {
		data() {
			return {
				communityName: uni.getStorageSync('community_name'),
				textNum: 0,
				desPalceholder: '请简要描述维修过程',
				transactionDes: '',
				repairMessage: [],
				maintainerData: {
					maintainer: '',
					maintainer_tel: '',
					deal_process: ''
				}
			}
		},
		created() {
			this.queryAuth('repair');
		},
		mixins: [QueryAuth],
		computed: {
			updateAuth() {
				return this.authList.includes("repair_update")
			}
		},
		methods: {
			makePhone(tel) {
				// #ifdef MP||APP-PLUS
				uni.makePhoneCall({
					phoneNumber: tel,
					success() {}
				})
				// #endif
				// #ifdef H5
				uni.showToast({
					title: "当前运行环境不支持拨打电话！",
					icon: 'none'
				})
				// #endif
			},
			descInput(e) {
				this.textNum = e.detail.value.length
			},
			tpreviewImage(Imgurl, index) {
				uni.previewImage({
					urls: Imgurl,
					current: index
				})
			},
			// 获取单个详情
			getRepairDetail(id) {
				this.request({
					url: '/mobile/repair/' + id,
					method: 'GET',
				}).then(res => {
					this.repairMessage = res.data
					this.maintainerData.maintainer = this.repairMessage.maintainer
					this.maintainerData.maintainer_tel = this.repairMessage.maintainer_tel
					this.maintainerData.deal_process = this.repairMessage.deal_process
					if (this.repairMessage.deal_process) {
						this.textNum = this.repairMessage.deal_process.length
					}
				})
			},
			// 已受理按钮
			accepted(id) {
				console.log("this.maintainerData:" + JSON.stringify(this.maintainerData))
				this.maintainerData.status = 1
				this.request({
					url: '/mobile/repair/' + id,
					method: 'PUT',
					data: this.maintainerData
				}).then(res => {
					console.log(res)
					uni.showToast({
						title: '已受理',
						icon: 'none'
					})
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			},

			// 已维修按钮
			fixed(id) {
				this.maintainerData.status = 2;
				this.request({
					url: '/mobile/repair/' + id,
					method: 'PUT',
					data: this.maintainerData
				}).then(res => {
					uni.showToast({
						title: '已维修',
						icon: 'none'
					})
					setTimeout(function() {
						uni.navigateBack({

						})
					}, 1000)
				})
			}

		},
		async onLoad(e) {
			await this.getRepairDetail(e.id)
		},

	}
</script>

<style lang="scss">
	@import '../../../../common/common.css';

	.repair-message {
		.title {
			margin: 32rpx;
			padding: 20rpx 0;
			font-size: 40rpx;
			font-weight: 700;
			border-bottom: 3rpx solid #e7e8e7;
		}

		.detail {
			margin: 32rpx;

			.user-info-title {
				padding: 20rpx 0;
				font-size: 35rpx;
				font-weight: 700;
			}

			.check-btn {
				display: flex;
				padding: 100rpx;
				border-top: 3rpx solid #e7e8e7;
			}

			.untreat {
				.deal-process {

					.process-msg {
						width: 100%;
						border: 3rpx solid #999999;
						border-radius: 10rpx;
					}
				}

				.maintainer {
					.input-msg {
						height: 20rpx;
						width: 100%;
						border: 3rpx solid #999999;
						border-radius: 10rpx;
					}
				}
			}
		}

		.m10 {
			margin: 10rpx 0;
		}

		.fs30 {
			font-size: 30rpx;
			color: #6e7069
		}

		.mb20 {
			margin-bottom: 20rpx;
		}

	}

	.btn {
		color: #fff;
		width: 100%;
		height: 100rpx;
		background-color: #2273f6;
	}

	.btnw {
		color: #fff;
		width: 50%;
		margin: 10rpx;
		height: 100rpx;
		background-color: #2273f6;
	}

	.image {
		margin-top: 10rpx;
		display: flex;
		flex-wrap: wrap;

		.imageitem {
			height: 200rpx;
			width: 200rpx;
			margin: 8rpx;

			image {
				height: 200rpx;
				width: 200rpx;
			}
		}
	}
</style>
