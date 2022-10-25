<template>
	<view class="onduty">
		<!-- <uni-nav-bar left-icon="back" @clickLeft="goBack" right-text="筛选" @clickRight="screen" title="消息管理" fixed="true" statusBar="true"/> -->
		<uni-nav-bar left-icon="back" @clickLeft="goBack" title="消息管理" fixed="true" statusBar="true"/>
		<tabs :tabs="tabsList" @send="handleTap">
			<view class="onduty-arrangement">
				<view class="empty" v-if="List.length==0">
					<view class="nothingImg">
						<image src="../../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
					</view>
					<view class="nothing">没有数据</view>
				</view>
				<view v-else>
					<view class="onduty-message" v-for="(item,index) in List" :key="index" @click="goTo(item.id)">
						<view class="m10 fs30">
							标题：{{item.title}}
						</view>
						<view class="m10 fs30">
							更新时间：
							<text>{{(item.update_time * 1000) | timeSecond}}</text>
						</view>
						<view class="m10 fs30">
							状态：{{item.status == 0 ? "隐藏": "显示"}}
						</view>
					</view>
				</view>			
				<view style="margin-bottom: 120rpx;"></view>
			</view>
		</tabs>
		<button type="primary" class="btn" v-if="addAuth" @tap="addNewMsg">新增</button>
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
						id: '0',
						value: '系统消息',
						isActive: true
					},
					{
						id: '1',
						value: '通知消息',
						isActive: false
					}
				],
				indexNum: 0,
				category_id: 2,
				start: '',
				end: '',
				List: [],
				deepLength: 1,
				themeColor: '#007AFF',
				startDate: '',
				endDate: '',
				popuptype: 'center',
				last_page: 1,
				page: 1,
			}
		},mixins: [QueryAuth],
		components: {
		},
		filters: {
			timeStamp,
			timeMinute,
			timeSecond
		},
		created() {
			this.queryAuth('msg_add');
		},
		computed: {
			// 改造数据
			newList() {
				return this.List.map(item => {
					this.$set(item, "isShow", false)
					return item
				})
			},
			addAuth() {
				return this.authList.includes("msg_add")
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
				this.indexNum = res.index;
				this.page = 1;
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
				this.List.forEach(item => {
					item.isShow = false
				})
				e.isShow = !status
				this.$forceUpdate()
			},
			// 获取列表
			getList(id) {
				let data = {
					'filter[type]': id,
					'filter[community_code]':uni.getStorageSync('community_code'),
					page: this.page,
					limit: 10
				}
				this.request({
					url: '/mobile/msg',
					data: data
				}).then(res => {
					if(res.data.current_page == 1){
						this.List.length = 0;
						this.List = res.data.data;
					}else{
						for(var i = 0; i < res.data.data.length; i++){
							this.List.push(res.data.data[i]);
						}
					}
					this.last_page = res.data.last_page;
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
				uni.navigateTo({
					url: './msgInfo?id=' + id
				})
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
			// 添加新的消息
			addNewMsg() {
				uni.navigateTo({
					url: 'addMessage?id=' + this.tabsList[this.indexNum].id
				})
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
				}

			}
		},
		async onShow() {
			this.page = 1;
			this.getList(this.tabsList[this.indexNum].id)
		},
		onLoad() {
			this.getMonth();
			this.changePop();
		},
		onPullDownRefresh() {
			this.page = 1;
			this.getList(this.tabsList[this.indexNum].id)
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onReachBottom() {
			if (this.page >= this.last_page) {
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
				}, 500)
				this.page++;
				this.getList(this.tabsList[this.indexNum].id)
			}
		},

	}
</script>

<style lang="scss">
	.status_bar {
	      height: var(--status-bar-height);
	      width: 100%;
	 }
	  
	.header {
	// #ifdef MP
	// padding-top: 130rpx;
	// // #endif
	// // #ifdef APP-PLUS
	// padding-top: 80rpx;
	// // #endif
	// // #ifdef H5
	// padding-top: 20rpx;
	// // #endif
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

	// /deep/.uni-datetime-picker-popup[data-v-f2e7c4e8] {
	// 	position: fixed;
	// 	top: 180%;
	// 	left: 50%;
	// }

	// /deep/.uni-datetime-picker-text[data-v-f2e7c4e8] {
	// 	font-size: 24rpx;
	// }

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