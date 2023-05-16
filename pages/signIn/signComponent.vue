<template>
	<view class="calendar-box">
		<view class="top">
			<view class="signTxt">
				<image src="/static/images/index/Ico_TitleCard.svg"/>
				<view class="signDay" v-if="Object.keys(signDay.activity_list?signDay.activity_list:{}).length>0">
					<view><text>已签到</text> <text>{{signDayNum}}</text> <text>天</text></view>
					<view><text>签到</text> <text>{{canSignDay}}天</text> <text>可得</text> <text>{{totalMoney}}元</text> <text>奖励</text></view>
				</view>
				<view class="signDay" v-else>
					<view>
						<text>活动未开始</text>
					</view>
					<view>
						<text>请在活动时参加</text>
					</view>
				</view>
			</view>
			<template v-if="isRepair">
				<button class="repairBtn" @click="signToday" v-if="isSignToday>0">补签</button>
				<button class="repairBtn btnDis" v-else>已补签</button>
			</template>
		</view>
		<view class="miss_box">
			<view class="month">
				<view class="lastBtn" @click="lastMonth"><image src="/static/images/index/24px_Btn_02_icon_Goback.svg"/></view>
				<view class="todayTxt">{{year}}-{{formatNum(month)}}-{{formatNum(day)}}</view>
				<view class="nextBtn" @click="nextMonth"><image src="/static/images/index/24px_Btn_01_icon_Jump.svg"/></view>
				<picker v-if="checkDate" class="picker" mode="date" fields="month" @change="changeDate" />
			</view>
			<view class="week">
				<view :style="'color:'+(weeks==weeked?bgweek:'')+';'" v-for="weeks,index in weekArr" :key="index">{{weeks}}</view>
			</view>
			<view class="line"></view>
			<view class="day">
				<template v-for="(days,index) in dayArr">
					<view :class="[{'checkday':days.date==''},{'choose':days.date==localDate || days.flag }]"
						:style="'background:'+(days.date==localDate || days.flag ? '#ecf6f6':'')+';'" 
						:key="index"
						v-if="!days.flag"
					>
						{{days.day}}
					</view>
					<image src="/static/images/index/Ico_sign.svg" class="signPic" v-if="days.flag && days.type == 1" :key="index"/>
					<image src="/static/images/index/Ico_repair.svg" class="repairPic" v-else-if="days.flag && days.type == 2" :key="index"/>
				</template>
			</view>
		</view>
		<view class="but">
			<button :disabled='canSign ? false : true'  :style="'background:'+(canSign ? bgday : '#666')+';'" @click="daySign">立即签到</button>
		</view>
		<view class="activeTips">
			<view>
				<text>活动时间:</text>
				<text>{{startTime}} - {{endTime}}</text>
			</view>
			<view class="rule">
				<text>活动规则:</text>
				<view v-html="signContent" class="signContent"></view>
			</view>
		</view>
		<view class="mask" v-if="isShowPop">
			<view class="signPop">
				<image src="https://wy.zhihuijiayuan.tech/uploads/20220708/34f32683c700f63279904f805abe1caa.png"/>
				<view class="sucTxt">签到成功</view>
				<view class="sucTips" v-if="repairTxt">今日签到获得 <text> {{baseMoney}}元 </text> 奖励</view>
				<button @click="showPop">我知道了</button>
				<view class="reward">连续签到{{canSignDay}}日可得 <text> {{totalMoney}}元 </text> 奖励</view>
			</view>
		</view>
	</view>
</template>

<script>
import { formatTimeTwo } from '@/utils/time.js';
	export default {
		props: {
			lang: {
				type: String,
				default: 'zh'
			},
			type: {
				type: String,
				default: 'calendar'
			},
			checkDate: {
				type: Boolean,
				default: false
			},
			bgweek: {
				type: String,
				default: '#FF8F22'
			},
			bgday: {
				type: String,
				default: '#3789fd'
			},
			signDay:{
				type:Object,
				default:()=>{}
			},
			signtapNum:{
				type:String,
				default:''
			},
			isPop:{
				type:Boolean,
				default:false
			}
		},
		data() {
			return {
				weeked: '', // 今天周几
				dayArr: [], // 当前月每日
				localDate: '', // 今天日期
				day: new Date().getDate(), // 当前日
				year: new Date().getFullYear(), // 当前年
				month: new Date().getMonth() + 1, // 当前月
				weekArr: ['日', '一', '二', '三', '四', '五', '六'], // 每周
				aheadDay: 0,	// 前方空白天数数量
				thisMonth: new Date().getMonth() + 1,
				thisYear:new Date().getFullYear(),
				canSign:false, //今天是否还能进行签到
				isRepair:false, //是否需要补签
				canSignDay:'', //签到的周期
				isSignToday:'', //今天是否还能进行补签
				signDayNum:'', //签到的天数
				canSignList:[], //签到周期列表
				totalMoney:'', //连续签到得到的总钱数
				isShowPop:false, //是否显示弹窗
				baseMoney:'', //基础获得金额
				signContent:'', //规则内容
				startTime:'', //开始时间
				endTime:'', //结束时间
				repairTxt:true, //补签时文字提示是否显示

			}
		},
		watch:{
			signDay(newValue){
				let that = this;
				let signDay = newValue.can_sign_list.length*1;
				let baseMoney = newValue.sign_activity_info.base_money*1;
				let otherMoney = newValue.sign_activity_info.other_money*1;
				that.canSignList = newValue.can_sign_list;
				that.eachJug(newValue.activity_list);
				that.signDayNum = newValue.sign_number;
				that.canSignDay = newValue.can_sign_list.length;
				that.isSignToday = newValue.can_append_number;
				that.baseMoney = baseMoney;
				that.totalMoney = signDay*baseMoney + otherMoney;
				that.signContent = newValue.sign_activity_info.content;
				that.startTime = formatTimeTwo(newValue.sign_activity_info.start_time,'/');
				that.endTime = formatTimeTwo(newValue.sign_activity_info.end_time,'/');

				that.repairJug();
			},
			signtapNum(newValue){
				this.isSignToday = newValue;
			},
			isPop(newValue){
				this.repairTxt = false;
				this.isShowPop = newValue;
			}
		},
		mounted() {
			let that = this;
			// 初始日期
			that.initDate();
			// 今天日期
			that.localDate = that.year + '-' + that.formatNum(that.month) + '-' + that.formatNum(that.day);
			// 中英切换
			if (that.lang != 'zh') that.weekArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			// 今天周几
			that.weeked = that.weekArr[new Date().getDay()];
			// 签到功能
			if (that.type != 'calendar') {
				for (let i in that.dayArr) {
					that.$set(that.dayArr[i], 'flag', false);
				}
			}
		},
		methods: {
			showMsg(title){
				uni.showToast({
					title,
					icon: 'success'
				});
			},
			showPop(){
				this.isShowPop = false;
				this.repairTxt = true;
			},
			getToday(){
				let date = this.dayArr[this.aheadDay + this.day -1].date;
				return date.replace(/-/g,"");
			},
			getNum(date){
				let dayStr = date.slice(6);
				if(dayStr.slice(0,1) == '0'){
					dayStr = dayStr.slice(1)*1;
				}else{
					dayStr *= 1;
				}
				return dayStr;
			},
			repairJug(){
				let that = this;
				let signArr = that.getSignArr();
				for(let i = 0; i < signArr.length; i++){
					// console.log('sign',signArr[i].is_sign);
					if(signArr[i].is_sign){
						that.isRepair = false;
					}else{
						let todayDate = that.getToday();
						let todayStr = that.getNum(todayDate);
						let signStr = that.getNum(signArr[i].date);
						// console.log('to',todayStr);
						// console.log('si',signStr);
						if(signStr < todayStr){
							that.isRepair = true;
						}
						break;
					}
				}
			},
			eachJug(arr){
				let that = this;
				that.canSign = false;
				if(Object.keys(that.signDay).length == 0){
					that.canSign = false;
					return;
				}
				for(let item in arr){
					let monStr = item.slice(5,6);
					if(that.year == that.thisYear && monStr == that.month){
						let dayStr = that.getNum(item);
						let idx = that.aheadDay + dayStr - 1;
						that.dayArr[idx].type = arr[item].type;
						if(arr[item].is_sign){
							that.$set(that.dayArr[idx],'flag',true);
						}
						let curday = that.aheadDay + that.day - 1;
						if(that.month != that.thisMonth){
							that.canSign = false;
						}
						if(that.month == that.thisMonth && that.dayArr[curday].flag){
							that.canSign = false;
						}else if(that.month == that.thisMonth){
							let date = that.getToday();
							if(date == item){
								that.canSign = true;
							}
							if(that.canSignList.length>0){
								that.canSign = that.canSignList.some(item=>{
									return item == date;
								})
							}
						}
					}
				}
			},
			// 选择年月
			changeDate(e) {
				let that = this;
				that.year = parseInt(e.detail.value.split('-')[0]);
				that.month = parseInt(e.detail.value.split('-')[1]);
				that.initDate();
			},
			getSignArr(){
				let that = this;
				let signArr = [];
				that.signDay.can_sign_list.forEach(item=>{
					for(let itm in that.signDay.activity_list){
						if(item == itm){
							that.signDay.activity_list[itm].date = itm;
							signArr.push(that.signDay.activity_list[itm]);
						}
					}
				})
				// console.log('sign2',signArr);
				return signArr;
			},
			// 今日签到
			daySign() {
				let that = this;
				let date = that.getToday();
				let signArr = that.getSignArr();
				for(let i = 0; i < signArr.length; i++){
					if(signArr[i].date == date){
						this.$emit('change', date);
						signArr[i].is_sign = 1;
						signArr[i].type = 1;
						that.eachJug(that.signDay.activity_list);
						that.repairJug();
						break;
					}
				}
				that.signDayNum++;
				that.isShowPop = true;
			},
			// 点击补签
			signToday(){
				let that = this;
				let costMy = that.signDay.sign_activity_info.append_reduce_money*1;
				uni.showModal({
					title: '提示信息',
					content: `补签将自动花费${costMy}元余额`,
					confirmText: '确定',
					cancelText: '取消',
					confirmColor: '#16bcc7',
					cancelColor: "#262626",
				 async success(res) {
						if (res.confirm) {
							let signArr = that.getSignArr();
							for(let i = 0; i < signArr.length; i++){
								if(!signArr[i].is_sign){
                  let res = await that.request({
                  	method:'POST',
                  	url:'/v1/signs',
                  	headers:{'Content-Type':'application/x-www-form-urlencoded'},
                  	data:{
                  		community_code:uni.getStorageSync('userInfo').community_code,
                  		day:signArr[i].date
                  	}
                  })
                  if(res.code == 200){
                    that.$emit('change', "success" + res.data.can_append_number);
                    signArr[i].is_sign = 1;
                    signArr[i].type = 2;
                    that.eachJug(that.signDay.activity_list);
                    that.repairJug();
                    that.signDayNum++;
                  }else{
                    uni.showToast({
                      title:res.desc,
                      icon:'none'
                    })
                  }
                  break;
									// that.$emit('change',signArr[i].date);
									// signArr[i].is_sign = 1;
									// signArr[i].type = 2;
									// that.eachJug(that.signDay.activity_list);
									// that.repairJug();
									// break;
								}
							}
							// that.repairTxt = false;
							// that.isShowPop = true;
						}
					}
				})
			},
			// 初始化日期
			initDate() {
				let that = this;
				that.dayArr = [];
				// 当前月总天数
				let totalDay = new Date(that.year, that.month, 0).getDate();
				// 遍历总天数将日期逐个添加至数组
				for (let i = 1; i <= totalDay; i++) {
					// 得到需补充天数
					let value = (new Date(that.year, that.month - 1, i)).getDay();
					// 补充前面空白日期
					if (i == 1 && value != 0) {
						that.addBefore(value);
						that.aheadDay = value;
					}else if(i == 1 && value == 0){
						that.aheadDay = 0;
					}
					// 添加本月日期
					let obj = {};
					obj.date = that.year + '-' + that.formatNum(that.month) + '-' + that.formatNum(i);
					obj.day = i;
					that.dayArr.push(obj);
					// 补充后面空白日期
					if (i == totalDay && value != 6) that.addAfter(value);
				}
				that.eachJug(that.signDay.activity_list);
			},
			// 补充前面空白日期
			addBefore(value) {
				let that = this;
				let totalDay = new Date(that.year, that.month - 1, 0).getDate();
				for (let i = 0; i < value; i++) {
					let obj = {};
					obj.date = '';
					obj.day = totalDay - (value - i) + 1;
					that.dayArr.push(obj);
				}
			},
			// 补充后空白日期
			addAfter(value) {
				let that = this;
				for (let i = 0; i < (6 - value); i++) {
					let obj = {};
					obj.date = '';
					obj.day = i + 1;
					that.dayArr.push(obj);
				}
			},
			// 格式化日期位数
			formatNum(num) {
				return num < 10 ? ('0' + num) : num;
			},
			// 上一个月
			lastMonth() {
				let that = this;
				if (that.month == 1) {
					that.year -= 1;
					that.month = 12;
				} else {
					that.month -= 1;
				}
				that.initDate();
			},
			// 下一个月
			nextMonth() {
				let that = this;
				if (that.month == 12) {
					that.year += 1;
					that.month = 1;
				} else {
					that.month += 1;
				}
				that.initDate();
			}
		}
	}
</script>

<style lang="scss" scoped>
   $font-family:"Arial, "Helvetica Neue", Helvetica, sans-serif";
	.calendar-box {
		width: 100%;
		flex-direction: column;
		justify-content: center;
		position: relative;
		top: 115rpx;
	}
	.mask{
		position: fixed;
		top: 0px;
		bottom: 0px;
		left: 0px;
		right: 0px;
		background: rgba(0, 0, 0, 0.3);
		.signPop{
			width: 500rpx;
			height: 620rpx;
			border-radius: 25rpx;
			background-color: #fff;
			position: fixed;
			top: 0px;
			bottom: 0px;
			left: 0px;
			right: 0px;
			margin: auto;
			image{
				width: 100%;
				height: 260rpx;
				border-radius: 25rpx;
			}
			.sucTxt{
				font-size: 44rpx;
				color: #1CA3AD;
				text-align: center;
				font-family: $font-family;
				margin-bottom: 20rpx;
			}
			.sucTips{
				text-align: center;
				font-family: $font-family;
				font-size: 30rpx;
				color: #717171;
				text{
					color: #f27900;
					margin-left: 10rpx;
					margin-right: 10rpx;
				}
			}
			button{
				width: 280rpx;
				height: 90rpx;
				font-size: 34rpx;
				line-height: 90rpx;
				text-align: center;
				font-family: $font-family;
				background-color: #20CDD9;
				color: #fff;
				border-radius: 60rpx;
				padding: 0;
				margin-top: 50rpx;
			}
			.reward{
				text-align: center;
				margin-top: 24rpx;
				color: #9a9a9a;
				font-family: $font-family;
				text{
					color: #f27900;
					margin-left: 10rpx;
					margin-right: 10rpx;
				}
			}
		}
	}

	.activeTips{
		width: 700rpx;
		height: 120rpx;
		margin-top: 40rpx;
		text{
			color: #939596;
		}
		text:nth-child(2){
			margin-left: 20rpx;
			font-size: 28rpx;
		}
		.rule{
			display: flex;
			flex-direction: column;
			margin-top: 20rpx;
		}
		.signContent{
			color: #939596;
			margin-left: 30rpx;
			margin-top: 15rpx;
      margin-bottom: 40rpx;
		}
	}

	.lastBtn,.nextBtn{
		width: 80rpx;
		height: 80rpx;
		background-color: #f2f5f7;
		border-radius: 12rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 48rpx;
			height: 48rpx;
		}
	}

	.todayTxt{
		font-size: 34rpx;
		color: #0D97B2;
		font-family: $font-family;
		font-weight: medium;
	}

	.top {
		width: 700rpx;
		height: 220rpx;
		padding: 22rpx 36rpx;
		border-radius: 12rpx;
		margin-bottom: 30rpx;
		background: url('https://wy.zhihuijiayuan.tech/uploads/20220708/0dfd84516f3f810e8e46c928d2bfb456.png') center center;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		.signTxt{
			width: 480rpx;
			height: 160rpx;
			// background-color: greenyellow;
			display: flex;
			justify-content: space-around;
			align-items: center;
			image{
				width: 115rpx;
				height: 115rpx;
			}
			.signDay{
				width: 338rpx;
				height: 140rpx;
				// background-color: red;
				display: flex;
				flex-direction: column;
				justify-content: center;
				view:nth-child(1){
					font-size: 40rpx;
					margin-bottom: 15rpx;
					text{
						color: #0d97b2;
						font-weight: bold;
					}
					text:nth-child(2){
						margin: 0 15rpx;
						color: #f27900;
					}
				}
				view:nth-child(2){
					font-size: 28rpx;
					text{
						color: #6e6e6e;
					}
					text:nth-child(2){
						margin: 0 10rpx;
						color: #f27900;
					}
					text:nth-child(4){
						margin: 0 10rpx;
						color: #f27900;
					}
				}
			}
		}
		.repairBtn{
			width: 150rpx;
			height: 70rpx;
			font-size: 28rpx;
			font-family: $font-family;
			color: #fff;
			background-color: #faa90f;
			border-radius: 40rpx;
			line-height: 70rpx;
			border: 0;
			padding: 0;
			text-align: center;
			position: absolute;
			right: 46rpx;
		}
		.btnDis{
			background-color: #ffc86e;
		}
	}
	
	.miss_box {
		width: 700rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
		background-color: #FFFFFF;
		border-radius: 25rpx;
	}
	
	.calendar-box,
	.month,
	.week,
	.day {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.month,
	.week,
	.day {
		width: 100%;
	}
	.line{
		border-bottom: 1rpx solid #ccc;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}
	
	.month {
		margin: 30rpx 0;
		position: relative;
	}
	
	.picker {
		width: 160rpx;
		height: 40rpx;
		position: absolute;
		top: 20rpx;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	
	.day {
		flex-wrap: wrap;
	}
	
	.week>view,
	.day>view {
		width: 82rpx;
		height: 82rpx;
		// margin: 10rpx;
		text-align: center;
		position: relative;
		line-height: 82rpx;
	}
	
	.checkday {
		color: #999;
	}
	
	.choose {
		color: #219C9C;
		border-radius: 24rpx;
		border: 1rpx solid #82CCCC;
	}
	
	.signPic,.repairPic{
		width: 82rpx;
		height: 82rpx;
	}
	
	.but {
		display: flex;
		flex: 1;
		margin-top: 40rpx;
		justify-content: center;
	}
	.but button {
		width: 686rpx;
		height: 108rpx;
		line-height: 108rpx;
		border-radius: 14rpx;
		border: 0;
		color: #FFFFFF;
		font-size: 32rpx;
		font-family: $font-family;
	}
	uni-button:after {
		border: none;
	}
</style>
