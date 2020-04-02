
/**
 * @params {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const repairTime = num => {
    return num < 10 ? '0' + num : num
}

/**
 * @params {Date} time 日期格式
 * @returns {Date} 格式化后的日期
 * @description 把日期格式化成yyyy-mm-dd
 */
export const formatTime = ({ time = "", type = 'full' } = { time, type }) => {
    let nowTime = time ? new Date(time) : new Date();
    let y = nowTime.getFullYear();
    let M = nowTime.getMonth() + 1;
    let d = nowTime.getDate();
    let h = nowTime.getHours();
    let m = nowTime.getMinutes();
    let s = nowTime.getSeconds();
    if (type === 'full') {
        return `${y.toString()}-${repairTime(M)}-${repairTime(d)} ${repairTime(h)}:${repairTime(m)}:${repairTime(s)}`
    } else if (type === 'half') {
        return `${y.toString()}-${repairTime(M)}-${repairTime(d)}`;
    } else {
        return `${repairTime(h)}:${repairTime(m)}:${repairTime(s)}`
    }
}