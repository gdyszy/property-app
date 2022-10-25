<template>
	<view>
		<view class="header">
			<view @click="goBack" style="width: 10%;">
				<uni-icons type="back" size="30"></uni-icons>
			</view>
			<view style="margin-left: 20%;width: 35%;display: flex;" @click="showTree">
				<input type="text" disabled="true" class="input-msg" v-model="community" placeholder="选择小区" />
				<uni-icons type="arrowdown" size="30"></uni-icons>
			</view>
			<view @click="regologin" style="margin-left: 12%;margin-right: 2%;width: 20%;">切换用户</view>
		</view>
		<view class="image_content">
			<swiper :autoplay="true" :interval="5000" :duration="1000" :circular='true' indicator-dots="true"
				indicator-color="#999999" indicator-active-color="#e4e4e4" duration="1000" class="swiperBox">
				<swiper-item v-for="(item) in bannerList" :key='item.id'>
					<view class="swiper-item">
						<image style="width: 100%; height: 370rpx;" :src="item.image" lazy-load mode="scaleToFill">
						</image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="nav_content">
			<view v-for="(i,index) in indexClassList" :key='i.id' @tap="openClass(i.path)" class="nav_box">
				<image style="width: 88rpx; height: 88rpx; padding: 0 15rpx;" :src="i.image" lazy-load
					mode="scaleToFill" />
				<view class="nav_text">
					{{ i.name }}
				</view>
			</view>
		</view>
		<tki-tree ref="tkitree" :intIsShow="false" :range="communityArray" :status="treeStatus" rangeKey="name"
			confirmColor="#5089f9" @confirm="treeConfirm"></tki-tree>
	</view>
</template>

<script>
	import ListItem from '../../../components/index/list_item.vue'
	import uniLoadMore from '../../../components/uni-load-more/uni-load-more.vue'
	import tkiTree from "../../../components/tki-tree/tki-tree.vue";
	import QueryAuth from '@/mixins/QueryAuth.js'
	export default {
		components: {
			ListItem,
			uniLoadMore,
			tkiTree
		},
		mixins: [QueryAuth],
		data() {
			return {
				userInfo: uni.getStorageSync('wymyinfo'),
				treeStatus: 1,
				spinner: [],
				deepLength: 1,
				themeColor: '#007AFF',
				community: '',
				communityArray: '',
				index: 0,
				content: '',
				phoneData: [],
				isupdate: true,
				bannerList: [], //banner图片
				newslist: [], //新闻列表
				page: 1,
				limit: 5,
				indexClassList: [{
						'id': 2,
						'name': '报修管理',
						'image': '/static/images/index/btn_04_ico.png',
						'path': 'pages/wy/repair/index'
					},
					{
						'id': 3,
						'name': '投诉管理',
						'image': '/static/images/index/ico_02_06.png',
						'path': 'pages/wy/complain/index'
					},
					{
						'id': 4,
						'name': '值班管理',
						'image': '/static/images/index/ico_02_06.png',
						'path': 'pages/wy/duty/index'
					}, {
						'id': 5,
						'name': '消息管理',
						'image': '/static/images/index/ico_02_06.png',
						'path': 'pages/wy/msg/index'
					}
				],
				status: '',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '',
					contentnomore: '没有更多'
				},
				isEnd: false, //isEnd用于判断是否还有数据，没有数组停止数组请求
				triggered: false,
				_freshing: false,
				listData: '',
				scrollTop: 0,
				hasAuth: true,
				access_info:'',
				jumpListUrl:'',
				viewStatus: false
			}
		},
		onShow() {
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
			if (this.scrollTop >= 200) {
				// #ifdef APP-PLUS
				void plus.navigator.setStatusBarStyle("dark");
				// #endif
			} else {
				// #ifdef APP-PLUS
				void plus.navigator.setStatusBarStyle("light");
				// #endif
			}
		},
		onLoad() {
			this.getbannerList();
			this.getCommunity();
			this._freshing = false;
			if(uni.getStorageSync('wymyinfo')){
				this.access_info = uni.getStorageSync('wymyinfo').client.access_info
			}
			

		},
		onReachBottom() { //上拉触底函数
			this.status = 'more'; //设置sataus是更多
		},
		watch: {
			authList(newVal,oldVal){
					 if(newVal == null || newVal == '') {
						 uni.showToast({
						 	title: "请联系管理员分配小区管理权限！",
						 	icon: 'none'
						 })
					 }else {
						 for(let i = 0;i<newVal.length;i++){
							 if(newVal[i].indexOf("_view") != -1 ){
									uni.navigateTo({
										url:this.jumpListUrl
									})
									this.viewStatus = true
							 }
						 }
						 if(this.viewStatus == false){
							 uni.showToast({
							 	title: "请联系管理员分配小区管理权限！",
							 	icon: 'none'
							 })
						 }
					 }
			}
		},
		methods: {
			getCommunity() {
				if (uni.getStorageSync('community_name') != '') {
					this.hasAuth = true;
					this.community = uni.getStorageSync('community_name')
				} else if (uni.getStorageSync('wymyinfo').client.community) {
					this.hasAuth = true;
					this.communityArray = uni.getStorageSync('wymyinfo').client.community
					this.community = this.communityArray[0].name
					uni.setStorageSync('community_name', this.communityArray[0].name)
					uni.setStorageSync('community_code', this.communityArray[0].community_code)
				} else {
					this.hasAuth = false;
					uni.showToast({
						title: "请联系管理员分配小区管理权限！",
						icon: 'none'
					})
				}
			},
			getbannerList() {
				//轮播图
				this.request({
					url: '/v1/slides',
					method: 'get'
				}).then((res) => {
					if (res.data != '') {
						this.bannerList = res.data
					} else {
						this.bannerList = [{
							"id": 1,
							"cid": 1,
							"name": "banner1",
							"image": "../../static/images/index/banner1.png",
						}, {
							"id": 2,
							"cid": 1,
							"name": "banner1",
							"image": "../../static/images/index/banner2.png",
						}]
					}

				});
			},
			showTree(e) {
				if (!this.userInfo) {
					this.gologin();
				} else {
					this.communityArray = uni.getStorageSync('wymyinfo').client.community
					this.$refs.tkitree._show();
				}
			},
			treeConfirm(e) {
				if (e[0]) {
					this.community = e[0].name
					uni.setStorageSync('community_name', e[0].name)
					uni.setStorageSync('community_code', e[0].community_code)

				}
			},
			gologin() {
				if (uni.getSystemInfoSync().platform == 'ios') {
					uni.showModal({
						title: '提示信息',
						content: '请先登录',
						confirmText: '去登录',
						cancelColor: "#262626",
						success(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../login/index'
								})
							} else if (res.cancel) {
								uni.switchTab({
									url: '../index/index'
								})
							}
						}
					})
				} else {
					uni.showModal({
						title: '提示信息',
						content: '请先登录',
						cancelText: '去登录',
						confirmText: '取消',
						cancelColor: "#262626",
						success(res) {
							if (res.confirm) {
								uni.switchTab({
									url: '../index/index'
								})
							} else if (res.cancel) {
								uni.navigateTo({
									url: '../login/index'
								})
							}
						}
					})
				}


			},
			gitNotiuce() {
				if (!this.userInfo) {
					this.gologin();
				} else {
					uni.navigateTo({
						url: '../myMessage/index'
					})
				}
			},
			openClass(path) { //打开模块，需判断是否有小区管理员权限
				if (!this.userInfo) {
					this.gologin();
				} else {
					let Auth = [{
							name: 'complain',
							key: 'complain'
						},
						{
							name: 'duty',
							key: 'duty'
						},
						{
							name: 'memberAudit',
							key: 'memberAudit'
						},
						{
							name: 'msg',
							key: 'msg'
						},
						{
							name: 'repair',
							key: 'repair'
						}
					]

					for(let i = 0; i < Auth.length; i++){
						if(path.indexOf(Auth[i].name) != -1){
							this.queryAuth(Auth[i].key);
							this.hasAuth = false 
						}
					}
					
					this.jumpListUrl = "/" + path
				}
			},
			getMore() {
				uni.navigateTo({
					url: "../notice/notice"
				})
			},
			//点击进入详情
			noticeDetail(id) {
				uni.navigateTo({
					url: '../noticeDetail/noticeDetail?id=' + id
				})
			},
			refreshData() {
				if (this._freshing) return;
				this._freshing = true;
				this.triggered = true;
				setTimeout(() => {
					this.triggered = false;
					this._freshing = false;
				}, 2000)
			},
			refreshDataEnd() {
				this.triggered = false;
				this._freshing = false;
			},
			goBack() {
				uni.switchTab({
					url: '../../my/index'
				})
			},
			regologin() {
				uni.removeStorageSync('wymyinfo')
				uni.removeStorageSync('community_code')
				uni.removeStorageSync('community_name')
				uni.navigateTo({
					url: '../login/index'
				})
			}
		},
		onPullDownRefresh() {
			this.getbannerList();
			this.getCommunity();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		}
	}
</script>
<style lang="scss" scoped>
	.image_content {
		width: 100%;
		height: 370rpx;

		.swiperBox {
			width: 100%;
			height: 100%;
		}
	}

	/deep/ uni-swiper .uni-swiper-dots-horizontal {
		bottom: 50rpx;
	}

	/deep/ .uni-swiper-dot {
		opacity: 0.8;
		width: 12rpx;
		height: 12rpx;
	}

	/deep/ .uni-swiper-dot-active {
		width: 48rpx;
		height: 12rpx;
		border-radius: 6rpx;
	}

	.nav_content {
		display: flex;
		width: 100%;
		position: absolute;
		flex-wrap: wrap;
		margin-top: -10rpx;
		background-color: #FFFFFF;
		z-index: 999;
		justify-content: space-around;
		border-radius: 20rpx 20rpx 0 0;
		padding-top: 42rpx;
	}

	.nav_box {
		// padding-right: 70rpx;
		padding-bottom: 20rpx;
	}

	.nav_box:nth-child(4) {
		// padding-right: 0rpx;
	}

	.nav_text {
		font-size: 32rpx;
		color: #262626;
		margin-top: 10rpx;
		text-align: center;
	}


	.newNotice {
		width: 93%;
		margin: 0 auto;
		height: 80rpx;
		background-color: #f5faf8;
		border-radius: 8rpx;
		margin-top: 32%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;

		.newNoticeLeft {
			margin-left: 20rpx;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			font-size: 26rpx;

			.newIcon {
				width: 48rpx;
				height: 48rpx;
			}

			.NewTitle {
				color: #323232;
				margin-left: 14rpx;
				margin-right: 20rpx;
				font-size: 26rpx;
			}

			.NewMsg {
				color: #808080;
				font-size: 26rpx;
				margin-left: 20rpx;
			}

			.New_block {
				width: 1rpx;
				height: 26rpx;
				background-color: #808080;
				border-radius: 1rpx;
			}
		}

		.newNoticeRight {
			width: 36rpx;
			height: 36rpx;
			margin-right: 12rpx;
			// background-color: #007AFF;
		}

		.dian {
			color: red;
			position: absolute;
			right: 60rpx;
			top: 14rpx;
			z-index: 999;
		}
	}

	.news_content {
		width: 93%;
		margin: 0 auto;
		// border-top: 1px solid #e6e6e6;
		margin-top: 46rpx;
		display: flex;
		justify-content: space-between;

		// padding-top: 34rpx;
		.title_left {
			display: flex;
			align-items: center;

			.color_block {
				width: 8rpx;
				height: 30rpx;
				background-color: $color2;
				border-radius: 4rpx;
				margin-right: 16rpx;
			}

			.text {
				font-size: 32rpx;
				color: #272727;
			}
		}

		.title_right {
			display: flex;
			justify-content: center;
			align-items: center;

			.right_text {
				color: #b3b3b3;
				font-size: 24rpx;
				margin-right: 7rpx;
			}
		}
	}

	.news_list {
		width: 93%;
		margin: 0 auto;
		margin-top: 34rpx;
	}

	.list_box {
		display: flex;
		border-bottom: 1px solid #e6e6e6;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;

		.box_detail {
			margin-left: 24rpx;

			.title {
				width: 472rpx;
				height: 80rpx;
				font-size: 30rpx;
				color: #323232;
				line-height: 40rpx;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
			}

			.detail {
				display: flex;
				margin-top: 30rpx;
				align-items: center;

				.detail_text {
					font-size: 24rpx;
					color: #b3b3b3;
					margin-left: 8rpx;
				}
			}
		}
	}

	.popup {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 9998;
	}

	.popup-info {
		position: fixed;
		width: 600rpx;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 12rpx;
		background-color: #FFFFFF;
		z-index: 9999;
		padding: 0 48rpx;
		padding-top: 60rpx;
	}

	.top {
		color: #262626;
		font-size: 32rpx;
	}

	.content {
		margin-top: 40rpx;
		width: 560rpx;
		color: #808080;
		font-size: 30rpx;
		line-height: 46rpx;

		.con-center {
			display: inline-block;
			white-space: nowrap;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}

	.button {
		display: flex;
		justify-content: space-between;
		margin-top: 88rpx;
		padding-bottom: 44rpx;

		.cancel {
			color: #262626;
			font-size: 32rpx;
		}

		.update {
			font-size: 32rpx;
			color: #28b07c;
		}
	}

	.header {
		width: 100%;
		display: flex;
		font-size: 16px;
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
</style>
