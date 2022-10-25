<template>
	<view>
		<view class="image_content">
			<image style="width: 100%; height: 100%; border-radius: 20rpx;" :src="article.photo" mode="scaleToFill" lazy-load="true"></image>
		</view>
		<view class="head">{{ article.title }}</view>
		<view class="record">
			<image style="width: 40rpx; height: 40rpx;" src="../../static/images/index/btn_07_time.png" mode="scaleToFill" />
			<view class="text">{{ article.create_time | timeStamp }}</view>
			<image style="width: 40rpx; height: 40rpx; margin-left: 40rpx;" src="../../static/images/index/btn_06_view.png" mode="scaleToFill" />
			<view class="text">{{ article.views+1 }}</view>
		</view>
		<view class="version">
			<rich-text :nodes="richdata"></rich-text>
		</view>
		</view>
	</view>
</template>

<script>
	import { timeStamp } from '../../utils/time.js'
	
	export default {
		data() {
			return {
				article: {},
				richdata: ''
			}
		},
		filters:{
			timeStamp,
			formatRichText(data){
				if(data != null ){
					let newContent= data.replace(/<img[^>]*>/gi,function(match,capture){
						match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
						match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
						match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
						return match;
					});
					newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
						match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
						return match;
					});
					newContent = newContent.replace(/<br[^>]*\/>/gi, '');
					newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
					return newContent;
				}else{
					// 
				}

			}
		},
		onLoad(option) {
			let cid = option.id
			this.getarticle(cid)
		},
		methods:{
			addView(){
				this.request({
					url: '/v1/notices/'+this.article.id,
					method: 'put',
					data: {
						views: this.article.views + 1
					}
				})
			},
			async getarticle(cid){
				await this.request({
					url: '/v1/notices/'+cid,
					method: 'get'
				}).then((res)=>{
					this.article = res.data
					this.formatRichText(res.data.content)
				});
				this.addView()
			},
			formatRichText(data){
				let newContent= data.replace(/<img[^>]*>/gi,function(match,capture){
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
					match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
					return match;
				});
				newContent = newContent.replace(/<br[^>]*\/>/gi, '');
				newContent = newContent.replace(/\<img/gi, '<img style="max-width:330px;height:auto;display:inline-block;margin:18px auto;"');
				// return newContent;
				this.richdata = newContent
			
			}
		}
	}
</script>

<style scoped lang="scss">
	.image_content {
		width: 95%;
		height: 390rpx;
		margin: 0rpx auto;
		border-radius: 20rpx;
	}
	.head {
		font-size: 40rpx;
		color: #262626;
		line-height: 56rpx;
		width: 95%;
		margin: 0 auto;
		font-weight: bold;
		margin-top: 40rpx;
		word-break:break-all;
	}
	.record {
		display: flex;
		align-items: center;
		width: 95%;
		margin: 0 auto;
		margin-top: 12rpx;
		padding-bottom: 12rpx;
		border-bottom: 1px solid #e6e6e6;
		.text {
			font-size: 24rpx;
			color: #b3b3b3;
			margin-left: 8rpx;
		}
	}
	.version {
		width: 95%;
		margin: 0 auto;
		margin-top: 40rpx;
		margin-bottom: 38rpx;
	}
</style>
