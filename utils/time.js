export function timeStamp(value){
	if (!value) return '';
	var now = new Date(value*1000);
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	if (month < 10) {
		month = '0' + month
	}
	var date = now.getDate();
	if (date < 10) {
		date = '0' + date
	}
	return year + "-" + month + "-" + date
}
export function timeYD(value) {
	if (!value) return '';
	var now = new Date(value);
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	if (month < 10) {
		month = '0' + month
	}
	var date = now.getDate();
	if (date < 10) {
		date = '0' + date
	}
	return year + "-" + month + "-" + date
} 
export function	formatTimeTwo(timeStamp, fuhao) {
		let date = new Date(timeStamp*1000);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		month = month >= 10 ? month : "0" + month;
		let day = date.getDate();
		// 如果日期是10号之后的直接写本身,如果日期小于10的是,需要在日期前面+0
		day = day >= 10 ? day : "0" + day;

		fuhao = fuhao ? fuhao : "/";
		return `${year}${fuhao}${month}${fuhao}${day}`
}
export function timeDate(value){
	if (!value) return '';
	var now = new Date(value*1000);
	
	var month = now.getMonth() + 1;
	if (month < 10) {
		month = '0' + month
	}
	var date = now.getDate();
	if (date < 10) {
		date = '0' + date
	}
	return  month + "-" + date
}

export function timeMinute(value){
	if (!value) return '';
	var now = new Date(value*1000);
	var month = now.getMonth() + 1;
	if (month < 10) {
		month = '0' + month
	}
	var date = now.getDate();
	if (date < 10) {
		date = '0' + date
	}
	var hour = now.getHours();
	if (hour < 10) {
		hour = '0' + hour
	}
	var minute = now.getMinutes();
	if (minute < 10) {
		minute = '0' + minute
	}
	return  month + "-" + date + " " + hour + ":" + minute
}

export function timeSecond(value){
	if (!value) return '';
	var now = new Date(value);
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	if (month < 10) {
		month = '0' + month
	}
	var date = now.getDate();
	if (date < 10) {
		date = '0' + date
	}
	var hour = now.getHours();
	if (hour < 10) {
		hour = '0' + hour
	}
	var minute = now.getMinutes();
	if (minute < 10) {
		minute = '0' + minute
	}
	var seconds = now.getSeconds();
	if (seconds < 10) {
		seconds = '0' + seconds
	}
	return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + seconds
}

 
    
