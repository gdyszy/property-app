<template>
	<view class="onduty-message">
		<view class="date-changed">
			<view class="m10 fs30 mb20">
				姓 名：{{watchkeeperList.name}}
			</view>
			<view class="m10 fs30 mb20">
				小区号：{{watchkeeperList.community_code}}
			</view>

			<view class="m10 fs30 mb20" style="display: flex;">
				<view style="width: 30%;">开始时间：</view>
				<uni-datetime-picker :value="watchkeeperList.start_time*1000" return-type="timestamp"
					:start="watchkeeperList.start_time" @change="timestampStartChange" style="width: 70%;">
				</uni-datetime-picker>
			</view>
			<view class="m10 fs30 mb20" style="display: flex;">
				<view style="width: 30%;">结束时间：</view>
				<uni-datetime-picker :value="watchkeeperList.end_time*1000" return-type="timestamp"
					:start="watchkeeperList.end_time" @change="timestampEndChange" style="width: 70%;">
				</uni-datetime-picker>
			</view>
			<view class="m10 fs30 mb20" style="display: flex;">
				<view style="width: 30%;">备 注：</view><input type="text" class="input-msg"
					v-model="watchkeeperList.remark" placeholder="备注信息" style="width: 70%;" />
			</view>
			<view class="btn-row" style="margin-top:0" v-if="updateAuth">
				<button type="primary" class="primary" @click="updateDate()">确定</button>
			</view>
		</view>
	</view>

</template>

<script>
	import {
		timeSecond
	} from '../../../../utils/time.js'
	import QueryAuth from '@/mixins/QueryAuth.js'
	export default {
		data() {
			return {
				vModelDatetime: '',
				watchkeeperList: [],
				deepLength: 1,
				themeColor: '#007AFF',
				startDate: '',
				endDate: '',

			}
		},
		created() {
			this.queryAuth('duty');
		},
		mixins: [QueryAuth],
		computed: {
			updateAuth() {
				return this.authList.includes("duty_update")
			}
		},
		methods: {
			timestampStartChange(e) {
				this.watchkeeperList.start_time = e / 1000
				this.startDate = timeSecond(e)
			},
			timestampEndChange(e) {
				this.watchkeeperList.end_time = e / 1000
				this.endDate = timeSecond(e)
			},
			getDetail(id) {
				this.request({
					url: '/mobile/duty/' + id
				}).then(res => {
					this.watchkeeperList = res.data
					this.startDate = timeSecond(this.watchkeeperList.start_time * 1000)
					this.endDate = timeSecond(this.watchkeeperList.end_time * 1000)
				})
			},
			updateDate() {
				let data = {
					'duty_user_id': this.watchkeeperList.duty_user_id,
					'category_id': this.watchkeeperList.category_id,
					start_time: this.startDate,
					end_time: this.endDate,
					remark: this.watchkeeperList.remark
				}
				this.request({
					url: '/mobile/duty/' + this.watchkeeperList.id,
					method: 'PUT',
					data: data
				}).then(res => {
					if (res.code == 200) {
						uni.showToast({
							title: res.desc,
							icon: "none"
						})
						setTimeout(function() {
							uni.navigateBack({

							})
						}, 1000)
					}
					if (res.code == 400) {
						uni.showToast({
							title: res.desc,
							icon: "none"
						})
					}

				})

			},
		},
		onLoad(e) {
			this.getDetail(e.id)
		}
	}
</script>

<style lang="scss">
	.onduty-message {
		margin: 32rpx;

		.date-changed {
			.date-changed-title {
				padding: 20rpx 0;
				font-size: 40rpx;
				font-weight: 700;
				border-bottom: 3rpx solid #e7e8e7;
			}

			.input-msg {
				font-size: 28rpx;
				padding: 15rpx 0;
				width: 100%;
				border: 3rpx solid #e5e5e5;
				border-radius: 10rpx;
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
</style>
