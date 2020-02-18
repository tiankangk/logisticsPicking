<template>
    <div>
        <div class="yjs-modal" v-show="isDrop.isPickOrder">
            <div class="yjs-modal-home">
                <div class="yjs-modal-edit">
                    <img @click="close" src="~assets/error.png" alt />
                </div>
                <div class="yjs-table-box">
                    <!-- <div class="order-container">
                    <div class="order-item" v-for="(shop,ind) in detailList" :key="ind">
                        <span>{{shop.label+':'}}</span>
                        <span>{{shop.value}}</span>
                    </div>
                    </div>-->
                    <div class="mainContent">
                        <x-Table>
                            <thead>
                                <tr>
                                    <!-- <th :style="{width:'6%'}">药品编码</th> -->
                                    <th>药品名称</th>
                                    <th :style="{width:'15%'}">规格</th>
                                    <th>生产厂家</th>
                                    <th>货位架</th>
                                    <th>拣货篮号</th>
                                    <th>生产批号</th>
                                    <th>订单数量</th>
                                    <th :style="{width:'10%'}">数量</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(shop,ind) in detailList" :key="ind">
                                    <!-- <td class="content-right">{{shop.YPBM}}</td> -->
                                    <td class="content-right">{{shop.YPMC}}</td>
                                    <td class="content-right">{{shop.YPGG}}</td>
                                    <td class="content-right">{{shop.SCCJ}}</td>
                                    <td class="content-right">{{shop.HWBH}}</td>
                                    <td class="content-right">{{shop.carId}}</td>
                                    <td class="content-right">{{shop.SCPH}}</td>
                                    <td style="color:green;text-align:center;">{{shop.DDSL}}</td>
                                    <td class="content-right" style="color:red;">{{shop.SL}}</td>
                                </tr>
                            </tbody>
                        </x-Table>
                    </div>
                    <!-- <group class="group-margin">
                    <cell-form-preview class="table-fontsize" :list="orderInforList"></cell-form-preview>
                    </group>-->
                </div>
                <div class="yjs-modal-input">
                    <group>
                        <x-input
                            ref="cargoRackInput"
                            @keyup.enter.native="handleGetOrder"
                            title
                            label-width="100"
                            v-model="cargoRackNum"
                            placeholder="请扫描货位号"
                        ></x-input>
                    </group>
                    <x-button class="back-color" @click.native="handleJumpPick">跳过</x-button>
                </div>
            </div>
        </div>
        <popup class="popup-content" v-model="isPopup">
            <popup-header
                left-text="取消"
                right-text="确定"
                title="请选择异常的原因"
                @on-click-left="handleCancel"
                @on-click-right="handleOk"
            ></popup-header>
            <group>
                <radio title="title" :options="options" v-model="chooseVal"></radio>
            </group>
        </popup>
    </div>
</template>

<script>
    import {
        XTable,
        XButton,
        XInput,
        Group,
        CellFormPreview,
        Tab,
        TabItem,
        dateFormat,
        PopupHeader,
        Popup,
        Radio
    } from "vux";
    import { mapGetters } from "vuex";
    import {
        pickSingleGoods,
        getSingleOrderDetailInfo,
        pickSingleOrderAbnormal
    } from "@/api";
    export default {
        name: "pickSingleModal",
        inject: ["reload"],
        props: {
            isDrop: {
                type: Object,
                required: true
            },
            shopList: {
                type: Array,
                required: true
            }
        },

        components: {
            XTable,
            XButton,
            XInput,
            Group,
            CellFormPreview,
            Tab,
            TabItem,
            dateFormat,
            PopupHeader,
            Popup,
            Radio
        },
        data() {
            return {
                pickOrder: {},
                chooseVal: "批号不符",
                options: ["批号不符", "数量不足", "货位架不存在"],
                isPopup: false,
                detailList: [],
                cargoRackNum: "",
                orderInforList: []
            };
        },
        watch: {
            shopList(list) {
                if (0 in list) {
                    this.actionInput();
                    this.pickOrder = list[0];
                    this.getDetailInfo(list[0]);
                } else {
                    this.$vux.toast.show({
                        text: "拣货完成",
                        time: 500,
                        width: "2rem"
                    });
                    // this.isDrop.isPickOrder = false;
                    this.close();
                }
            },
            isDrop: {
                handler(newName, oldName) {
                    if (newName.isPickOrder) {
                        this.$nextTick(() => {
                            this.actionInput();
                        });
                    }
                },
                deep: true
            }
        },
        computed: {
            ...mapGetters(["getUserId"])
        },
        methods: {
            /**
             * 取消选择
             */
            handleCancel() {
                this.isPopup = false;
            },
            /**
             * 确定选择
             */
            handleOk() {
                let that = this;

                let userId = localStorage.getItem("userId");
                let person = localStorage.getItem("mc");
                pickSingleOrderAbnormal({
                    shopInfo: this.pickOrder,
                    person,
                    userId,
                    reason: this.chooseVal
                }).then(res => {
                    if (res.success) {
                        this.shopList.splice(0, 1);
                        this.actionInput();
                    } else {
                        this.$vux.toast.show({
                            text: `拣货跳过失败`,
                            width: "3rem",
                            type: "warn"
                        });
                    }
                });
                this.isPopup = false;
            },

            handleJumpPick() {
                this.isPopup = true;
            },
            // 获取单订单的不同的批号对应的不同的数量的信息
            getDetailInfo(shopItem) {
                getSingleOrderDetailInfo({ shopItem, userId: this.getUserId }).then(
                    res => {
                        this.detailList = res.result;
                        
                    }
                );
            },
            /**
             * 关闭模态框
             */
            close() {
                // this.isDrop.isGetOrder = false;
                this.reload();
            },
            // 清空货位号的输入框，并获取焦点
            actionInput() {
                this.cargoRackNum = "";
                this.$refs.cargoRackInput.focus();
            },
            /**
             * @description 计算合并后要拣的药品的总数量
             */
            pickGoodTotalCount(){
                let totalCount = 0;
                 this.detailList.forEach(item => {
                    totalCount += Number(item.SL);
                });
                return totalCount;
            },
            /**
             * 获得订单
             */
            handleGetOrder() {
                let timer = setTimeout(() => {
                    let detailList = this.detailList[0];
                    let cargoRackNum = this.cargoRackNum
                        ? this.cargoRackNum.replace(/\s+/g, "").toLowerCase()
                        : "";
                    let HWBH = detailList.HWBH
                        ? detailList.HWBH.replace(/\s+/g, "").toLowerCase()
                        : "";
                    if (cargoRackNum === HWBH) {
                        // let userId = localStorage.getItem("userId");
                        pickSingleGoods({
                            userId: this.getUserId,
                            YPBM: detailList.YPBM,
                            carId: detailList.carId,
                            count:this.pickGoodTotalCount()
                        }).then(res => {
                            if (res.success) {
                                this.$vux.toast.show({
                                    text: "拣货成功",
                                    time: 500,
                                    width: "2rem"
                                });
                                this.shopList.splice(0, 1);
                                this.actionInput();
                            } else {
                                this.$vux.toast.show({
                                    text: "拣货失败",
                                    width: "2rem",
                                    type: "error"
                                });
                            }
                        });
                    } else {
                        this.$vux.toast.show({
                            text: "请输入正确的货位架",
                            width: "3rem",
                            type: "warn"
                        });
                    }
                    this.actionInput();
                    clearTimeout(timer);
                }, 500);
            }
        }
    };
</script>

<style lang="less" scoped>
.yjs-modal {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    .yjs-modal-home {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 16rem;
        max-height: 80%;
        // display: table;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
        .yjs-table-box {
            height: 65%;
            font-size: 20px;
        }
        .yjs-modal-edit {
            height: 1rem;
            padding-right: 0.3rem;
            line-height: 0.7rem;
            text-align: right;
            img {
                width: 0.5rem;
                height: 0.5rem;
            }
        }
    }
}
.table-fontsize {
    font-size: 30px;
}
.yjs-modal-input /deep/ .weui-cells,
.group-margin /deep/ .weui-cells {
    margin-top: 0;
}
.order-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    .order-item {
        margin: 5px 10px;
    }
}
.content-right {
    text-align: left;
}
.mainContent {
    height: 100%;
    overflow-y: scroll;
}
.back-color {
    background: #1eb5d2;
}
.popup-content {
    z-index: 1000;
}
</style>
