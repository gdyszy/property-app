<template>
	<view class="sign">
		<image src="/static/images/index/maskGroup.png" class="signBg"/>
		<view class="navTitle">
			<image src="/static/images/index/Btn_NaviBar_Goback.png" @click="goback"/>
			<text>签到活动</text>
		</view>
		<youlanSignIn type="sign" @change="signDate" :signDay="signDay" :signtapNum="isSignToday" :isPop="isPop"/>
	</view>
</template>

<script>
import youlanSignIn from './signComponent.vue';
export default{
	components: {
		youlanSignIn
	},
	data(){
		return {
			comCode:'',
			signDay:{},
			isSignToday:'',
			isPop:false,
		}
	},
	onLoad(){
		this.comCode = uni.getStorageSync('userInfo').community_code;
		this.getSignList();
	},
	methods:{
		showMsg(title){
			uni.showToast({
				title,
				icon: 'success'
			});
		},
		goback(){
            uni.navigateBack({delta:1});
		},
		async signDate(day){
      if(day.indexOf("success") == 0){
        this.isSignToday = day.slice(7);
        this.isPop = true;
        return true
      }
			let res = await this.request({
				method:'POST',
				url:'/v1/signs',
				headers:{'Content-Type':'application/x-www-form-urlencoded'},
				data:{
					community_code:this.comCode,
					day
				}
			})
			if(res.code == 200){
				this.isSignToday = res.data.can_append_number;
				this.isPop = true;
			}else{
				this.showMsg(res.desc);
			}
		},
		async getSignList(){
			let res = await this.request({
				url:'/v1/signs',
				data:{
					community_code:this.comCode
				}
			});
			if(res.code == 200){
				this.signDay = res.data;
			}else{
				uni.showModal({
					title: '提示信息',
					content: '现在没有进行中的活动签到',
					confirmText: '确定',
					confirmColor: '#16bcc7',
					showCancel:false,
					success(res) {
						if (res.confirm) {
							console.log('333');
						}
					}
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
  $font-family:"Arial, "Helvetica Neue", Helvetica, sans-serif";
.sign{
	position: relative;
}
.signBg{
	width: 100%;
	height: 630rpx;
	position: absolute;
	top: 0;
	z-index: -1;
}
.navTitle{
	width:700rpx;
	height: 88rpx;
	margin: auto;
	// margin-top: 120rpx;
	margin-bottom: 30rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	top: 120rpx;
	image{
		width: 44rpx;
		height: 44rpx;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}
	text{
		font-family: $font-family;
		color: #e8f9fa;
		font-size: 34rpx;
		height: 88rpx;
		line-height: 88rpx;
	}
}

</style>
