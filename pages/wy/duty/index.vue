<template>
	<view class="onduty">
		<view class="header">
			<uni-nav-bar left-icon="back" @clickLeft="goBack" right-text="筛选" @clickRight="screen" title="值班管理">
			</uni-nav-bar>
		</view>
		<tabs :tabs="tabsList" @send="handleTap">
			<view class="onduty-arrangement">
				<view class="empty" v-if="ondutyList.length==0">
					<view class="nothingImg">
						<image src="../../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
					</view>
					<view class="nothing">没有数据</view>
				</view>
				<view class="onduty-message" v-for="(item,index) in ondutyList" :key="index" @click="goTo(item.id)">
					<view class="m10 fs30">
						值班人员：{{item.name}}
					</view>
					<view class="m10 fs30" v-show="!item.isShow">
						值班时间：
						<text>{{item.start_time | timeMinute}} -- {{item.end_time | timeMinute}}</text>
					</view>
					<view class="m10 fs30" v-show="item.isShow">
						开始时间：<text>{{item.start_time | timeMinute}}</text>
					</view>
					<view class="m10 fs30" v-show="item.isShow">
						结束时间：<text>{{item.end_time | timeMinute}}</text>
					</view>
					<view class="m10 fs30" v-show="item.isShow">
						备注：{{item.remark}}
					</view>
					<view class="more" @click.stop="showMroe(item)">
						{{item.isShow?'收起信息':'查看更多'}}
					</view>
				</view>
				<view style="margin-bottom: 120rpx;"></view>
			</view>
		</tabs>
		<button type="primary" class="btn" v-if="addAuth" @tap="addOnduty">新增</button>
		<uni-popup ref="popup" :type="popuptype" style="margin-top: 100rpx;">
			<view class="popup-box" style="background-color: #FFFFFF;">
				<view class="pickTitle">筛选日期</view>
				<view style="width: 660rpx;display: flex;justify-content: space-between;">
					<uni-datetime-picker return-type="timestamp" @change="timestampStartChange" style="width: 55%;">
					</uni-datetime-picker>
					<view style="width: 100rpx;height: 32px;line-height: 32px;text-align: center;">至</view>
					<uni-datetime-picker return-type="timestamp" @change="timestampEndChange" style="width: 55%;">
					</uni-datetime-picker>
				</view>
				<button type="primary" style="width: 80%; margin-top: 30rpx;" @click="selectBtn">确定</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import popupLayer from '../../../components/uni-popup/popup.js';
	import {
		timeFormat
	} from '../../../utils/dateUtils.js';
	import QueryAuth from '@/mixins/QueryAuth.js'
	import {
		timeSecond,
		timeStamp,
		timeMinute
	} from '../../../utils/time.js'


	export default {
		data() {
			return {
				tabsList: [{
						id: '',
						value: '',
						isActive: true
					},
					{
						id: '',
						value: '',
						isActive: false
					}
				],
				indexNum: 0,
				category_id: 2,
				start: '',
				end: '',
				ondutyList: [],
				deepLength: 1,
				themeColor: '#007AFF',
				startDate: '',
				endDate: '',
				popuptype: 'center'
			}
		},mixins: [QueryAuth],
		filters: {
			timeStamp,
			timeMinute
		},
		created() {
			this.queryAuth('duty');
		},
		computed: {
			// 改造数据
			newList() {
				return this.ondutyList.map(item => {
					this.$set(item, "isShow", false)
					return item
				})
			},
			addAuth() {
				return this.authList.includes("duty_add")
			},
			updateAuth() {
				return this.authList.includes("duty_update")
			}
		},
		methods: {
			changePop(){
				// #ifdef APP-PLUS
				this.popuptype = "top";
				// #endif
			},
			//切换选中项
			handleTap(res) {
				this.indexNum = res.index
				const index = res.index
				this.tabsList.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
				if (index == 0) {
					this.getList(this.tabsList[0].id)
				}
				if (index == 1) {
					this.getList(this.tabsList[1].id)
				}
			},
			// 点击展开收起
			showMroe(e) {
				const status = e.isShow;
				this.ondutyList.forEach(item => {
					item.isShow = false
				})
				e.isShow = !status
				this.$forceUpdate()
			},
			// 获取头部
			getTabsList() {
				let data = {
					handler: 'duty_category'
				}
				this.request({
					url: '/mobile/duty',
					data: data
				}).then(res => {
					this.tabsList.forEach((item, i) => {
						item.value = res.data[i].name
						item.id = res.data[i].id
					})
				})
			},
			// 获取列表
			getList(id) {
				let data = {
					start: this.start,
					end: this.end,
					'filter[category_id]': id,
					'filter[community_code]': uni.getStorageSync('community_code'),
					page: 1,
					limit: 20
				}
				this.request({
					url: '/mobile/duty',
					data: data
				}).then(res => {
					this.ondutyList = res.data.data
				})
			},
			// 获取本月第一秒和最后秒
			getMonth() {
				var data = new Date(); //本月
				data.setDate(1);
				data.setHours(0);
				data.setSeconds(0);
				data.setMinutes(0);

				var data1 = new Date(); // 下月
				if (data.getMonth() == 11) {
					data1.setMonth(0)
				} else {
					data1.setMonth(data.getMonth() + 1)
				}
				data1.setDate(1);
				data1.setHours(0);
				data1.setSeconds(0);
				data1.setMinutes(0);
				//     console.log('本月第一天0点' + data.getTime())
				//     console.log('本月最后一天23点' + data1.getTime())

				this.start = parseInt(data.getTime() / 1000);
				this.end = parseInt(data1.getTime() / 1000) - 1; //(计算下月1号时间戳-1即可)
			},
			// 跳转详情
			goTo(id) {
				if(this.updateAuth){
					uni.navigateTo({
						url: './ondutyMessage/ondutyMessage?id=' + id
					})
				}
				
			},
			// 跳转首页
			goBack() {
				uni.redirectTo({
					url: '../index/index'
				})
			},
			// 筛选功能(打开筛选弹窗)
			screen() {
				this.$refs.popup.open();
			},
			// 添加值班人员
			addOnduty() {
				if (this.indexNum == 0) {
					uni.navigateTo({
						url: 'addOnduty/addOnduty?id=' + this.tabsList[0].id
					})
				}
				if (this.indexNum == 1) {
					uni.navigateTo({
						url: 'addOnduty/addOnduty?id=' + this.tabsList[1].id
					})
				}
			},
			// 筛选选择日期
			timestampStartChange(e) {
				this.startDate = e / 1000
			},
			timestampEndChange(e) {
				this.endDate = e / 1000
			},
			// 筛选
			selectBtn() {
				const _id = this.indexNum == 0 ? this.category_id : this.tabsList[1].id
				let data = {
					start: this.startDate,
					end: this.endDate,
					'filter[category_id]': _id,
					'fliter[community_code]': uni.getStorageSync('community_code'),
					page: 1,
					limit: 10
				}
				if (this.startDate > this.endDate) {
					uni.showToast({
						title: '请输入正确的时间',
						icon: 'none'
					})
				} else if (this.startDate == '') {
					uni.showToast({
						title: '请输入开始时间',
						icon: 'none'
					})
				} else if (this.endDate == '') {
					uni.showToast({
						title: '请输入结束时间',
						icon: 'none'
					})
				} else {
					this.request({
						url: '/mobile/duty',
						data: data
					}).then(res => {
						this.ondutyList = res.data.data
						uni.showLoading({
							title: '加载中'
						})
						setTimeout(function() {
							uni.hideLoading()
						}, 200)
						this.$refs.popup.close();
					})
				}

			}
		},
		async onShow() {
			if (this.indexNum == 0) {
				await this.getList(this.category_id);
			}
			if (this.indexNum == 1) {
				await this.getList(this.indexNum);
			}

		},
		onLoad() {
			this.getMonth();
			this.getTabsList();
			this.changePop();
		},
		onPullDownRefresh() {
			if (this.indexNum == 0) {
				this.getList(this.tabsList[0].id)
			}
			if (this.indexNum == 1) {
				this.getList(this.tabsList[1].id)
			}
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}

	}
</script>

<style lang="scss">
	.header {
	// #ifdef MP
	margin-top: 130rpx;
	// #endif
	// #ifdef APP-PLUS
	margin-top: 80rpx;
	// #endif
	// #ifdef H5
	margin-top: 20rpx;
	// #endif
	}

	// 页面样式
	.onduty {
		.onduty-arrangement {
			margin-top: 10rpx;
			border-top: 3rpx solid #e7e8e7;
			display: flex;
			flex-direction: column;

			.empty {
				margin-top: 30rpx;
				text-align: center;
				font-size: 34rpx;
				color: #e7e8e7;

			}

			.onduty-title {
				padding: 20rpx 0;
				font-size: 40rpx;
				font-weight: 700;
			}

			.onduty-message {
				position: relative;
				padding: 30rpx 50rpx;
				border-bottom: 3rpx dashed #E8E7E7;

				.more {
					position: absolute;
					bottom: 0;
					right: 20rpx;
					font-size: 28rpx;
					color: #6e7069;
				}

				text {
					font-size: 26rpx;
				}
			}

		}
	}

	// 组件样式
	.popup-box {
		padding: 30rpx;
	}

	.timeView {
		padding: 0 30rpx 0 30rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		height: 64rpx;
		border-radius: 8rpx;
		border: 3rpx solid rgba(205, 205, 205, 1);

		text {
			font-size: 26rpx;
			color: #a8a8a8;
		}
	}

	.pickTitle {
		height: 90rpx;
		font-size: 34rpx;
		font-weight: 600;
		color: rgba(51, 51, 51, 1);
		line-height: 90rpx;
	}

	/deep/.uni-datetime-picker-popup[data-v-f2e7c4e8] {
		position: fixed;
		top: 180%;
		left: 50%;
	}

	/deep/.uni-datetime-picker-text[data-v-f2e7c4e8] {
		font-size: 24rpx;
	}

	// 公共样式
	.mt80 {
		margin-top: 80rpx;
	}

	.m10 {
		margin: 14rpx 0;
	}

	.fs30 {
		font-size: 32rpx;
		color: #3c3c3c
	}

	.mb20 {
		margin-bottom: 20rpx;
	}

	.btn {
		color: #fff;
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 0rpx;
		background-color: #2273f6;
	}
	.nothing{
		color: #B3B3B3;
		width: 100%;
		height: 30rpx;
		text-align: center;
		padding: 20rpx 0;
	}
</style>