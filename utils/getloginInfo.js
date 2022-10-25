//获取登录
export function getInfo(){
	let userInfo = uni.getStorageSync('myinfo');
	if(!userInfo) {
	  uni.showModal({
		title: '提示',
		content:'请先登录',
		success: function(res){
			if (res.confirm) {
				uni.navigateTo({
					url:'../login/index'
				})
			} else if (res.cancel) {
				// console.log('用户点击取消');
			}
		}
	  })
	}
	// return userInfo
}