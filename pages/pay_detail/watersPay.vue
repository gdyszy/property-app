<template>
	<view>
		<view class="box">
			<view class="head">缴费信息</view>
			<view class="title">基本信息</view>
			<view class="textInput">
				<view class="text_left">客户地址</view>
				<view class="text_right">{{address}}{{ infoList.name }} {{ infoList.building[0] }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">所属年月</view>
				<view class="text_right">{{ billing_time }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">抄表周期</view>
				<view class="text_right">{{ infoList.month }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">用水类型</view>
				<view class="text_right">居民生活用水</view>
			</view>
			<view class="textInput">
				<view class="text_left">上次抄表日期</view>
				<view class="text_right">{{ infoList.start_time | timeStamp }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">本次抄表日期</view>
				<view class="text_right">{{ infoList.end_time | timeStamp }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">上期抄码</view>
				<view class="text_right">{{ infoList.last_time_ton }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">本期抄码</view>
				<view class="text_right">{{ infoList.now_time_ton}}</view>
			</view>
			<view class="title" style="margin-top: 68rpx;">费用信息</view>
			<view class="textInput">
				<view class="text_left">合计金额</view>
				<view class="text_right">¥{{ infoList.expense }}</view>
			</view>

		<view class="textInput">
			<view class="text_left">水费</view>
			<view class="text_right">{{ infoList.water_fee }}</view>
		</view>
		<view class="textInput">
			<view class="text_left">污水处理费</view>
			<view class="text_right">{{ infoList.sewage_total_fee }}</view>
		</view>
		<view class="textInput">
			<view class="text_left">垃圾处理费</view>
			<view class="text_right">{{ infoList.trash_fee }}</view>
		</view>
		<view class="textInput">
			<view class="text_left">违约金</view>
			<view class="text_right">{{ infoList.other_fee }}</view>
		</view>
			<!-- 	<view class="textInput" style="padding-bottom: 60rpx;" v-if="infoList.status!=0">
				<view class="text_left">缴费时间</view>
				<view class="text_right">{{ infoList.update_time | timeStamp }}</view>
			</view> -->
			<view class="" v-if="infoList.status!==0" style="padding-bottom: 60rpx;">
				<view class="textInput">
					<view class="text_left">缴费时间</view>
					<view class="text_right">{{ infoList.expiration_time }}</view>
				</view>
				<view class="textInput">
					<view class="text_left">支付方式</view>
					<view class="text_right">{{ infoList.pay_type }}</view>
				</view>
			</view>

		</view>
		<view class="btn" @tap='pay' v-if="infoList.status===0">确认缴费</view>
		<wyb-loading ref="loading" />
	</view>
</template>

<script>
	import {
		timeStamp
	} from '../../utils/time.js'
	import wybLoading from '@/components/wyb-loading/wyb-loading.vue'
	export default {
		data() {
			return {
				infoList: {},
				orderInfo: {},
				pay_type: 0,
				address:'',
				billing_time:'',
				waters_fee:'',
				sewage_fee:'',
				trash_fee:'',
				other_fee:''
			}
		},
		components: {
			wybLoading
		},
		onLoad(option) {
			//获取id
			// console.log(this.infoList)
			this.watersInfo(option.id)
			this.loginWay()
			this.address = uni.getStorageSync('userInfo').address
		},
		filters: {
			timeStamp
		},
		methods: {
			//水费详情
			watersInfo(id) {
				this.request({
					url: '/v1/waters/' + id,
					method: 'GET'
				}).then((res) => {
					if (!res.code === 200) {
						uni.showToast({
							title: res.desc,
							icon: 'none',
							duration: 2000
						})
					}
					this.infoList = res.data
					let billingTime = this.infoList.expiration_time.split('-')
					this.billing_time = billingTime[0]+'/'+billingTime[1]
				})
			},
			//缴费
			async pay() {
				this.$refs.loading.showLoading()
				let datas = {
					total_fee: this.infoList.expense,
					body: this.infoList.title,
					out_trade_no: this.infoList.out_trade_no,
					ids: this.infoList.id,
					type: 3,
					pay_type: this.pay_type
				}
				await this.request({
					url: '/v1/wechat_pay',
					method: 'POST',
					data: datas
				}).then((res) => {
					this.$refs.loading.hideLoading()
					if (res.code === 204) {
						if (this.pay_type === 2 ) {
							uni.requestPayment({
								provider: "wxpay",
								timeStamp: res.data.timeStamp,
								nonceStr: res.data.nonceStr,
								package: res.data.package,
								signType: res.data.signType,
								paySign: res.data.paySign,
								success: (e) => {
									uni.navigateTo({
										url: '../LivingExpenses/LivingExpenses'
									})
								},
								fail: (err) => {
									console.log('失败', err)
									uni.showToast({
										title: "支付失败",
										icon: 'none',
										duration: 2000
									})
								}
							})
						}else if (this.pay_type === 3) {
							uni.requestPayment({
								provider: "wxpay",
								orderInfo:res.data,
								success: (e) => {
									uni.navigateTo({
										url: '../LivingExpenses/LivingExpenses'
									})
								},
								fail: (err) => {
									uni.showToast({
										title: "支付失败",
										icon: 'none',
										duration: 2000
									})
								}
							})
						} else if (this.pay_type === 4) {
							window.location.href = res.data.mweb_url + `&redirect_url=${this.$websiteUrl}/h5`
						} else if (this.pay_type === 1) {
							WeixinJSBridge.invoke(
								'getBrandWCPayRequest', {
									"appId": res.data.appId, //公众号ID，由商户传入     
									"timeStamp": res.data.timeStamp, //时间戳，自1970年以来的秒数     
									"nonceStr": res.data.nonceStr, //随机串     
									"package": res.data.package,
									"signType": res.data.signType, //微信签名方式：     
									"paySign": res.data.paySign //微信签名 
								},
								function(res) {
									if (res.err_msg == "get_brand_wcpay_request:ok") {
										uni.navigateTo({
											url: '../LivingExpenses/LivingExpenses'
										})
									} else {
										uni.showToast({
											title: "支付失败",
											icon: 'none',
											duration: 2000
										})
									}
								});
						}
					} else {
						uni.showToast({
							title: res.desc,
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			loginWay() {
				// #ifdef H5
				var ua = window.navigator.userAgent.toLowerCase()
				if (ua.match(/MicroMessenger/i) == 'micromessenger') {
					this.pay_type = 1 // 微信中打开
				} else {
					this.pay_type = 4 // 普通浏览器中打开
				}
				// #endif
				// #ifdef MP-WEIXIN
				this.pay_type = 2
				// #endif
				// #ifdef APP-PLUS
				this.pay_type = 3
				// #endif
				// console.log(this.pay_type)
			}
		}
	}
</script>

<style>
	page {
		background-color: #f7f8fa;
	}
</style>
<style scoped lang="scss">
	@import '../../common/common.css';

	.bo {
		padding-bottom: 60rpx;
	}
</style>
