<template>
	<view class="onduty-message">
		<view class="date-changed">
			<view class="date-changed-title">
				添加值班
			</view>
			<view style="margin:30rpx 0;">
				<radio-group @change="radioChange">
					<label class="radio" style="margin-right: 20rpx;">
						<radio :value="ba_id" />保安
					</label>
					<label class="radio">
						<radio :value="bj_id" />保洁
					</label>
				</radio-group>
			</view>
			<view class="m10 fs30 mb20">
				姓名：<input type="text" class="input-msg" @click="showTree" v-model="ondutyName" placeholder="  选择值班人员"
					disabled="true" />
			</view>
			<view class="m10 fs30 mb20">
				<view style="width: 30%;">开始时间：</view>
				<uni-datetime-picker return-type="timestamp" @change="timestampStartChange" :value="startDate">
				</uni-datetime-picker>
			</view>
			<view class="m10 fs30 mb20">
				<view style="width: 30%;">结束时间：</view>
				<uni-datetime-picker return-type="timestamp" @change="timestampEndChange" :value="endDate">
				</uni-datetime-picker>
			</view>
			<view class="m10 fs30 mb20">
				备注：<input type="text" class="input-msg" v-model="remark" placeholder="    备注信息" />
			</view>
			<view class="btn-row" style="margin-top:0" v-if="addAuth">
				<button type="primary" class="primary" @click="addOnduty()">添加值班</button>
			</view>
		</view>
		<tki-tree ref="tkitree" :intIsShow="false" :range="watchkeeperList" :status="treeStatus" rangeKey="name"
			confirmColor="#5089f9" @confirm="treeConfirm"></tki-tree>
	</view>
</template>

<script>
	import mpvuePicker from '../../../../components/mpvue-picker/mpvuePicker.vue';
	import tkiTree from "../../../../components/tki-tree/tki-tree.vue";
	import {
		timeFormat
	} from '../../../../utils/dateUtils.js';
	import {
		timeSecond
	} from '../../../../utils/time.js'
	import QueryAuth from '@/mixins/QueryAuth.js'
	export default {
		data() {
			return {
				watchkeeperList: [],
				treeStatus: "loading",
				spinner: [],
				deepLength: 1,
				themeColor: '#007AFF',
				startDate: '',
				endDate: '',
				remark: '',
				name: '',
				ondutyName: '',
				userId: '',
				ba_id: '',
				bj_id: ''
			}
		},
		created() {
			this.queryAuth('duty_add');
		},
		mixins: [QueryAuth],
		computed: {
			addAuth() {
				return this.authList.includes("duty_add")
			}
		},
		onLoad(e) {
			this.getTabsList()

		},
		components: {
			mpvuePicker,
			tkiTree
		},
		methods: {
			radioChange(e) {
				this.getList(e.detail.value)

			},
			// 添加值班人员
			addOnduty() {
				let data = {
					community_code: uni.getStorageSync('community_code'),
					duty_user_id: this.userId,
					start_time: this.startDate,
					end_time: this.endDate,
					remark: this.remark
				}
				if (this.startDate > this.endDate) {
					uni.showToast({
						title: '请输入正确的时间格式',
						icon: 'none'
					})
				} else {
					this.request({
						url: '/mobile/duty',
						data: data,
						method: 'POST'
					}).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: res.desc,
								icon: 'none'
							})
							setTimeout(function() {
								uni.navigateBack({

								})
							}, 1000)
						}
						if (res.code == 400) {
							uni.showToast({
								title: res.desc,
								icon: 'none'
							})
						}
					})

				}
			},
			// 获取人员列表
			getList(id) {
				let data = {
					handler: 'duty_user',
					'filter[community_code]': uni.getStorageSync('community_code'),
					'filter[duty_category_id]': id,
					page: 1,
					limit: 50
				}
				this.request({
					url: '/mobile/duty',
					data: data
				}).then(res => {
					this.watchkeeperList = res.data.data
				})
			},
			// 选择值班人员
			showTree(e) {
				if (this.watchkeeperList.length == 0) {
					uni.showToast({
						title: '请选择值班人员类型',
						icon: 'none'
					})
				} else {
					this.$refs.tkitree._show();
				}

			},
			treeConfirm(e) {
				if (e[0]) {
					this.ondutyName = e[0].name
					this.userId = e[0].id
				}
			},
			watchSearch(e) {},

			// 选择日期
			timestampStartChange(e) {
				this.startDate = timeSecond(e)
				console.log(this.startDate)

			},
			timestampEndChange(e) {
				this.endDate = timeSecond(e)
				console.log(this.endDate)
			},

			// 获取分类id
			getTabsList() {
				let data = {
					handler: 'duty_category'
				}
				this.request({
					url: '/mobile/duty',
					data: data
				}).then(res => {
					this.bj_id = String(res.data[0].id)
					this.ba_id = String(res.data[1].id)
				})
			},
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
