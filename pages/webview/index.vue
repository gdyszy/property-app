<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.src = decodeURIComponent(options.path)
		},
		data(){
			return {
				src:''
			}
		}
	}
</script>

<style>
</style>
