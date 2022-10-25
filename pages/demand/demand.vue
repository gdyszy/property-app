<template>
		<view>
			<view class="box" style="padding-bottom: 70rpx;">
				<view class="head">发布交易</view>
				<view class="title">基本信息</view>
				<view class="msg">
					<view class="text">交易类型<i style="color: #d93232;">*</i></view>
					<view class="select">
						<view class="select_option" :class="{'selected':type === 0}" @tap='selectType(0)'>
							<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin-right: 4rpx;" v-if="type === 1" />
							<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin-right: 4rpx;" v-else />
							<view>出售</view>
						</view>
						<view class="select_option" :class="{'selected':type === 1}" @tap='selectType(1)'>
							<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin: 0 4rpx 0 24rpx;" v-if="type === 0"/>
							<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin: 0 4rpx 0 24rpx;" v-else />
							<view>求购</view>
						</view>
					</view>
				</view>
				<view class="msg">
					<view class="text">价格类型<i style="color: #d93232;">*</i></view>
					<view class="select">
						<view class="select_option" :class="{'selected':priceS === 0}" @tap='selectPrice(0)'>
							<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin-right: 4rpx;" v-if="priceS === 1" />
							<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin-right: 4rpx;" v-else />
							<view>定价</view>
						</view>
						<view class="select_option" :class="{'selected':priceS === 1}" @tap='selectPrice(1)'>
							<image src="../../static/images/familyBer/btn_03_nor.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin: 0 4rpx 0 24rpx;" v-if="priceS === 0"/>
							<image src="../../static/images/familyBer/btn_02_sel.png" mode="aspectFill" style="width: 44rpx; height: 44rpx; margin: 0 4rpx 0 24rpx;" v-else />
							<view>区间</view>
						</view>
					</view>
				</view>
				<view class="msg">
					<view class="text">最低价格<i style="color: #d93232;">*</i></view>
					<input type="number" placeholder-style="color:#b3b3b3" v-model="floorPrice" :placeholder="Bplaceholder" @focus="Bplaceholder=''" @blur="floorPrice==''?Bplaceholder='请输入最低价格':''"/>
				</view>
				<view class="msg" v-if="showCeiling">
					<view class="text">最高价格<i style="color: #d93232;">*</i></view>
					<input type="number" placeholder-style="color:#b3b3b3" v-model="ceilingPrice" :placeholder="Tplaceholder" :disabled="disabled"  @focus="Tplaceholder=''" @blur="ceilingPrice==''?Tplaceholder='请输入最低价格':''"/>
				</view>
				<view class="msg" style="border: 0;">
					<view class="text">交易说明<i style="color: #d93232;">*</i></view>
					<view class="text">{{textNum}}/140</view>
				</view>
				<textarea value="" placeholder-style="color:#b3b3b3" :placeholder="desPalceholder" maxlength='140' @input='descInput' v-model="transactionDes"  @focus="desPalceholder=''" @blur="transactionDes==''?desPalceholder='请简要描述交易信息':''" />
				<view class="msg" style="border: 0;">
					<view class="text">相关图片</view>
					<view class="text">{{photoCount}}/4</view>
				</view>
				<view class="text3">添加交易物品相关图片</view>
					<easyUpload
						ref ='upload'
						:dataList="imageList" 
						:uploadUrl="uploadUrl" 
						:uploadCount="4"
						@successImage="successImage"
						:uploadIcon='uploadIcon'
						:clearIcon='clearIcon'
						@imgCount='imgCount'
						:autoUpload = 'false'
						/>
					<view class="title" style="padding-top: 32rpx; border-top: 1rpx solid #E6E6E6;">联系信息</view>
				<view class="msg">
					<view class="text">联系人<i style="color: #d93232;">*</i></view>
					<input type="text" placeholder-style="color:#b3b3b3" v-model="contacts" :placeholder="contactPlaceholder" cursor-spacing="80" @focus="contactPlaceholder=''" @blur="contacts==''?contactPlaceholder='请输入联系人':''" />
				</view>
				<view class="msg">
					<view class="text">联系电话<i style="color: #d93232;">*</i></view>
					<input type="text" placeholder-style="color:#b3b3b3" v-model="tel" :placeholder="telPlaceholder" maxlength="11" cursor-spacing="50" @focus="telPlaceholder=''" @blur="tel==''?telPlaceholder='请输入联系方式':''"/>
				</view>
			</view>
			<view class="btn1" @tap="add()">发布</view>
		</view>	
		
</template>

<script>
	import {Base64} from '../../utils/base64.js'
	import easyUpload from '../../components/easyUpload/easy-upload.vue'
export default {
components:{
	easyUpload
},
data() {
	return {
		type: 0,
		typeClass: '出售',
		priceS: 0,
		priceClass: '定价',
		floorPrice: '',
		ceilingPrice: '',
		transactionDes: '',
		textNum: 0,
		imageList: [],
		uploadUrl: this.$websiteUrl+'/v1/uploads',
		category: 'image',
		uploadCount: 4,
		photos: [],
		photoStr: '',
		uploadIcon: '../../static/images/repair/btn_02_add.png',
		clearIcon: '../../static/images/repair/btn_03_del.png',
		tel: "",
		contacts: '',
		disabled: true,
		showCeiling:false,
		photoCount: 0,
		Bplaceholder: '请输入最低价格',
		Tplaceholder: '请输入最高价格',
		desPalceholder: '请简要描述交易信息',
		contactPlaceholder: '请输入联系人',
		telPlaceholder: '请输入联系方式'
	};
},
methods: {
	selectType(n){
		this.type = n
		if(n === 0){
			this.typeClass = '出售'
		}else{
			this.typeClass = '求购'
		}
	},
	selectPrice(n){
		this.priceS = n
		if(n === 0){
			this.priceClass = '定价'
			this.disabled = true
			this.showCeiling= false
		}else {
			this.disabled = false
			this.priceClass = '区间'
			this.showCeiling= true
		}
	},
	descInput(e){
		this.textNum = e.detail.value.length
	},
	successImage(e){
		this.photos.push(e.data);
		this.photoStr = this.photos.join()
		if(this.photoCount == this.photos.length){
			this.sub()
		}
	},
	sub(){
		this.request({
			url: '/v1/deals',
			method: 'POST',
			data: {
				peak_price: this.ceilingPrice,
				bottom_price: this.floorPrice,
				explain: this.transactionDes,
				photo: this.photoStr,
				price_type: this.priceClass,
				basic_type: this.typeClass,
				tel:this.tel,
				trader:this.contacts
			}
		}).then((res)=>{
			if(res.code === 200){
				uni.showToast({
					title: res.desc,
					icon: 'none',
					duration:2000
				})
				setTimeout(()=>{
					uni.reLaunch({
						url:'../market/market'
					})
				},1500)
			}else {
				uni.showToast({
					title: res.desc,
					icon: 'none',
					duration:2000
				})
			}
			
		})
	},
	imgCount(num){
		this.photoCount = num.length
	},
	async add(){
		if(this.priceS === 0){
			if(this.floorPrice ==''){
				// console.log('1',this.floorPrice,'21312')
				// uni.showToast({
				// 	title: '最低价不能为空！',
				// 	icon: 'none',
				// 	duration:2000
				// })
				return
			}else {
				var FloorPrice = /^-?\d*\.?\d+$/; // 数字正则
				let floor = this.floorPrice
				if(!FloorPrice.test(floor)){
					uni.showToast({
						title: '请填写正确价格！',
						icon: 'none',
						duration:2000
					})
					return
				}
			}
		}
		var FloorPrice = /^-?\d*\.?\d+$/; // 数字正则
		let floor = this.floorPrice
		let ceiling = this.ceilingPrice
		if(this.priceS === 1){
			if(floor === ''){
				// uni.showToast({
				// 	title: '最低价不能为空！',
				// 	icon: 'none',
				// 	duration:2000
				// })
				return
			}else if (ceiling === ''){
				uni.showToast({
					title: '最高价不能为空！',
					icon: 'none',
					duration:2000
				})
				return
			}else if (FloorPrice.test(floor) && FloorPrice.test(ceiling) && this.floorPrice >= this.ceilingPrice){
				uni.showToast({
					title: '最低价不能等于或大于最高价！',
					icon: 'none',
					duration:2000
				})
				return
			}else {
				if(!FloorPrice.test(floor)){
					uni.showToast({
						title: '请填写正确价格！',
						icon: 'none',
						duration:2000
					})
					return
				}else if(!FloorPrice.test(ceiling)){
					uni.showToast({
						title: '请填写正确价格！',
						icon: 'none',
						duration:2000
					})
					return
				}
			}
		}
		
		if(this.contacts == ''){
			uni.showToast({
				title: '请填写联系人！',
				icon: 'none',
				duration:2000
			})
			return
		}
		
		let tel2 = this.tel.replace(/\s*/g,"");
		const c_mobile = /^1(3|4|5|6|7|8|9)\d{9}$/;  //判断手机号码正则
		if(!c_mobile.test(tel2)){
			uni.showToast({
				title: '请输入正确手机号码',
				icon: 'none',
				duration:2000
			})
			return
		}
		if(this.priceS === 0){
			this.ceilingPrice = this.floorPrice
		}
		
		await this.$refs.upload.unifiedUpload()
		this.photoStr = this.photos.join()
		if(this.imageList.length == 0){
			this.sub()
		}
	},
	fixPrice(){
		this.priceS == 0?this.ceilingPrice = this.floorPrice:""
	}
 }
}
</script>

<style scoped lang="scss">
	@import '../../common/common.css';
	.select {
		display: flex;
		.select_option {
			display: flex;
			font-size: 30rpx;
			color: #b3b3b3;
		}
		.selected {
			display: flex;
			font-size: 30rpx;
			color: #808080;
		}
	}
	.code {
		width: 150rpx;
		height: 70rpx;
		background-color: #fbaa1e;
		color: #FFFFFF;
		font-size: 24rpx;
		margin-left: 24rpx;
		text-align: center;
		line-height: 70rpx;
	}
	.resend {
		width: 150rpx;
		height: 70rpx;
		background-color: #B3B3B3;
		color: #FFFFFF;
		font-size: 24rpx;
		margin-left: 24rpx;
		text-align: center;
		line-height: 70rpx;
	}
	textarea {
		width: 100%;
		border-bottom: 1rpx solid #e6e6e6;
		height: 200rpx;
	}
	.text3 {
		font-size: 30rpx;
		color: #B3B3B3;
	}
	.btn1 {
		width: 100%;
		height: 104rpx;
		text-align: center;
		line-height: 104rpx;
		color: #FFFFFF;
		font-size: 34rpx;
		background-color: #68cda2;
		// position: fixed;
		// bottom: 0;
		// left: 0;
	}
</style>