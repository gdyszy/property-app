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

 
    
