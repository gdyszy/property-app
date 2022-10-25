<template>
	<view class="repair-message">
		<view class="title">
			审核信息
		</view>
		<view class="detail">
			<!-- 待审核信息 -->
			<view class="user-info-title">
				用户信息
			</view>
			<view class="m10 fs30">
				用户名：{{userDetail.username}}
			</view>
			<view class="m10 fs30">
				手机号码：{{userDetail.tel}}
			</view>
			<view class="m10 fs30">
				注册时间：{{userDetail.create_time | timeStamp}}
			</view>

			<!-- 信息详情 -->

			<view class="user-info-title">
				用户详情
			</view>
			<view class="m10 fs30">
				所属小区：{{userDetail.community_code}}
			</view>
			<view class="m10 fs30">
				所属房产：{{userDetail.house_code}}
			</view>
			<view class="m10 fs30">
				成员名称：{{userDetail.name}}
			</view>
			<view class="m10 fs30">
				用户昵称：{{userDetail.nickname}}
			</view>
			<view class="m10 fs30">
				身份证号：{{userDetail.identity_id}}
			</view>
			<view class="m10 fs30">
				出生日期：{{userDetail.birth}}
			</view>
			<view class="m10 fs30">
				联系方式：{{userDetail.tel}}
			</view>
			<view class="m10 fs30">
				用户性别：{{userDetail.gender==0?'男':(userDetail.gender==1?'女':'')}}

			</view>
			<view class="m10 fs30">
				成员类型：
			</view>
			<view class="m10 fs30">
				备注：{{userDetail.remark}}
			</view>
			<view class="m10 fs30 mb20">
				状态：{{userDetail.is_audit==0?'未审核':(userDetail.is_audit==1?'审核通过':'审核未通过')}}
				<!--  -->
			</view>

			<!-- 审核按钮  -->
			<view  style="width: 100%;display: flex;" v-if="userDetail.is_audit==0">
				<view class="btn-row">
					<button type="primary"  @click="pass(userDetail.id)">通过</button>
				</view>
				<view class="btn-row">
					<button type="warn"  @click="noPass(userDetail.id)">不通过</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		timeStamp
	} from '../../../../utils/time.js'
	export default {
		data() {
			return {
				userInfo: [],
				userDetail: {},
				passStatus:{
					is_audit:1
				},
				npStatus:{
					is_audit:2
				}
			}
		},
		filters: {
			timeStamp
		},
		methods: {
			async getAdutiDetail(id) {
				this.request({
					url: '/mobile/audit/' + id,
					method: 'GET',
				}).then((res) => {
					this.userDetail = res.data
				});
			},

			pass(id) {
				this.request({
					url: '/mobile/audit/' + id,
					method: 'PUT',
					data:this.passStatus
				}).then((res) => {
					uni.navigateBack({

					})
					this.getAdutiDetail(id)
				});
			},
			noPass(id) {
				this.request({
					url: '/mobile/audit/' + id,
					method: 'PUT',
					data: this.npStatus
				}).then((res) => {
					uni.navigateBack({

					})
					this.getAdutiDetail(id)
				});
			},
		},
		onLoad(e) {
			// console.log(e)
			this.getAdutiDetail(e.id);
		}
	}
</script>

<style lang="scss">
	.repair-message {
		margin: 32rpx;

		.title {
			padding: 20rpx 0;
			font-size: 40rpx;
			font-weight: 700;
			border-bottom: 3rpx solid #e7e8e7;
		}

		.detail {
			.user-info-title {
				padding: 20rpx 0;
				font-size: 35rpx;
				font-weight: 700;
			}

			.check-btn {
				display: flex;
				padding: 100rpx;
				border-top: 3rpx solid #e7e8e7;
			}
		}

		.m10 {
			margin: 10rpx 0;
		}

		.fs30 {
			font-size: 30rpx;
			color: #6e7069
		}

		.mb20 {
			margin-bottom: 20rpx;
		}
	}
	.btn-row {
		width: 50%;
		margin-top: 25px;
		padding: 10px;
	}
</style>
