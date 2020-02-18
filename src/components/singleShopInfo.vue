<template>
    <div>
        
        <x-Table>
            <thead>
                <tr>
                    <th>商品名称</th>
                    <th>规格</th>
                    <th>计量单位</th>
                     <th>拣货篮号</th>
                    <th>数量</th>
                </tr>
            </thead>
            <tbody style="overflow-y:scroll;">
                <tr v-for="item in shopList" :key="item.id">
                    <td>{{item.YPMC}}</td>
                    <td>{{item.YPGG}}</td>
                    <td>{{item.JLDW}}</td>
                    <td>{{item.carId}}</td>
                    <td>{{item.SL}}</td>
                </tr>
            </tbody>
        </x-Table>
    </div>
</template>

<script>
    import { XTable } from "vux";
    import { mapGetters,mapMutations } from "vuex";
    import { getPickGoodsUserAllSingleOrder, getPickGoodSingleOrderCount } from "api";
    export default {
        name: "singleShopInfo",
        components: {
            XTable
        },
        data() {
            return {
                shopList: [],
                canGetOrderCount: 0
            };
        },

        computed: {
            ...mapGetters(["getUserId"])
        },
        methods: {
            ...mapMutations(['setPickOrderCount']),
            // 获取单品订单信息
            getOrderInfo() {
                getPickGoodsUserAllSingleOrder({ userId: this.getUserId }).then(res => {
                    this.shopList = res.result;
                    this.setPickOrderCount(res.result.length);
                });
            }
        },
        mounted() {
            this.getOrderInfo();
        }
    };
</script>

<style lang="less" scoped>
@import "../style/home.less";
</style>