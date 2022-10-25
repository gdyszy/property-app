
import { Base64 } from './base64.js'
export default function(obj){
	// 将baseurl从 config 中解构出来
	const  { baseURL } = obj;  // 在ming。js中传入的参数
	
	// 调用函数让vue。use调用
	return function ( vue ){
		
		// 给vue添加个request方法，通过this.request调用方法
		vue.prototype.request = async function(params){
			const { url ,data , method  } = params 
			let header = {'Content-Type': 'application/x-www-form-urlencoded'}
			let userInfo = uni.getStorageSync('myinfo');
			let user_id = '';
			if(uni.getStorageSync('loginType')){ //wuye 物业登录信息
				userInfo = uni.getStorageSync('wymyinfo');
				if(userInfo){
					user_id= userInfo.client.id;
				}
				
			}
			if (userInfo) {
				let access_token = userInfo.access_token;
				let app_key = userInfo.client.app_key;
				if(user_id==''){
					user_id = userInfo.client.user_id;
				}
				header = {
					'Content-Type': 'application/x-www-form-urlencoded',
					'authentication': 'USERID '+ Base64.encode(app_key+':'+access_token+':'+user_id)
				}
			}
			
			// uni.showLoading({
			// 	title:'加载中'
			// })
			const [ err,res ] = await uni.request({
				url: baseURL + url ,
				header: header,
				data:data,
				method:method
			});
			if (res.code === 408||res.data.code===408) {
				uni.showToast({
					title: '登录信息已过期，请重新登录！',
					icon: "none"
				})
				setTimeout(() => {
					this.userInfo = ''
					uni.clearStorageSync()
					uni.reLaunch({
						url: '/pages/login/index'
					})
				}, 1000)
			} else if (res.code === 400||res.data.code===400) {
				uni.showToast({
					title: res.data.desc,
					icon: "none"
				})
				if(res.data.desc=='您未登录'){
					setTimeout(() => {
						uni.clearStorageSync()
						uni.reLaunch({
							url: '/pages/login/index'
						})
					}, 1000)
				}
				this.userInfo = ''
				return 
			}else {
				return res.data;	
			}
		}
	}
}