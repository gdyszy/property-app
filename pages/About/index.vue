<template>
	
	<view>
		<view class="ab_top">
			<text>关于</text>
		</view>
		<view class="ab_bottom" @click="gatpopData">
			<view>技术支持</view>
			<image src="../../static/common/btn_01.png" mode=""></image>
		</view>
		<view class="ab_bottom" @click="kefu">
			<view>联系客服</view>
			<image src="../../static/common/btn_01.png" mode=""></image>
		</view>
		<!-- #ifdef APP-PLUS -->
		<view class="ab_bottom" @click="version">
			<view>检查版本</view>
			<view class="version"> <text>{{oldversion}}<i v-if="isupdate" style="color: #d93232;font-size: 30rpx;">·</i></text></view>
		</view>
		<!-- #endif -->	
	</view>
</template>
<script>
	export default {
		data() {
			return {
				oldversion: '',
				content: '',
				phoneData:[],
				isupdate:false
			}
		},
		onShow() {
			let that = this
			uni.$on('outinfos',function(){
			   that.update()
			})
			uni.$on('qxGengxin',function(){
			   const subNVue = uni.getSubNVueById('popup');
			   subNVue.hide()
			})
		},
		onLoad() {
			// #ifdef APP-PLUS
			let platform = ''
			let that = this;
			uni.getSystemInfo({
				success: (data) => {
					platform = (data.platform === 'ios') ? 2 : 1
				}
			})
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				that.oldversion = "当前版本" + widgetInfo.version;
				uni.request({
					url: that.$websiteUrl + '/v1/version_managers',
					method: 'GET',
					data: {
						version: widgetInfo.version,
						os_type: platform,
						appid: plus.runtime.appid
					}
				}).then(([err, res]) => {
					if(res.data.data!=''){
					that.phoneData = res.data.data
					// that.content =  that.phoneData.content.replace("\r\n","<br/>");
					that.content =  that.phoneData.content
					if (that.phoneData.oldversion < that.phoneData.newversion) {
						that.oldversion = "发现新版本";
						that.isupdate = true;
					} else{
						that.isupdate = false;
					}
					}
				})
			});
			// #endif


		},
		methods: {
			gatpopData() {
				uni.showModal({
					title: '技术支持',
					content: '本程序由广东优势智云信息科技股份有限公司提供技术支持',
					showCancel: false
				})
			},
			kefu() {
				uni.makePhoneCall({
					phoneNumber: "400081668",
					success() {}
				})
			},
			version() {
				if(this.isupdate==true){
					let contents = this.content
					const subNVue = uni.getSubNVueById('popup').show()
					uni.$emit('vers',{contents,contents})
				}
			},
			cancel() {
				this.vers = false
			},
			update() {
				// #ifdef APP-PLUS
				let platform = ''
				let that = this;
				uni.getSystemInfo({
					success: (data) => {
						platform = (data.platform === 'ios') ? 2 : 1
					}
				})
				plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
					uni.request({
						url: that.$websiteUrl + '/v1/version_managers',
						method: 'GET',
						data: {
							version: widgetInfo.version,
							os_type: platform,
							appid: plus.runtime.appid
						}
					}).then(([err, res]) => {
						let phoneData = res.data.data
						if (phoneData.oldversion < phoneData.newversion && phoneData.downloadurl && phoneData.update_type === 1) {
							let downloadTask = uni.downloadFile({
								url: phoneData.downloadurl,
								success: (downloadurl) => {
									if (downloadurl.statusCode === 200) {
										plus.runtime.install(downloadurl.tempFilePath, {
											force: false
										}, function() {
											that.isupdate = false;
											uni.showToast({
												title: '资源更新完成'
											})
											plus.runtime.restart();
										}, function(e) {});
									}
								}
							})
						} else if (phoneData.oldversion < phoneData.newversion && phoneData.downloadurl && phoneData.update_type ===
							2) {
							plus.runtime.openURL(phoneData.downloadurl);
						}
					})
				});
				// #endif
			},

		}
	}
</script>
<style lang="less">
	.ab_top {
		margin-top: 14rpx;
		margin-left: 30rpx;
		margin-right: 30rpx;
		padding-bottom: 38rpx;
		box-sizing: border-box;
		font-size: 40rpx;
		color: #333333;
		border-bottom: 2rpx solid #E6E6E6;
		font-weight: 900;
	}

	.ab_bottom {
		height: 116rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 30rpx;
		margin-right: 30rpx;
		border-bottom: 2rpx solid #E6E6E6;
		font-size: 30rpx;
		color: #262626;

		image {
			margin-right: 10rpx;
			height: 24rpx;
			width: 24rpx;
		}

		.version {
			margin-right: 32rpx;
			font-size: 26rpx;
			color: #B3B3B3;
		}
	}
</style>