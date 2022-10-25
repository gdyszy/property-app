<template>
	<view class="content">
		<uni-nav-bar left-icon="back" @clickLeft="goBack" title="消息管理" fixed="true" statusBar="true"/>
		<view class="layout-content">
			<view class="layout-row">
				<view style="width: 100rpx;">标题</view>
				<input type="text" class="input-boder" placeholder="请输入标题" v-model="title"/>
			</view>
			
			<view class="layout-row">
				<view style="width: 100rpx;">内容</view>
				<textarea type="text" class="input-boder" placeholder="请输入消息" v-model="msg"/>
			</view>
			
			<view class="layout-row">
				<view>类型</view>
				<view style="flex: 1;"/>
				<radio-group @change="selectMsgType">
					<radio style="width: 200rpx;" value="0" checked="true">系统消息</radio>
					<radio style="width: 200rpx;" value="1">通知消息</radio>
				</radio-group>
				<view style="flex: 1;"/>
			</view>
			
			<view class="layout-row">
				<view>状态</view>
				<view style="flex: 1;"/>
				<radio-group @change="selectStateType">
					<radio style="width: 200rpx;" value="1" checked="true">显示</radio>
					<radio style="width: 200rpx;" value="0">隐藏</radio>
				</radio-group>
				<view style="flex: 1;"/>
			</view>
			
			<view class="layout-row">
				<view style="width: 100rpx;">人员</view>
				<input type="text" class="input-boder" @click="openSelect" v-model="selectUserName"
					placeholder="请选择人员" disabled="true" />
			</view>
		</view>
		
		<button type="primary" class="btn" @tap="addMsg">提交</button>
		<tki-tree ref="tkitree" :intIsShow="false" :range="userData" rangeKey="name" idKey="id"
			confirmColor="#5089f9" @confirm="treeConfirm"></tki-tree>
	</view>
</template>
<script>
	import tkiTree from "@/components/tki-tree/tki-tree.vue"
	
	export default {
		data() {
			return {
				title:"",
				msg:"",
				type:0,
				status:0,
				selectUserName:"",
				member_id:0,
				userData:[],
			}
		},
		components: {tkiTree},
		onLoad() {
			
		},
		methods: {
			selectMsgType(event){
				this.type = event.target.value;
			},
			selectStateType(event){
				this.status = event.target.value;
			},
			openSelect(){
				this.getUser();
				this.$refs.tkitree._show();
			},
			treeConfirm(e){
				if(e.length > 0){
					this.selectUserName = e[0].name;
					this.member_id = e[0].id;
				}
			},
			addMsg(){
				if(this.title.length == 0){
					uni.showToast({
						title:'请输入标题',
						icon:'none'
					})
					return;
				}
				if(this.msg.length == 0){
					uni.showToast({
						title:'请输入消息内容',
						icon:'none'
					})
					return;
				}
				let data = {
					title: this.title,
					msg: this.msg,
					type: this.type,
					status: this.status,
					member_id: this.member_id,
					community_code: uni.getStorageSync('community_code')
				};
				this.request({
					url:"/mobile/msg",
					data:data,
					method:'POST'
				}).then(res =>{
					if(res.code == 200){
						uni.showToast({
							title:res.desc,
							icon:'none'
						});
						uni.navigateBack();
					}else{
						uni.showToast({
							title:res.desc,
							icon:'none'
						});
					}
				});
			},
			goBack(){
				uni.navigateBack()
			},
			getUser(){
				let data = {
					handler: "member",
					page:1,
					limit:10,
					'filter[community_code]': uni.getStorageSync('community_code')
				};
				this.request({
					url:"/mobile/msg",
					data:data
				}).then(res => {
					this.userData = res.data.data;
				})
			}
		}
	}
</script>

<style lang="scss">
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	 
	.layout-content{
	 	width: 90%;
		
	 	view {
	 		font-size: 35rpx;
	 	}
	}
	 
	 .layout-row{
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-top: 35rpx;
	 }
	 
	 .input-boder{
		font-size: 28rpx;
		padding: 10rpx 15rpx 10rpx 15rpx;
		width: 100%;
		border: 3rpx solid #e5e5e5;
		border-radius: 10rpx;
	 }
	 
	 .btn {
	 	color: #fff;
	 	width: 100%;
	 	height: 100rpx;
	 	position: fixed;
	 	bottom: 0rpx;
		border-radius: 0rpx;
	 	background-color: #2273f6;
	 }
</style>
