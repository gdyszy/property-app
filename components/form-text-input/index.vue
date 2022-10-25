
<!--文本输入框,可过滤部分特殊字符，可清除内容-->
<template>
    <view class="content">
        <input
                class="form-text-input"
                v-model.trim="currentValue"
                :maxlength="maxlength"
                :disabled="disabled"
                :placeholder="disabled ? '' : placeholder"
                :focus="focus"
                :cursor="-1"
                @mousewheel.prevent=""
                @blur="handleBlur"
                @focus="handleFocus"
                @input="textInput"/>
        <view class="icon" v-if="clear">
            <uni-icon @click="clearInput" class="uniIcon" type="close" :color="color" :size="size" :clear="clear"></uni-icon>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
			maxlength: {
				type: [String, Number],
				default: -1
			},
            value: {
                type: [String, Number]
            },
            inputType: {
                type: String,
                default() {
                    return 'text'
                }
            },
            disabled: {
                type: Boolean,
                default() {
                    return false
                }
            },
            placeholder: {
                type: String,
                default() {
                    return ''
                }
            },
            focus: {
                type: Boolean,
                default() {
                    return false
                }
            },
            color: {
                type: String,
                default: 'grey'
            },
            size: {
                type: [Number, String],
                default: 20
            },
            clear: {
                type: Boolean,
                default() {
                    return false
                }
            }

        },
        data() {
            return {
                currentValue: ''
            }
        },
        watch: {
			value: {
				handler(val) {
                this.currentValue = val || ''
				},
				immediate: true
			}
            
        },
        methods: {
            textInput(e) {
                const i = e.target.value
                let res = i
                if (i) {
                    let reg = /[@#$%^&*()<p>~%[\]/’]/g //去掉对 '-' 的过滤 let reg = /[@#$%^&*()<p>~%[\]\-/’]/g
                    if(this.inputType === 'url') { //主页地址
                        reg = /[@#$%^&*()<p>~%[\]\-/’]/g
                    }else if(this.inputType === 'phone') { //电话号码
                        reg = /[@#$%^&*()<p>~%[\]/’]/g
                    }else if(this.inputType === 'mail') { //E-mail地址
                        reg = /[#$%^&*()<p>~%[\]\-/’]/g
                    }else if(this.inputType === 'contact') { //联系方式
                        reg = /[#$%^&*()<p>~%[\]/’]/g
                    }
                    res = res.replace(reg, '')
                }

                setTimeout(() => { this.currentValue = res }, 0)
                this.$emit("input", res)
                // this.$forceUpdate()
            },
            handleBlur(e) {
                if(e.detail.value === '' && this.currentValue !== this.value) {
                    this.currentValue = this.value
                }
                this.$emit('blur', e)
            },
            handleFocus(e) {
                this.$emit('focus', e)
            },
            clearInput() {
                this.currentValue = ''
                this.$emit("input", '')
            }
        }
    }
</script>

<style scoped lang="scss">
    
   .content {
       height: 100%;
       display: flex;
	   align-items: center;
	   padding: 0 20rpx;
       .form-text-input {
        height: 100%;
        line-height: normal;
        flex: 1;
        .uni-input-wrapper {
                height: 100%;
                .uni-input-input {
                    height: 100%;
                }
            }
        }
        .icon {
            height: 100%;
            width: 30rpx;
            position: relative;
            .uniIcon {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: 4rpx;
            }
        }
   }
</style>