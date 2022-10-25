<template>
	<view>
		<view class="head">
			<view class="head_box">
				<view class="head_left">
					<image src="../../static/images/familyBer/ico_01.png" mode="scaleToFill" style="width: 28rpx; height: 28rpx; margin-right: 14rpx;" />
					<view class="ber_num">家庭成员数：{{ allBerNum }}</view>
				</view>
				<view class="head_right" @tap='addBer' v-if="ownerType == 1">
					<image src="../../static/images/familyBer/btn_01.png" mode="scaleToFill" style="width: 24rpx; height: 24rpx; margin-right: 10rpx;" />
					<view class="ber_new">新建</view>
				</view>
			</view>
		</view>
		<BerList :berList='berList' @check='check' />
		<view class="nothingImg" v-if="berList.length == 0">
			<image src="../../static/common/nothing.png" mode="aspectFill" style="width: 100%; height: 100%;"></image>
		</view>
		<view class="noMore">没有更多了</view>
	</view>
</template>

<script>
	import BerList from '../../components/familyBer/ber_list.vue'
	export default {
		components:{
			BerList
		},
		data() {
			return {
				berList: [], //家庭成员列表
				allBerNum: 0 ,//家庭成员总数
				ownerType:1
			}
		},
		onLoad() {
				this.getBerList();
				this.ownerType = uni.getStorageSync('userInfo').owner_type;
		},
		onNavigationBarButtonTap(e) {
			if(e.index === 0) {
				uni.navigateTo({
					url:'../addBer/addBer'
				})
			}
		},
		methods: {
			check(id){
				uni.navigateTo({
					url:'../berDetail/berDetail?id='+id
				})
			},
			addBer(){
				uni.navigateTo({
					url:'../addBer/addBer'
				})
			},
			//家庭成员列表
			getBerList(){
				this.request({
					url: '/v1/members',
					method: 'GET'
				}).then((res)=>{
					this.berList = res.data
					if(res.data.length){
						this.allBerNum =res.data.length
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.head {
		border-bottom: 1px solid #e6e6e6;
		.head_box {
			width: 690rpx;
			height: 68rpx;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.head_left {
				display: flex;
				align-items: center;
				.ber_num {
					font-size: 28rpx;
					color: #808080;
				}
			}
			.head_right {
				display: flex;
				align-items: center;
				.ber_new {
					font-size: 28rpx;
					color: #3a90e1;
				}
			}
		}
	}
	.noMore {
		font-size: 26rpx;
		color: #b3b3b3;
		margin-top: 25rpx;
		width: 100%;
		text-align: center;
	}
</style>
