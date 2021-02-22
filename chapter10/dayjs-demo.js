const dayjs = require('dayjs');
require('dayjs/locale/zh-cn');
var customParseFormat = require('dayjs/plugin/customParseFormat')
var quarterOfYear = require('dayjs/plugin/quarterOfYear')
var relativeTime = require('dayjs/plugin/relativeTime')

dayjs.locale('zh-cn') // 全局使用
dayjs.extend(relativeTime)
dayjs.extend(quarterOfYear)
dayjs.extend(customParseFormat)

//1.日期字符串+格式字符串 来获得实例
let day1 = dayjs('09-08-2020', 'MM-DD-YYYY');
let day2 = dayjs('09-08-2020', 'DD-MM-YYYY');
console.log(day1)
console.log(day2)

//2. 时间定位
let day3 = dayjs().endOf('quarter').startOf('week').add(2,'week').add(1,'day').add(10,'hours')
let duration = day3.fromNow();


console.log(day3, duration);

