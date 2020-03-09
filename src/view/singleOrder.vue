<template>
    <div class="yjs-home">
        <public-header></public-header>
        <div class="yjs-order">
            <div class="yjs-content">
                <div class="yjs-content-sub">
                    <x-Table>
                        <thead>
                            <tr>
                                <th>商品名称</th>
                                <th>规格</th>
                                <!-- <th>计量单位</th> -->
                                <th>生产批号</th>
                                <th>拣货篮号</th>
                                <th>货位架</th>
                                <th>数量</th>
                                <!-- <th>操作</th> -->
                            </tr>
                        </thead>
                        <tbody style="overflow-y:scroll;">
                            <tr
                                v-for="item in shopList"
                                :style="{background:item.JHZT == 'T'?'':'#e6e12f'}"
                                :key="item.id"
                            >
                                <td>{{item.YPMC}}</td>
                                <td>{{item.YPGG}}</td>
                                 <td>{{item.SCPH | formatScph}}</td>
                                <!-- <td>{{item.JLDW}}</td> -->
                                <td>{{item.carId}}</td>
                                <td>{{item.HWBH}}</td>
                                <td>{{item.SL}}</td>

                                <!-- <td style="padding:10px;">
                                    <x-button class="back-color" type="primary" @click.native="handlePickGoods(item)">拣货</x-button>
                                </td>-->
                            </tr>
                        </tbody>
                    </x-Table>
                </div>
            </div>

            <div class="footer">
                <x-button
                    class="back-color pick-btn"
                    type="primary"
                    @click.native="handlePickGoods"
                >拣货</x-button>
            </div>
        </div>
        <pick-single-modal :isDrop="isDrop" :shopList="copyShopList"></pick-single-modal>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import publicHeader from "@/components/header";
    import pickSingleModal from "components/pickSingleModal";
    import { getAllSingleOrderInfo, getPickGoodsUserAllSingleOrder } from "api";
    export default {
        name: "singleShopInfo",
        components: {
            pickSingleModal,
            publicHeader
        },
        data() {
            return {
                shopList: [],
                copyShopList: [],
                isDrop: {
                    isPickOrder: false
                }
            };
        },

        computed: {
            ...mapGetters(["getUserId"])
        },
        filters:{
            formatScph(val){
                return val.split(',').filter(item => item).join('-');
            }
        },
        methods: {
            // 获取单品订单信息
            getOrderInfo() {
                getAllSingleOrderInfo({ userId: this.getUserId }).then(res => {
                    this.shopList = res.result;
                });
            },
            // 获取未拣货的单品订单信息
            getNoPickOrderInfo() {
                getPickGoodsUserAllSingleOrder({ userId: this.getUserId }).then(
                    res => {
                        if (0 in res.result) {
                            this.copyShopList = res.result;
                        } else {
                            this.$router.push({ path: "/home" });
                        }
                    }
                );
            },
            // 拣货
            handlePickGoods() {
                this.isDrop.isPickOrder = true;
            }
        },
        mounted() {
            this.getOrderInfo();
            this.getNoPickOrderInfo();
        }
    };
</script>

<style lang="less" scoped>
@import "../style/public.less";
@import "../style/order.less";
.yjs-content {
    position: relative;
    height: 90%;
    .yjs-content-sub {
        padding-top: 30px;
        width: auto;
        position: relative;
    }
}

.footer {
    height: 10%;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    .pick-btn {
        margin-top: 10px;
    }
}
</style>