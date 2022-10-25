<template>
	<view class='my'>
		<view class="background_image">
			<image src="../../../static/my/bg_01.png" mode="" class="image_background"></image>
			<view class="title" @click="login()" v-if="userInfo ===''">
				<view class="t_left">
					<image src="../../../static/my/default@2x.png" mode=""></image>
				</view>
				<view class="t_right">
					<view class="r_left">
						<view class="r_text1">未登录</view>
						<view class="r_text2">请登录后使用</view>
					</view>
					<view class="r_right">
						<view class="r_image">
							<image src="../../../static/my/btn_01.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
			<view class="title" v-else>
				<view class="t_left">
					<image :src="avatar" mode=""></image>
				</view>
				<view class="t_right">
					<view class="r_left">
						<navigator class="r_textinfo" hover-class="none">
							<view class="r_textinfo1">
								<view class="name1">{{userInfo.client.username }}</view>
								<view class="r_text2">{{ userInfo.client.nickname}}</view>
							</view>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<view class="test">
			<text>我的操作</text>
		</view>


		<view class="fengexian"></view>

		<view class="my_tabs" @click="gatpop" v-if="Way == 0">
			<view class="tabs_left">
				<image src="../../../static/my/icon2.png" mode=""></image>
			</view>
			<view class="tabs_right">
				<text>账号管理</text>
				<image src="../../../static/my/btn_01.png" mode=""></image>
			</view>
		</view>

		<view class="fengexian" v-if="Way == 0"></view>

		<view class="my_tabs" @click="messages">
			<view class="tabs_left">
				<image src="../../../static/my/icon3.png" mode=""></image>
			</view>
			<view class="tabs_right">
				<text>消息管理</text>
				<image src="../../../static/my/btn_01.png" mode=""></image>
			</view>
		</view>

		<view class="fengexian"></view>

		<view class="my_tabs" @click="feedback">
			<view class="tabs_left">
				<image src="../../../static/my/icon4.png" mode=""></image>
			</view>
			<view class="tabs_right">
				<text>意见反馈</text>
				<image src="../../../static/my/btn_01.png" mode=""></image>
			</view>
		</view>

		<view class="fengexian"></view>

		<view class="my_tabs" @click="About">
			<view class="tabs_left">
				<image src="../../../static/my/incon5.png" mode=""></image>
			</view>
			<view class="tabs_right">
				<text>关于</text>
				<image src="../../../static/my/btn_01.png" mode=""></image>
			</view>
		</view>

		<view class="fengexian"></view>


		<view class="my_tabs" v-if="userInfo !=''" @click="logOut">
			<view class="tabs_left">
				<image src="../../../static/my/icon5.png" mode=""></image>
			</view>
			<view class="tabs_right">
				<text>退出登录</text>
				<image src="../../../static/my/btn_01.png" mode=""></image>
			</view>
		</view>
		<uni-popup ref="popup2" type="dialog">
			<uni-popup-dialog mode="base" message="成功消息" :duration="2000" :before-close="true" @close="close"
				@confirm="confirm" content="确定要退出当前账号吗" title="退出账号" msgColor="msgColor"></uni-popup-dialog>
		</uni-popup>
		<view class="fengexian" v-if="userInfo !='' "></view>

	</view>

</template>

<script>
	import {
		Base64
	} from '../../../utils/base64.js'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		name: 'vue',
		props: {},
		data() {
			return {
				userInfo: '', // 个人信息
				myinfo: '',
				yeZhu: "业主",
				vers: false,
				H5Status: true,
				avatar: '',
				Way: 1,
				ownerType: 1,
				ownerBangDing: 1,
			};
		},
		onShow() {
			this.getInfo()
			// 监听事件
			uni.$on('login', (MYinfo) => {
				this.yeZhu = '未登录';
			})

		},
		onLoad() {
			// #ifdef H5
			this.H5Status = false
			// #endif
			var that = this
			uni.getStorage({
				key: 'loginWay',
				success: function(res) {
					that.Way = res.data
				}
			});
			this.getInfo();
		},
		onUnload() {
			// 移除监听事件  
			uni.$off('bangding');
		},
		methods: {
			logOut() {
				this.$refs.popup2.open()
			},
			close() {
				this.$refs.popup2.close()
			},
			async confirm() {
				let access_token = this.userInfo.access_token
				let user_id = this.userInfo.client.user_id
				this.userInfo = ''
				this.$logout();
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
							} else if (res.cancel) {}
						}
					})
				} else {
					uni.showModal({
						title: '提示信息',
						content: '请先登录',
						cancelText: '去登录',
						confirmText: '取消',
						confirmColor: "#262626",
						success(res) {
							if (res.confirm) {

							} else if (res.cancel) {
								uni.navigateTo({
									url: '../login/index'
								})
							}
						}
					})
				}

			},
			messages() {

				if (this.userInfo != '') {
					uni.navigateTo({
						url: '../myMessage/index'
					})
				} else {
					this.gologin();
				}
			},
			About() {
				uni.navigateTo({
					url: '../../About/index'
				})
			},
			feedback() {
				if (this.userInfo != '') {
					uni.navigateTo({
						url: '../../feedback/index?' + this.myinfo.community_code
					})
				} else {
					this.gologin();
				}
			},
			myMessage() {
				if (this.userInfo != '') {
					uni.navigateTo({
						url: '../../myMessage/index'
					})
				} else {
					this.gologin();
				}
			},
			yijiang() {
				if (this.userInfo != '') {
					uni.navigateTo({
						url: '../../yijang/index'
					})
				} else {
					this.gologin();
				}
			},
			

			// 跳转到登录页面
			login() {
				uni.navigateTo({
					url: "../login/index"
				});
			},
			//账号管理
			gatpop() {
				if (this.userInfo != '') {
					uni.navigateTo({
						url: '../../accountManagement/index'
					});
				} else {
					this.gologin();
				}

			},
			//登录获取自己信息
			getInfo() {
				const value = uni.getStorageSync('myinfo')
				console.log("myinfo value:"+JSON.stringify(value))
				if (value) {
					if (value.client.username == '') {
						uni.removeStorage('myinfo');
					} else {
						this.userInfo = value
						this.avatar = value.client.avatar
						if (!this.avatar.startsWith('http')) {
							this.avatar = this.$websiteUrl + this.avatar
						}
					}
				}
			}
		},
	};
</script>

<style lang="less">
	.background_image {
		position: relative;
		margin-top: 40rpx;

		.image_background {
			position: absolute;
			z-index: -999;
			width: 100%;
			height: 140rpx;
		}
	}

	.title {
		margin-left: 36rpx;
		display: flex;
		margin-top: 124rpx;
		height: 140rpx;

		.t_left {
			margin-right: 40rpx;
			height: 140rpx;
			width: 136rpx;
			margin: 0 auto;
			text-align: center;

			image {
				height: 140rpx;
				width: 128rpx;
				border-radius: 12rpx;
			}
		}

		.t_right {
			flex: 1;
			display: flex;

			.r_left {
				margin-left: 30rpx;
				flex: 1;
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.r_text1 {
					width: 100%;
					font-size: 40rpx;
					color: #333333;
					font-weight: 900;
					margin-bottom: 24rpx;
				}

				.r_text2 {
					width: 100%;
					margin-top: 20rpx;
					font-size: 24rpx;
					color: #999999;
				}
			}

			.r_right {
				margin-right: 46rpx;
				display: flex;
				align-items: center;

				.r_image {
					image {
						height: 36rpx;
						width: 36rpx;
					}
				}
			}
		}
	}

	// banner
	.my_banner {
		margin-top: 24rpx;
		height: 188rpx;
		display: flex;
		margin-bottom: 28rpx;
		margin-left: 26rpx;

		image {
			width: 346rpx;
			height: 188rpx;
		}
	}

	.my_tabs {
		display: flex;
		margin: 0 20rpx;
		box-sizing: border-box;

		.tabs_left {
			margin: 34rpx 0;
			margin-left: 40rpx;
			margin-right: 36rpx;

			image {
				width: 48rpx;
				height: 48rpx;
			}
		}

		.tabs_right {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;

			text {
				margin: 44rpx 0;
				font-size: 28rpx;
				color: #262626;
			}

			image {
				margin-right: 38rpx;
				width: 30rpx;
				height: 30rpx;
			}
		}
	}

	.r_textinfo {
		flex: 1;

		.name1 {
			font-size: 40rpx;
			font-weight: 700;
		}
	}

	.test {
		margin-top: 30rpx;
		margin-bottom: 20rpx;
		margin-left: 42rpx;
		font-size: 34rpx;
		color: #262626;
		font-weight: 900;
	}

	.r_textinfo1 {
		display: flex;
		width: 100%;
	}

	.fengexian {
		border-bottom: 1rpx solid #e6e6e6;
		width: 88%;
		margin: 0 auto;
		height: 1rpx;
	}
</style>
