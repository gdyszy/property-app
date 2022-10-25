<template>
	<view v-if="isShow">
		<view 
		 @tap.stop.prevent
		 @touchmove.stop.prevent
		 class="wyb-popup-box"
		 :style="{
			 transitionDuration: duration + 'ms',
			 opacity: contentOpacity || (type === 'center' ? 0 : 1),
			 transform: contentTransform || autoTransform,
			 zIndex: zIndex,
			 borderTopRightRadius: type === 'center' || type === 'bottom' || type === 'left' ? radius + 'px' : 0,
			 borderTopLeftRadius: type === 'center' || type === 'bottom' || type === 'right' ? radius + 'px' : 0,
			 borderBottomRightRadius: type === 'center' || type === 'top' || type === 'left' ? radius + 'px' : 0,
			 borderBottomLeftRadius: type === 'center' || type === 'top' || type === 'right' ? radius + 'px' : 0,
			 width: autoWidth,
			 height: autoHeight,
			 minWidth: width + 'rpx',
			 minHeight: height + 'rpx',
			 top: sizeChange && type === 'center' ? winReTop : autoTop,
			 bottom: autoBottom,
			 left: autoLeft,
			 right: autoRight,
			 backgroundColor: bgColor}">
			<view
			 class="wyb-popup-close"
			 v-if="showCloseIcon"
			 :style="{
				 width: closeIcon ? closeIconSize + 'rpx' : 'auto',
				 height: closeIcon ? closeIconSize + 'rpx' : 'auto',
				 top: closeIconPos === 'top-right' || closeIconPos === 'top-left' ? vertOffset + 'rpx' : 'auto',
				 bottom: closeIconPos === 'bottom-right' || closeIconPos === 'bottom-left' ? vertOffset + 'rpx' : 'auto',
				 left: closeIconPos === 'bottom-left' || closeIconPos === 'top-left' ? horiOffset + 'rpx' : 'auto',
				 right: closeIconPos === 'bottom-right' || closeIconPos === 'top-right' ? horiOffset + 'rpx' : 'auto'}">
				<image class="wyb-popup-custom-close" v-if="showCloseIcon&&closeIcon" :src="closeIcon" @tap="hide" :style="{
			 			 width: closeIconSize + 'rpx',
			 			 height: closeIconSize + 'rpx'}" />
			 	<view v-if="showCloseIcon&&!closeIcon" class="iconfont icon-close" @tap="hide" />
			</view>
			
			<scroll-view
			 class="wyb-popup-container"
			 :style="{
				 width: autoWidth,
				 height: autoHeight}"
			 :enable-flex="true"
			 :scroll-y="scrollY"
			 :scroll-x="scrollX">
				<view class="wyb-popup-slot"><slot></slot></view>
			</scroll-view>
		</view>
		<view
		 class="wyb-popup-mask"
		 @tap.stop="close"
		 @touchmove.stop.prevent
		 :style="{
			 opacity: maskOpacity,
			 transitionDuration: duration + 'ms',
			 backgroundColor: 'rgba(0, 0, 0, ' + maskAlpha + ')',
			 zIndex: zIndex - 1}" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				w: uni.getSystemInfoSync().screenWidth,
				h: uni.getSystemInfoSync().screenHeight,
				isShow: false,
				winReBottom: '',
				winReTop: '',
				sizeChange: false,
				contentOpacity: null,
				contentTransform: null,
				maskOpacity: 0
			}
		},
		computed: {
			autoCenterTop() {
				let statusBarHeight = uni.getSystemInfoSync().statusBarHeight
				let windowHeight = uni.getSystemInfoSync().windowHeight
				let popupHeight = this.rpxToPx(this.height)
				let navHeight = 44
				let result = `${(windowHeight - popupHeight) / 2 - this.negativeTop}px`
				return result
			},
			autoTransform() {
				let result = ''
				switch(this.type) {
					case 'center':
						if (this.centerAnim === 'zoom-lessen') {
							result = `scale(${this.zoomLessenMulti})`
						} else if (this.centerAnim === 'slide-up') {
							result = `translateY(${100 * this.slideMulti}%)`
						} else if (this.centerAnim === 'slide-down') {
							result = `translateY(${-100 * this.slideMulti}%)`
						} else if (this.centerAnim === 'fade') {
							result = 'auto'
						}
						break
					case 'bottom':
						result = 'translateY(100%)'
						break
					case 'top':
						result = 'translateY(-100%)'
						break
					case 'left':
						result = 'translateX(-100%)'
						break
					case 'right':
						result = 'translateX(100%)'
						break
				}
				return result
			},
			autoWidth() {
				if (this.type === 'center') {
					return `${this.width}rpx`
				} else {
					if (this.mode === 'size-fixed') {
						if (this.type === 'top' || this.type === 'bottom') {
							return '100%'
						} else {
							return `${this.width}rpx`
						}
					} else {
						if (this.type === 'top' || this.type === 'bottom') {
							return '100%'
						} else {
							return 'auto'
						}
					}
				}
			},
			autoHeight() {
				if (this.type === 'center') {
					return `${this.height}rpx`
				} else {
					if (this.mode === 'size-fixed') {
						if (this.type === 'left' || this.type === 'right') {
							return '100%'
						} else {
							return `${this.height}rpx`
						}
					} else {
						if (this.type === 'left' || this.type === 'right') {
							return '100%'
						} else {
							return 'auto'
						}
					}
				}
			},
			autoTop() {
				if (this.type === 'center') {
					return this.autoCenterTop
				} else if (this.type === 'bottom') {
					return 'auto'
				} else {
					return 0
				}
			},
			autoBottom() {
				if (this.type === 'center' || this.type === 'top') {
					return 'auto'
				} else {
					return 0
				}
			},
			autoLeft() {
				if (this.type === 'center') {
					return  `${(this.w - this.rpxToPx(this.width)) / 2}px`
				} else if (this.type === 'right') {
					return 'auto'
				} else {
					return 0
				}
			},
			autoRight() {
				if (this.type === 'center' || this.type === 'left') {
					return 'auto'
				} else {
					return 0
				}
			}
		},
		props: {
			type: {
				type: String,
				default: 'bottom'
			},
			mode: {
				type: String,
				default: 'size-auto'
			},
			height: {
				type: [String, Number],
				default: 400
			},
			width: {
				type: [String, Number],
				default: 500
			},
			radius: {
				type: [String, Number],
				default: 0
			},
			zIndex: {
				type: [String, Number],
				default: 10076
			},
			maskClickClose: {
				type: Boolean,
				default: true
			},
			maskAlpha: {
				type: Number,
				default: 0.5
			},
			duration: {
				type: Number,
				default: 400
			},
			showCloseIcon: {
				type: Boolean,
				default: false
			},
			scrollY: {
				type: Boolean,
				default: false
			},
			scrollX: {
				type: Boolean,
				default: false
			},
			closeIconPos: {
				type: String,
				default: 'top-right'
			},
			closeIcon: {
				type: String,
				default: ''
			},
			closeIconSize: {
				type: [String, Number],
				default: '20'
			},
			vertOffset: {
				type: [String, Number],
				default: '22'
			},
			horiOffset: {
				type: [String, Number],
				default: '22'
			},
			centerAnim: {
				type: String,
				default: 'zoom-lessen'
			},
			bgColor: {
				type: String,
				default: '#ffffff'
			},
			zoomLessenMulti: {
				type: Number,
				default: 1.15
			},
			slideMulti: {
				type: Number,
				default: 1
			},
			negativeTop: {
				type: Number,
				default: 0
			}
		},
		mounted() {
			// #ifdef H5
			let winHeight = uni.getSystemInfoSync().windowHeight
			uni.onWindowResize(res => {
				this.sizeChange = true
				if (this.type === 'bottom') {
					this.winReBottom = winHeight - res.size.windowHeight + 'px'
				} else if (this.type === 'center') {
					this.winReTop = ((res.size.windowHeight - this.rpxToPx(this.height)) / 2 - this.negativeTop) + 'px'
				}
			})
			// #endif
		},
		methods: {
			close() {
				this.maskClickClose && this.hide()
			},
			show() {
				this.isShow = true
				// #ifndef H5
				this.$nextTick(() => {
					this.maskIn()
					this.contentIn()
					this.wait(this.duration + 1).then(() => {
						this.$emit('show', {
							pageScroll: false, 
							overflow: 'hidden'
						})
					})
				})
				// #endif
				// #ifdef H5
				this.wait(10).then(() => {
					this.maskIn()
					this.contentIn()
					this.wait(this.duration + 1).then(() => {
						this.$emit('show', {
							pageScroll: false, 
							overflow: 'hidden'
						})
					})
				})
				// #endif
			},
			hide() {
				this.contentOut()
				this.maskOut()
				this.wait(this.duration + 1).then(() => {
					this.isShow = false
					this.$emit('hide', {
						pageScroll: true, 
						overflow: 'scroll'
					})
				})
			},
			contentIn() {
				switch (this.type) {
					case 'center':
						if (this.centerAnim === 'zoom-lessen') {
							this.contentOpacity = 1
							this.contentTransform = 'scale(1)'
						} else if (this.centerAnim === 'slide-up' || this.centerAnim === 'slide-down') {
							this.contentOpacity = 1
							this.contentTransform = 'translateY(0)'
						} else if (this.centerAnim === 'fade') {
							this.contentOpacity = 1
						}
						break
					case 'bottom':
					case 'top':
						this.contentTransform = 'translateY(0)'
						break
					case 'left':
					case 'right':
						this.contentTransform = 'translateX(0)'
						break
				}
			},
			contentOut() {
				this.contentOpacity = null
				this.contentTransform = null
			},
			maskIn() {
				this.maskOpacity = 1
			},
			maskOut() {
				this.maskOpacity = 0
			},
			rpxToPx(rpx) {
				return rpx / 750 * this.w
			},
			wait(time) {
				return new Promise(resolve => {
					setTimeout(() => {
						resolve()
					}, time)
				})
			}
		}
	}
</script>

<style>
	@import "./iconfont.css";
	.wyb-popup-box{
		position: fixed;
		transition-timing-function: ease-out;
		transition-property: opacity, transform;
	}
	
	.wyb-popup-container {
		position: relative;
		box-sizing: border-box;
	}
	
	.wyb-popup-slot {
		width: 100%;
		height: 100%;
	}
	
	.wyb-popup-mask {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		transition-timing-function: ease;
		transition-property: opacity, transform;
	}
	
	.wyb-popup-close {
		position: absolute;
		fontSize: 40rpx;
		color: #808080;
		z-index: 20000;
	}
	
	.wyb-popup-custom-close {
		left: 0;
		top: 0;
		position: absolute;
	}
</style>
