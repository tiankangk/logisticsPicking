<template>
    <div>
        <x-Table>
            <thead>
                <tr>
                    <th>日期</th>
                    <th>单据编号</th>
                    <th>客户编码</th>
                    <th>客户名称</th>
                    <th>结算方式</th>
                    <th>结算金额</th>
                    <th>联系电话</th>
                    <th>购物篮编号</th>
                </tr>
            </thead>
            <tbody style="overflow-y:scroll;">
                <tr v-for="item in userOrderList" :key="item.id">
                    <td>{{item.RQ | formatTime}}</td>
                    <td>{{item.id}}</td>
                    <td>{{item.DWBM}}</td>
                    <td>{{item.DWMC}}</td>
                    <td>{{item.JSFSMC}}</td>
                    <td>{{item.ZJE}}</td>
                    <td>{{item.DH | formatTel}}</td>
                    <td>{{item.carid}}</td>
                </tr>
            </tbody>
        </x-Table>
    </div>
</template>

<script>
    import { XTable, dateFormat } from "vux";
    import { mapGetters,mapMutations } from "vuex";
    import { getPickGoodsUserAllOrder } from "api";
    export default {
        name: "variousShopInfo",
        components: {
            XTable
        },
        data() {
            return {
                userOrderList: [],
                canGetOrderCount: 0
            };
        },

        computed: {
            ...mapGetters(["getUserId"])
        },
        filters: {
            formatTime(val) {
                return val ? val.split("T")[0] : "";
            },
            formatTel(tel) {
                let reg = /(\d{3})\d{4}(\d{4})/;

                return tel ? tel.replace(reg, "$1****$2") : "";
            }
        },
        methods: {
             ...mapMutations(['setPickOrderCount']),
            initOrder() {
                /**
                 * 获取用户的所有订单
                 */

                getPickGoodsUserAllOrder({ userId: this.getUserId }).then(res => {
                    if (res.success) {
                        this.userOrderList = res.result;
                        this.setPickOrderCount(res.result.length);
                    }
                });
            }
        },
        mounted() {
            this.initOrder();
        }
    };
</script>

<style lang="less" scoped>
@import "../style/home.less";
</style>