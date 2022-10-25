const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const timeToEng = function(time) {
  const date = new Date(time)
  return months[date.getMonth()]
}
// 输入time为时间戳,add表示加减天数, 默认为0
const timeFormat = function(time, fmt, add=0) {
  if (time === undefined || time === null) {
    return '无'
  }
  var date = new Date()
  date.setTime(new Date(Number(time)).getTime() + 1000*60*60*24*add)
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}

// 获取当月开始结束日期 cch
const getCurrentMonthDay = () => {
	const now = new Date()
	const yindex = now.getFullYear() - 1990
	const mindex = now.getMonth()
	const day = now.getDate() - 1
	return [[yindex,mindex,0],[yindex,mindex,day]]
}
// 当前日期
const parseTime = function parseTime(time, cFormat) {
  const format = cFormat || 'y/m/d h:i:s'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/(y|m|d|h|i|s|a)+/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
// 获取现在日期指定多少天前
const getBeforeDate = function getBeforeDate(n) {
  var n = n;
  var d = new Date();
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if(day <= n) {
      if(mon > 1) {
          mon = mon - 1;
      } else {
          year = year - 1;
          mon = 12;
      }
  }
  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  return year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
}

const dateDiff = function dateDiff(sDate1, sDate2) {     //sDate1和sDate2是"2002-12-18"格式
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[0], aDate[1] - 1, aDate[2]);
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[0], aDate[1] - 1, aDate[2]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24);
    if((oDate1 - oDate2) < 0) {
      return -iDays;
    }
    return iDays;
}

  export { timeToEng, timeFormat,getCurrentMonthDay, parseTime, getBeforeDate, dateDiff  }
