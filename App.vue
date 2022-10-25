<script>
	import md5 from 'common/md5.js'
	import {
		Base64
	} from './utils/base64.js'
	export default {
		onLaunch: function() {
			let that = this
			uni.getStorage({
				key: 'myinfo',
				success: function(res) {
					let access_token = res.data.access_token;
					let user_id = res.data.client.user_id;
					let app_key = res.data.client.app_key;
					let header = {
						'Content-Type': 'application/x-www-form-urlencoded',
						'authentication': 'USERID ' + Base64.encode(app_key + ':' + access_token +
							':' + user_id)
					}
					//当前时间
					var timestamp = new Date().getTime();
					timestamp = Math.round(new Date().getTime() / 1000).toString();
					// token有效期
					let expires_time = res.data.expires_time
					let refresh_expires_time = res.data.refresh_expires_time
					if (expires_time - parseInt(timestamp) < 43200) {
						let refresh_token = res.data.refresh_token
						let nonce = Math.random().toString(36).substr(2)
						let time_stamp = Date.parse(new Date()) / 1000
						uni.request({
							url: that.$websiteUrl + '/v1/token/refresh',
							method: 'POST',
							header: header,
							data: {
								signature: md5('app_key=' + this.$appKey + '&app_secret=' + this
									.$app_secret + '&nonce=' + nonce + '&time_stamp=' +
									time_stamp + '&refresh_token=' + refresh_token),
								nonce: nonce,
								time_stamp: time_stamp,
								app_key: this.$appKey,
								refresh_token: refresh_token
							}
						}).then((accessToken) => {
							if (accessToken[1].statusCode === 200) {
								uni.setStorage({
									key: 'myinfo',
									data: accessToken[1].data.data,
									success: function() {
										uni.reLaunch({
											url: 'pages/index/index'
										})
									}
								});

							}
						})
					}
					if (refresh_expires_time - parseInt(timestamp) < 43200) {
						uni.showToast({
							title: '登录已过期',
							icon: none
						})
						this.$logout();
					}



				}
			});
			// #ifdef APP-PLUS  
			const _self = this;
			const _handlePush = function(message) {
				// TODO  
				let natUrl = message.payload
				uni.navigateTo({
				url: natUrl  
				});
			};
			plus.push.addEventListener('click', _handlePush);
			plus.push.addEventListener('receive', _handlePush);
			// #endif  
		},
		onShow: function() {},
		onHide: function() {}
	}
</script>

<style>
	/*每个页面公共css */
	/* uni-rich-text img {
		max-width: 100% !important;
		} */
	/* .nothingImg {
			width: 600rpx;
			height: 400rpx;
			margin: 0 auto;
			margin-top: 200rpx;
		} */
	// #ifndef APP-PLUS-NVUE
	.nothingImg {
		width: 600rpx;
		height: 400rpx;
		margin: 0 auto;
		margin-top: 200rpx;
	}

	// #endif
</style>
