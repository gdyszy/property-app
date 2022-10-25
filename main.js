import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

import request from 'utils/request.js'
var server_url = 'https://wy.yszyun.com';
Vue.prototype.$websiteUrl = server_url;
Vue.prototype.$appKey = 123456789;
Vue.prototype.$app_secret = 'abcdef';
var plugin = request({
	baseURL: server_url
})
// ´ò¿ªÏêÇéÒ³
Vue.prototype.onDetails = function(id, title) {to(`/pages/article/details?id=${id}&title=${title}`)}
const to = (url, animationType = 'pop-in', animationDuration = 300) => {
	uni.navigateTo({
		url,
		animationType,
		animationDuration,
		success: function (res) {
		},
		fail: function (e) {
		}
	})
}

Vue.prototype.$save_client = function(uid) {
	var that = this;
	var inf = plus.push.getClientInfo();
	var version = plus.runtime.version;
	let phone_model = ''
	uni.getSystemInfo({
		success: (data) => {
			phone_model = data.system + '|' + data.brand + '|' + data.model
		}
	})
	let datas = {
		user_id: uid,
		client_id: inf.clientid,
		app_version: plus.runtime.version,
		phone_model: phone_model
	}
	that.request({
		url: '/v1/token/save_client',
		data: datas,
		method: 'post',
	}).then((res) => {})
};
Vue.prototype.$logout = function() {
	this.request({
		url: '/v1/token/logout',
		method: 'get',
	}).then((res) => {})

	uni.clearStorageSync()
	// #ifdef APP-PLUS
	plus.runtime.restart();
	// #endif
	// #ifdef MP-WEIXIN
	uni.reLaunch({
		url: '/pages/index/index'
	})
	// #endif
	// #ifdef H5
	this.close()
	// #endif
};
Vue.prototype.$getAuth = function(authType) {
	let authArr = ''
	this.request({
		url: '/mobile/auth',
		method: 'get',
		data: {
			handler: authType
		},
	}).then((res) => {
		let data = res.data.data;
		for (let i = 0; i < data.length; i++) {
			authArr += data[i].name + ','
		}

	})
};
Vue.use(plugin)


const app = new Vue({
	...App
})
app.$mount()
