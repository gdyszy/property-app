<template>
	<view>
		<view class="box">
			<view class="head">
				成员信息
				<view class="ber_del" @tap='delBar()' v-if="msg.owner_type != 1">删除</view>
			</view>
			<view class="title">基本信息</view>
			<view class="textInput">
				<view class="text_left">姓名</view>
				<view class="text_right">{{ msg.name }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">性别</view>
				<view class="text_right">{{ sex }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">年龄</view>
				<view class="text_right">{{ msg.age }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">身份证号</view>
				<view class="text_right">{{ msg.identity_id }}</view>
			</view>
			<view class="textInput">
				<view class="text_left">成员编号</view>
				<view class="text_right">{{ msg.id }}</view>
			</view>
			<view class="title" style="margin-top: 68rpx;">联系信息</view>
			<view class="textInput" style="padding-bottom: 60rpx;">
				<view class="text_left">手机号码</view>
				<view class="text_right">{{ msg.tel }}</view>
			</view>
		</view>
		<view class="edit" @tap="edit()" v-if="ownerType == 1">编辑</view>
		<view class="edit" @tap="edit()" v-if="ownerType !== 1">查看详细</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: {},
				sex: '',
				berId: '',
				ownerType:1
			}
		},
		onLoad(option) {
			this.berId=option.id
			this.berMsg(option.id)
			this.ownerType = uni.getStorageSync('userInfo').owner_type;
		},
		methods: {
			//成员信息
			berMsg(id){
					this.request({
						url: '/v1/members/'+id,
						method: 'GET'
					}).then((res)=>{
						if(!res.code === 200){
							uni.showToast({
								title: res.desc,
								icon: 'none',
								duration:2000
							})
						}
						this.msg = res.data
						this.msg.gender===0?this.sex='女':this.sex='男'
					});
				
			},
			//删除成员
			delBar(){
				let that =this
				if(uni.getSystemInfoSync().platform == 'ios'){
					uni.showModal({
					    title: '提示',
					    content: '确认删除',
					    success: function (res) {
					        if (res.confirm) {
									that.request({
										url: '/v1/members/'+that.berId,
										method: 'DELETE'
									}).then((res)=>{
										uni.navigateBack({
											delta:2
										})
									})
					        } else if (res.cancel) {
					            
					        }
					    }
					});
				}else{
					uni.showModal({
					    title: '提示',
					    content: '确认删除',
						confirmText:'取消',
						cancelText:'确认',
						confirmColor:'#262626',
					    success: function (res) {
					        if (res.confirm) {
									
					        } else if (res.cancel) {
					            that.request({
					            	url: '/v1/members/'+that.berId,
					            	method: 'DELETE'
					            }).then((res)=>{
					            	uni.navigateBack({
					            		delta:2
					            	})
					            })
					        }
					    }
					});
				}
				
				
				
			},
			//编辑成员
			edit(){
				uni.navigateTo({
					url:'../addBer/editBer?id='+this.berId
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #F7F8FA;
	}
</style>
<style lang="scss" scoped>
	@import '../../common/common.css';
	.ber_del {
		font-size: 30rpx;
		color: #fbaa1e;
		font-weight: normal;
	}
	.edit {
		width: 100%;
		height: 108rpx;
		margin-top: 16rpx;
		background-color: #FFFFFF;
		text-align: center;
		line-height: 108rpx;
		font-size: 34rpx;
		color: #28b07c;
	}
</style>
