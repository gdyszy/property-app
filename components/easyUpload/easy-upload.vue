<template>
	<view>
		<view class="upload">
			<block v-for="(upload,index) in uploads" :key="index">
				<view class="uplode-file">
					<image v-if="types == 'image'" class="uploade-img" :src="upload" :data-src="upload" @tap="previewImage"></image>
					<image v-if="types == 'image'" class="clear-one-icon" :src="clearIcon" @tap="delImage(index)"></image>
					<video v-if="types == 'video'" class="uploade-img" :src="upload" controls>
						<cover-image v-if="types == 'video'" class="clear-one-icon" :src="clearIcon" @tap="delImage(index)"></cover-image>
					</video>
				</view>
			</block>
			<view v-if="uploads.length < uploadCount" :class="uploadIcon ? 'uploader-icon' : 'uploader-input-box'">
				<view v-if="!uploadIcon" class="uploader-input" @tap="chooseUploads"></view>
				<image v-else class="image-cion" :src="uploadIcon" @tap="chooseUploads"></image>
			</view>
		</view>	
		<!-- <button type="primary" v-if="types == 'image' && !autoUpload" @tap="unifiedUpload">上传</button> -->
	</view>
</template>

<script>
	import { Base64 } from '../../utils/base64.js'
	export default{
		props: {
			types: {
				type: String,
				default: 'image'
			},
			dataList: {
				type: Array,
				default: function() {
					return []
				}
			},
			clearIcon: {
				type: String,
				default: 'http://img1.imgtn.bdimg.com/it/u=451604666,2295832001&fm=26&gp=0.jpg'
			},
			uploadIcon: {
				type: String,
				default: ''
			},
			uploadUrl: {
				type: String,
				default: ''
			},
			deleteUrl: {
				type: String,
				default: ''
			},
			uploadCount: {
				type: Number,
				default: 1
			},
			//上传图片大小 默认3M
			upload_max: {
				type: Number,
				default: 3
			},
			autoUpload: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				//上传的图片地址
				uploadImages: [],
				//展示的图片地址
				uploads: [],
				// 超出限制数组
				exceeded_list: [],
			}
		},
		watch:{
			dataList:{
				handler(val){
					this.uploads = val;
				},
				immediate: true
			}
		},
		methods:{
			previewImage (e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.dataList
				})
			},
			chooseUploads(){
				switch (this.types){
					case 'image': 
						uni.chooseImage({
							count: this.uploadCount - this.uploads.length, //默认9
							sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
							sourceType: ['album', 'camera'], //从相册选择
							success: (res) => {
								for(let i = 0; i< res.tempFiles.length; i++){
									if(Math.ceil(res.tempFiles[i].size / 1024) < this.upload_max * 1024){
										this.uploads.push(res.tempFiles[i].path)
										this.$emit('imgCount', this.uploads);
										if(this.autoUpload){
											this.uploadFile(res.tempFiles[i].path)
										}else{
											this.uploadImages.push(res.tempFiles[i].path);
										}
									}else {
										this.exceeded_list.push(i === 0 ? 1 : i + 1);
										uni.showModal({
											title: '提示',
											content: `第${[...new Set(this.exceeded_list)].join(',')}张图片超出限制${this.upload_max}MB,已过滤`
										});
									}
								}
							},
							fail: (err) => {
								// uni.showModal({
								// 	content: JSON.stringify(err)
								// });
							}
						});
					break;
					case 'video' :
						uni.chooseVideo({
							sourceType: ['camera', 'album'],
							success: (res) => {
								if(Math.ceil(res.size / 1024) < this.upload_max * 1024){
									this.uploads.push(res.tempFilePath)
									uni.uploadFile({
										url: this.uploadUrl, //仅为示例，非真实的接口地址
										filePath: res.tempFilePath,
										name: 'file',
										//请求参数
										formData: {
											'user': 'test'
										},
										success: (uploadFileRes) => {
											this.$emit('successVideo',uploadFileRes)
										}
									});
								}else {
									uni.showModal({
										title: '提示',
										content: `第${[...new Set(this.exceeded_list)].join(',')}张视频超出限制${this.upload_max}MB,已过滤`
									});
								}
							},
							fail: (err) => {
								uni.showModal({
									content: JSON.stringify(err)
								});
							}
						});
					break;
				}
			},
			delImage(index){
				//第一个是判断app或者h5的 第二个是判断小程序的
				if(this.uploads[index].substring(0,4) !== 'http' || this.uploads[index].substring(0,11) == 'http://tmp/'){
					this.uploads.splice(index,1)
					this.$emit('imgCount', this.uploads);
					return;
				};
				if(!this.deleteUrl) {
					uni.showModal({
						content: '请填写删除接口'
					});
					return;
				};
				uni.request({
					url: this.deleteUrl,
					method: 'DELETE',
					data: {
						image: this.dataList[index]
					},
					success: res => {
						if(res.data.status == 1) {
							uni.showToast({
								title: '删除成功'
							})
							this.uploads.splice(index,1)
						}
					},
				});
			},
			uploadFile(path){
				let userInfo = uni.getStorageSync('myinfo');
				let header = {}
				if (userInfo) {
					let access_token = userInfo.access_token;
					let user_id = userInfo.client.user_id;
					let app_key = userInfo.client.app_key;
					header = {
						'authentication': 'USERID '+ Base64.encode(app_key+':'+access_token+':'+user_id)
					}
				}
				uni.uploadFile({
					url: this.uploadUrl, //仅为示例，非真实的接口地址
					filePath: path,
					name: 'file',
					header: header,
					//自定义请求参数
					// formData: {
					// 	'user': 'test'
					// },
					success: (uploadFileRes) => {
						// var obj = JSON.parse(uploadFileRes.data)
						try{
							var obj = JSON.parse(uploadFileRes.data)
							this.$emit('successImage',obj)
							this.$emit('imgCount', this.uploads);
						}catch(error){
								uni.showToast({
									title: '图片上传失败',
									icon: 'none',
									duration:2000
								})
								return
						}
					}
				});
			},
			unifiedUpload(){
				if(!this.uploadUrl) {
					uni.showModal({
						content: '请填写上传接口'
					});
					return;
				};
				for (let i of this.uploadImages) {
					this.uploadFile(i)
				}
			}
		}
	}
</script>

<style scoped>
	.upload {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.uplode-file {
		margin-top: 24rpx;
		margin-right: 16rpx;
		width: 160upx;
		height: 160upx;
		position: relative;
	}
	.uploade-img {
		display: block;
		width: 160rpx;
		height: 160rpx;
	}
	.clear-one{
		position: absolute;
		top: -10rpx;
		right: 0;
	}
	.clear-one-icon{
		position: absolute;
		width: 20px;
		height: 20px;
		top: 10rpx;
		right: 10rpx;
		z-index: 9;
	}
	.uploader-input-box {
		position: relative;
		width: 160rpx;
		height: 160rpx;
		border: 2upx solid #D9D9D9;
	}
	.uploader-input-box:before,
	.uploader-input-box:after {
		content: " ";
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		background-color: #D9D9D9;
	}
	.uploader-input-box:before {
		width: 4upx;
		height: 79upx;
	}
	.uploader-input-box:after {
		width: 79upx;
		height: 4upx;
	}
	.uploader-input-box:active {
		border-color: #999999;
	}
	.uploader-input-box:active:before,
	.uploader-input-box:active:after {
		background-color: #999999;
	}
	.uploader-input {
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	.uploader-icon{
		position: relative;
		width: 160rpx;
		height: 160rpx;
		margin-top: 24rpx;
		background-color: #f2f2f2;
		border: 1px solid #cccccc;
	}
	.uploader-icon .image-cion{
		width: 36rpx;
		height: 36rpx;
		position: absolute;
		top: 62rpx;
		left: 62rpx;
	}
</style>
