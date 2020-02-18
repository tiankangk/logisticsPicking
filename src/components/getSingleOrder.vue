<template>
    <div class="yjs-modal" v-show="isDrop.isGetSingleOrder">
        <div class="yjs-modal-home">
            <div class="yjs-modal-edit">
                <img @click="close" src="~assets/error.png" alt />
            </div>
            <div class="yjs-table-box">
                <div class="mainContent">
                    <group>
                        <cell-form-preview class="table-fontsize" :list="currentShop"></cell-form-preview>
                    </group>
                </div>
            </div>
            <div class="yjs-modal-input">
                <group>
                    <x-input
                        ref="car"
                        @keyup.enter.native="handleGetOrder"
                        title
                        label-width="100"
                        v-model="carNum"
                        placeholder="请扫描购物篮编号"
                    ></x-input>
                </group>
            </div>
        </div>

        <audio ref="getOrderNotice" src="/static/getOrder.mp3" preload="auto" muted></audio>
        <!-- <iframe allow="autoplay" style="display:none" src="/static/bg.mp3"></iframe> -->
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import {
        XTable,
        XButton,
        XInput,
        Group,
        CellFormPreview,
        dateFormat
    } from "vux";
    import { havePickGoodsSingleOrder, isUsedCarNum } from "@/api";
    export default {
        name: "getOrder",
        inject: ["reload"],
        props: {
            isDrop: {
                type: Object,
                required: true
            },
            getSingleOrder: {
                type: Array,
                required: true
            }
            // ,
            // orderNum: {
            //     type: Number,
            //     required: true
            // }
        },
        computed: {
            ...mapGetters(["getUserId"])
        },
        components: {
            XTable,
            XInput,
            XButton,
            Group,
            CellFormPreview
        },
        watch: {
            getSingleOrder(list) {
                if (0 in list) {
                    let newList = list[0];
                    this.idList = newList.idList;
                    this.currentShop = [
                        {
                            label: "商品名称",
                            value: newList.YPMC
                        },
                        {
                            label: "规格",
                            value: newList.YPGG
                        },
                        {
                            label: "计量单位",
                            value: newList.JLDW
                        },
                        {
                            label: "数量",
                            value: `<span style="font-weight:bold;color:red;">${newList.SL}</span>`
                        }
                    ];
                } else {
                    this.$vux.toast.show({
                        text: "接单完成",
                        time: 500,
                        width: "2rem"
                    });
                    this.close();
                }
            },
            "isDrop.isGetSingleOrder"() {
                this.timer = setTimeout(() => {
                    this.reload();
                    clearTimeout(this.timer);
                    this.timer = null;
                }, 300000);
            }
        },
        data() {
            return {
                timer: null,
                carNum: "",
                idList: [],
                currentShop: []
            };
        },

        methods: {
            /**
             * 关闭模态框
             */
            close() {
                this.reload();
            },
            /**
             * 获取所有要接的订单的id列表
             */
            // getIdList() {
            //     let idList = [];
            //     this.getSingleOrder.forEach(item => {
            //         item.idList.forEach(id => {
            //             idList.push(id);
            //         });
            //     });
            //     return idList;
            // },
            /**
             * 接单成功执行的函数
             *  */
            getOrderSuccess() {
                // let userId = localStorage.getItem("userId");
                this.$refs["car"].blur();
                havePickGoodsSingleOrder({
                    userId: this.getUserId,
                    orderIdList: this.idList,
                    carNum: this.carNum
                }).then(res => {
                    if (res.success) {
                        this.$vux.toast.show({
                            text: "接单成功",
                            time: 500,
                            width: "2rem"
                        });
                        this.getSingleOrder.splice(0, 1);
                        this.$refs.getOrderNotice.play();
                    } else {
                        this.$vux.toast.show({
                            text: "接单失败",
                            width: "2rem",
                            type: "error"
                        });
                    }
                    this.actionCarInput();
                });
            },
            // 清空拣货篮号输入框并获得焦点
            actionCarInput() {
                this.carNum = "";
                this.$refs["car"].focus();
            },
            /**
             * 获得订单
             */
            handleGetOrder() {
                let timer = setTimeout(() => {
                    if (this.carNum) {
                        let regCarNum = /^[A-Z]\d{3}$/g;
                        if (regCarNum.test(this.carNum)) {
                            isUsedCarNum({ carNum: this.carNum }).then(res => {
                                if (res.success) {
                                    this.getOrderSuccess();
                                } else {
                                    this.$vux.toast.show({
                                        text: "该购物篮正在使用中",
                                        width: "2rem",
                                        type: "warn"
                                    });
                                    this.actionCarInput();
                                }
                            });
                        } else {
                            this.$vux.toast.show({
                                text: "购物篮编号格式不正确",
                                width: "2rem",
                                type: "warn"
                            });
                            this.actionCarInput();
                        }
                    } else {
                        this.$vux.toast.show({
                            text: "请扫描条码",
                            width: "2rem",
                            type: "warn"
                        });
                        this.actionCarInput();
                    }

                    clearTimeout(timer);
                }, 0);
            }
        },

        destroyed() {
            clearTimeout(this.timer);
            this.timer = null;
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
        width: 15rem;
        max-height: 80%;
        // display: table;
        background-color: #fff;
        border-radius: 20px;
        overflow: hidden;
        .yjs-table-box {
            height: 75%;
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
</style>
