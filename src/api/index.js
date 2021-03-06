// import axios from 'axios'
import axios from '@/utils/api'
import store from '@/store'
import { formatTime } from '@/utils/tools.js'
if (process.env.NODE_ENV === 'development') {
    var baseURL = `http://localhost:3001/`;
    var outURL = `http://mqs-api.tst.yaojushi.com/svc/v1/`;
    // var outURL = `http://mqs-api.yaojushi.com/svc/v1/`;
} else {
    var baseURL = `http://192.168.0.38:3001/`
    var outURL = `http://mqs-api.yaojushi.com/svc/v1/`;
}



/**
 * 
 * 消息推送
 */
export const pushMessage = params => {
    let { getUserId, getUserMc } = store.getters;
    let nowTime = formatTime();
    let data = {
        sendUserId: getUserId,
        sendUserName: getUserMc,
        sendType: 100,
        sendMode: 100,
        sendTime: nowTime,
        notificationTitle: '缺货上架',
        notificationContent: JSON.stringify(params),
        receiveUserId: [0],
        moduleId: '1242095274848772001'
    }
    return axios.post(outURL + 'notification', data).then(res => res.data)
}

/**
 * 
 * 登录功能
 */
export const pickGoodsLogin = params => {
    return axios.post(baseURL + 'pickGoodsSystemLogin', params).then(res => res.data)
}

// 获取多品能接的订单
export const getPickGoodsOrder = (params) => {
    return axios.post(baseURL + 'getPickGoodsOrder', params).then(res => res.data)
}
// 获取单品能接的订单
export const getPickGoodsSingleOrder = (params) => {
    return axios.post(baseURL + 'getPickGoodsSingleOrder', params).then(res => res.data)
}




// 接单品订单
export const havePickGoodsSingleOrder = (params) => {
    return axios.post(baseURL + 'havePickGoodsSingleOrder', params).then(res => res.data)
}
// 获得所有单品订单信息
export const getAllSingleOrderInfo = (params) => {
    return axios.post(baseURL + 'getAllSingleOrderInfo', params).then(res => res.data)
}
// 获得已接单未拣货的单品订单信息
export const getPickGoodsUserAllSingleOrder = (params) => {
    return axios.post(baseURL + 'getPickGoodsUserAllSingleOrder', params).then(res => res.data)
}

// 获得可接单品订单数量
export const getPickGoodSingleOrderCount = () => {
    return axios.get(baseURL + 'getPickGoodSingleOrderCount').then(res => res.data)
}
// 获取单品订单的详情
export const getSingleOrderDetailInfo = (params) => {
    return axios.post(baseURL + 'getSingleOrderDetailInfo', params).then(res => res.data)
}
// 单品拣货
export const pickSingleGoods = (params) => {
    return axios.post(baseURL + 'pickSingleGoods', params).then(res => res.data)
}
// 单品拣货标记异常
export const pickSingleOrderAbnormal = (params) => {
    return axios.post(baseURL + 'pickSingleOrderAbnormal', params).then(res => res.data)
}


// 接订单
export const havePickGoodsOrder = (params) => {
    return axios.post(baseURL + 'havePickGoodsOrder', params).then(res => res.data)
}
// 获得拣货员的所有订单
export const getPickGoodsUserAllOrder = (params) => {
    return axios.post(baseURL + 'getPickGoodsUserAllOrder', params).then(res => res.data)
}
// 获得拣货员的所有订单的商品信息
export const getPickGoodsUserAllOrderShop = (params) => {
    return axios.post(baseURL + 'getPickGoodsUserAllOrderShop', params).then(res => res.data)
}
// 开始拣货
export const pickGoods = (params) => {
    return axios.post(baseURL + 'pickGoods', params).then(res => res.data)
}

// 开始拣货
export const markReviewDiffOrder = (params) => {
    return axios.post(baseURL + 'markReviewDiffOrder', params).then(res => res.data)
}
// 获得最新定单的数量
export const getPickGoodOrderCount = () => {
    return axios.get(baseURL + 'getPickGoodOrderCount').then(res => res.data)
}
// 判断购物车是否被占用
export const isUsedCarNum = (params) => {
    return axios.post(baseURL + 'isUsedCarNum', params).then(res => res.data)
}
// 获取拣货人的权限
export const getPickGoodsUserStatus = (params) => {
    return axios.post(baseURL + 'getPickGoodsUserStatus', params).then(res => res.data)
}

// 获取单品和多品订单的数量
export const getSingleMoreOrderCount = (data) => {
    return axios.post(baseURL + 'getSingleMoreOrderCount', data).then(res => res.data)
}

// 获取当前登录人的异常订单的信息
export const getMobileAbnormalOrderShop = (data) => {
    return axios.post(baseURL + 'getMobileAbnormalOrderShop', data).then(res => res.data)
}

// 恢复异常订单
export const changePickGoodAbnormalOrderStauts = (data) => {
    return axios.post(baseURL + 'changePickGoodAbnormalOrderStauts', data).then(res => res.data)
}


