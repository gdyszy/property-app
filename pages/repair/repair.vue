<template>
	<view>
		<view class="box">
			<view class="head">报修填报</view>
			<view class="title">住户信息</view>
			<view class="msg">
				<view class="text">住户号<i style="color: #d93232;">*</i></view>
				<view class="pickerSelect">
					<view class="text2">
						{{house_name}}
					</view>
					<image src="../../static/images/index/btn_12.png" mode="scaleToFill"
						style="width: 28rpx; height: 28rpx; margin-left: 6rpx; margin-top: 5rpx;"></image>
				</view>
			</view>
			<view class="title">报修信息</view>
			<view class="msg">
				<view class="text">报修人<i style="color: #d93232;">*</i></view>
				<input type="text" placeholder-style="color:#b3b3b3" v-model="name" :placeholder="namePlaceHolder"
					@focus="namePlaceHolder=''" @blur="name==''?namePlaceHolder='请输入报修人姓名':''" />
			</view>
			<view class="msg">
				<view class="text">联系方式<i style="color: #d93232;">*</i></view>
				<input type="number" placeholder-style="color:#b3b3b3" v-model="tel" maxlength="11"
					@focus="telPlaceHolder=''" @blur="tel==''?telPlaceHolder='请输入报修人联系方式':''"
					:placeholder="telPlaceHolder" />
			</view>
			<view class="msg">
				<view class="text">预约日期<i style="color: #d93232;">*</i></view>
				<view class="pickerSelect">
					<view class="text2">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view style="color:#4d4d4d;">{{date}}</view>
						</picker>
					</view>
					<image src="../../static/images/index/btn_12.png" mode="scaleToFill"
						style="width: 28rpx; height: 28rpx; margin-left: 6rpx; margin-top: 5rpx;"></image>
				</view>
			</view>
			<view class="msg">
				<view class="text">预约时间<i style="color: #d93232;">*</i></view>
				<view class="pickerSelect">
					<view class="text2">
						<picker mode="time" :value="time" start="00:00" end="24:00" @change="bindTimeChange">
							<view style="color:#4d4d4d;">{{time}}</view>
						</picker>
					</view>
					<image src="../../static/images/index/btn_12.png" mode="scaleToFill"
						style="width: 28rpx; height: 28rpx; margin-left: 6rpx; margin-top: 5rpx;"></image>
				</view>
			</view>
			<view class="msg">
				<view class="text">报修类型<i style="color: #d93232;">*</i></view>
				<view class="pickerSelect">
					<view class="text2">
						<picker @change="bindPickerChange" :value="PickIndex" :range="selectMsg" rangeKey="name">
							<view v-if="!repair_category_id" style="color: #b3b3b3;">请选择</view>
							<view v-if="repair_category_id" style="color:#4d4d4d;">{{selectMsg[PickIndex].name}}</view>
						</picker>
					</view>
					<image src="../../static/images/index/btn_12.png" mode="scaleToFill"
						style="width: 28rpx; height: 28rpx; margin-left: 6rpx; margin-top: 5rpx;"></image>
				</view>
			</view>
			<view class="textareaBox">
				<view class="textareaBox_top">
					<view class="explain">报修说明<i style="color: #d93232;">*</i></view>
					<view class="explain_num">{{ remnant }}/140</view>
				</view>
				<textarea @focus="desPlaceHolder=''" @blur="des==''?desPlaceHolder='请简要描述故障情况':''" maxlength='140'
					@input='descInput' v-model="des" :placeholder="desPlaceHolder" placeholder-style="color:#b3b3b3" />
			</view>
			<view class="textareaBox" style="margin-bottom: 40rpx;">
				<view class="textareaBox_top">
					<view class="explain">相关图片<i style="color: #d93232;">*</i></view>
					<view class="explain_num">{{ photoCount }}/4</view>
				</view>
				<view class="text3">添加故障相关图片</view>
				<easyUpload ref='upload' :dataList="imageList" :uploadUrl="uploadUrl" :uploadCount="4"
					@successImage="successImage" :uploadIcon='uploadIcon' :clearIcon='clearIcon' @imgCount='imgCount'
					:autoUpload='false' />
			</view>
		</view>
		<view class="btn" style="position: static;" @tap='submit'>提交</view>
		<loading ref="loading" title="正在提交"></loading>
	</view>
</template>

<script>
	import easyUpload from '../../components/easyUpload/easy-upload.vue'
	import loading from '../../components/wyb-loading/wyb-loading.vue'
	export default {
		components: {
			easyUpload,
			loading
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				selectMsg:[],
				PickIndex: 0,
				repair_category_id:'',
				date: currentDate,
				remnant: 0,
				imageList: [],
				category: 'image',
				uploadIcon: '../../static/images/repair/btn_02_add.png',
				clearIcon: '../../static/images/repair/btn_03_del.png',
				uploadUrl: this.$websiteUrl + '/v1/uploads',
				name: '',
				tel: '',
				des: '',
				house_code: '',
				photos: [],
				photoStr: '',
				photoCount: 0,
				time: '',
				namePlaceHolder: '请输入报修人姓名',
				telPlaceHolder: '请输入报修人联系方式',
				desPlaceHolder: '请简要描述故障情况',
				house_name: ''
			}
		},
		onShow() {
			this.time = this.getTime()
		},
		onLoad() {
			//this.getLogin();
			this.houseList()
			this.getCategory()
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		watch: {
			// photos(newVal, oldVal) {
			// 	this.photoCount = newVal.length
			// }
		},
		methods: {
			bindPickerChange: function(e) {
				this.PickIndex = e.target.value
				this.repair_category_id = this.selectMsg[e.target.value].id
				
			},
			bindDateChange: function(e) {
				this.date = e.target.value
			},
			bindTimeChange: function(e) {
				this.time = e.detail.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 2;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			getTime() {
				const date = new Date();
				let hour = date.getHours();
				let second = date.getSeconds();

				hour = hour > 9 ? hour : '0' + hour;
				second = second > 9 ? second : '0' + second
				return hour + ':' + second
			},
			descInput(e) {
				this.remnant = e.detail.value.length
			},
			successImage(e) {
				this.photos.push(e.data);
				this.photoStr = this.photos.join()
				if (this.photoCount == this.photos.length) {
					this.sub()
				}
			},
			imgCount(num) {
				this.photoCount = num.length
			},
			//房产列表
			houseList() {
				this.request({
					url: '/v1/properties?handler=house_kv',
					method: 'GET'
				}).then((res) => {
					if (!res.code === 200) {
						uni.showToast({
							title: res.desc,
							icon: 'none',
							duration: 2000
						})
					}
					let obj = res.data;
					for (let key in obj) {
						this.house_code = uni.getStorageSync('userInfo').house_code
						this.house_name = obj[uni.getStorageSync('userInfo').house_code]
					}
				})
			}, //房产列表
			getCategory() {
				let _this = this;
				_this.request({
					url: '/v1/repair_category',
					method: 'GET'
				}).then((res) => {
					let objs = res.data;
					if(objs.length>0){
						_this.repair_category_id = objs[0].id;
						_this.selectMsg = objs
						
					}
					
				})
			},
			//提交
			async submit() {
				const c_mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //判断手机号码正则
				if (!c_mobile.test(this.tel)) {
					uni.showToast({
						title: '请输入正确手机号码',
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (this.des === "") {
					uni.showToast({
						title: '请输入报修说明',
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (this.photoCount === 0) {
					uni.showToast({
						title: '请添加故障图片',
						icon: 'none',
						duration: 2000
					})
					return
				}
				if (this.name === '') {
					uni.showToast({
						title: '请输入报修人姓名',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.$refs.loading.showLoading()
				await this.$refs.upload.unifiedUpload()
				this.photoStr = this.photos.join()
			},
			sub() {
				if (this.photoStr == '') {
					uni.showToast({
						title: '请上传图片',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.request({
					url: '/v1/repairs',
					method: 'POST',
					data: {
						desc: this.des,
						tel: this.tel,
						name: this.name,
						photo: this.photoStr,
						subscribe_date: this.date,
						subscribe_time: this.time,
						house_code: this.house_code,
						repair_category_id:this.repair_category_id
					}
				}).then((res) => {
					this.$refs.loading.hideLoading()
					if (res.code != 200) {
						uni.showToast({
							title: res.desc,
							icon: 'none',
							duration: 2000
						})
					} else {
						uni.showModal({
							title: '提示',
							content: res.desc,
							showCancel: false,
							cancelColor: "#262626",
							success: function(res) {
								if (res.confirm) {
									uni.navigateBack({
										delta: 1
									})
								}
							}
						})
					}

				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import '../../common/common.css';

	.pickerSelect {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.text2 {
		font-size: 30rpx;
		color: #B3B3B3;
	}

	.textareaBox {
		width: 100%;
		border-bottom: 1px solid #e6e6e6;
		padding-bottom: 34rpx;

		.textareaBox_top {
			width: 100%;
			display: flex;
			justify-content: space-between;
			margin-top: 34rpx;

			.explain {
				display: flex;
				font-size: 30rpx;
			}

			.explain_num {
				color: #b3b3b3;
				font-size: 30rpx;
			}
		}

		textarea {
			margin-top: 26rpx;
			font-size: 30rpx;
			color: #4d4d4d;
			line-height: 44rpx;
			width: 100%;
			height: 116rpx;
		}

		textarea::-webkit-input-placeholder {
			font-size: 30rpx;
			color: #b3b3b3;
		}

		.text3 {
			font-size: 30rpx;
			color: #B3B3B3;
			margin-top: 26rpx;
		}
	}
</style>
