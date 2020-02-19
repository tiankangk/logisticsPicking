<template>
  <div class="yjs-modal" v-show="isDrop.isGetOrder">
    <div class="yjs-modal-home">
      <div class="yjs-modal-edit">
        <img @click="close" src="~assets/error.png" alt />
      </div>
      <div class="yjs-table-box">
        <div class="order-container">
          <div class="order-item" v-for="(shop, ind) in orderInforList" :key="ind">
            <span>{{ shop.label + ":" }}</span>
            <span>{{ shop.value }}</span>
          </div>
        </div>
        <div class="mainContent">
          <x-Table>
            <thead>
              <tr>
                <!-- <th :style="{width:'6%'}">药品编码</th> -->
                <th>商品名称</th>
                <th :style="{ width: '15%' }">规格</th>
                <th>生产厂家</th>
                <th :style="{ width: '10%' }">数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(shop, ind) in getOrder.shopList" :key="ind">
                <td class="content-right">{{ shop.YPMC }}</td>
                <td class="content-right">{{ shop.YPGG }}</td>
                <td class="content-right">{{ shop.SCCJ }}</td>
                <td class="content-right" style="color:red;">{{ shop.SL }}</td>
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
import { havePickGoodsOrder, isUsedCarNum } from "@/api";
export default {
  name: "getOrder",
  inject: ["reload"],
  props: {
    isDrop: {
      type: Object,
      required: true
    },
    getOrder: {
      type: Object,
      required: true
    },
    // orderNum: {
    //     type: Number,
    //     required: true
    // },
    isOrder: {
      type: Object,
      required: true
    }
  },
  components: {
    XTable,
    XInput,
    XButton,
    Group,
    CellFormPreview
  },
  data() {
    return {
      carNum: "",
      canGetOrder: 0,
      orderInforList: []
    };
  },
  computed: {
    ...mapGetters(["getPickOrderCount"])
  },
  watch: {
    isDrop: {
      handler(newName, oldName) {
        if (newName.isGetOrder) {
          this.$nextTick(() => {
            this.$refs["car"].focus();
          });
        }
      },
      deep: true
    },
    getOrder(newVal) {
      this.orderInforList = [
        {
          label: "日期",
          value: newVal.orderInfo.RQ.split("T")[0]
        },
        {
          label: "单据编号",
          value: newVal.orderInfo.ID
        },
        // {
        //     label: "客户编码",
        //     value: newVal.orderInfo.DWBM
        // },
        {
          label: "客户名称",
          value: newVal.orderInfo.DWMC
        },
        // {
        //     label: "结算方式",
        //     value: newVal.orderInfo.JSFSMC
        // },
        // {
        //     label: "结算金额",
        //     value: newVal.orderInfo.ZJE
        // },
        {
          label: "商品数量",
          value: `${newVal.YPSL}`
        }
        // {
        //     label: "联系电话",
        //     value: newVal.orderInfo.DH
        //         ? newVal.orderInfo.DH.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
        //         : ""
        // }
      ];
    }
  },
  methods: {
    /**
     * 关闭模态框
     */
    close() {
      // this.isDrop.isGetOrder = false;
      this.reload();
    },
    /**
     * 接单成功执行的函数
     *  */
    getOrderSuccess() {
      let userId = localStorage.getItem("userId");
      this.$refs["car"].blur();
      havePickGoodsOrder({
        userId,
        orderId: this.getOrder.orderInfo.ID,
        carNum: this.carNum
      }).then(res => {
        if (res.success) {
          this.$vux.toast.show({
            text: "接单成功",
            time: 500,
            width: "2rem"
          });

          if (this.canGetOrder > 0) {
            this.canGetOrder--;
            this.$emit("continueGetOrder");
            this.$refs["car"].focus();
            this.carNum = "";
          } else {
            this.reload();
          }
        } else {
          this.$vux.toast.show({
            text: "没有可接订单",
            width: "2rem",
            type: "error"
          });
          this.reload();
        }
      });
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
                if (this.isOrder.val) {
                  this.isOrder.val = false;
                  this.getOrderSuccess();
                }
              } else {
                this.$vux.toast.show({
                  text: "该购物篮正在使用中",
                  width: "2rem",
                  type: "warn"
                });
                this.carNum = "";
                this.$refs["car"].focus();
              }
            });
          } else {
            this.$vux.toast.show({
              text: "购物篮编号格式不正确",
              width: "2rem",
              type: "warn"
            });
            this.carNum = "";
            this.$refs["car"].focus();
          }
        } else {
          this.$vux.toast.show({
            text: "请扫描条码",
            width: "2rem",
            type: "warn"
          });
          this.carNum = "";
          this.$refs["car"].focus();
        }

        clearTimeout(timer);
      }, 0);
    }
  },
  mounted() {
    this.canGetOrder = 19 - this.getPickOrderCount;
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
      height: 70%;
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
.yjs-modal-input /deep/ .weui_icon_clear {
  font-size: 30px !important;
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
