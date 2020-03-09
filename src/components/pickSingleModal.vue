<template>
  <div>
    <div class="yjs-modal" v-show="isDrop.isPickOrder">
      <div class="yjs-modal-home">
        <div class="yjs-modal-edit">
          <img @click="close" src="~assets/error.png" alt />
        </div>
        <div class="top-line yjs-table-box">
          <div class="mainContent">
            <flexbox>
              <flexbox-item class="label" :span="2">药品名称</flexbox-item>
              <flexbox-item>{{baseInfo.YPMC}}</flexbox-item>
            </flexbox>
            <flexbox class="top-line">
              <flexbox-item class="label" :span="2">生产厂家</flexbox-item>
              <flexbox-item>{{baseInfo.SCCJ}}</flexbox-item>
            </flexbox>
            <flexbox class="top-line">
              <flexbox-item class="label" :span="2">批准文号</flexbox-item>
              <flexbox-item class="right-line">{{baseInfo.PZWH}}</flexbox-item>
              <flexbox-item class="label" :span="2">库存数量</flexbox-item>
              <flexbox-item :span="4">{{baseInfo.KCSL}}</flexbox-item>
            </flexbox>
            <flexbox class="top-line">
              <flexbox-item class="label" :span="2">药品编码</flexbox-item>
              <flexbox-item :span="4" class="right-line">{{baseInfo.YPBM}}</flexbox-item>
              <flexbox-item class="label" :span="2">存储条件</flexbox-item>
              <flexbox-item :span="4">{{baseInfo.CCTJ}}</flexbox-item>
            </flexbox>
            <flexbox class="top-line">
              <flexbox-item class="label" :span="2">规格型号</flexbox-item>
              <flexbox-item :span="4" class="right-line">{{baseInfo.YPGG}}</flexbox-item>
              <flexbox-item class="label" :span="2">剂型名称</flexbox-item>
              <flexbox-item :span="4">{{baseInfo.JXMC}}</flexbox-item>
            </flexbox>
            <div class="shadow">
              <flexbox>
                <flexbox-item class="label" :span="2">货架位号</flexbox-item>
                <flexbox-item
                  :span="4"
                  class="right-line"
                  :style="{fontWeight:'bold',color:'red'}"
                >{{baseInfo.HWBH}}</flexbox-item>
                <flexbox-item class="label" :span="2">拣货篮号</flexbox-item>
                <flexbox-item :span="4" :style="{fontWeight:'bold',color:'blue'}">{{baseInfo.carId}}</flexbox-item>
              </flexbox>

              <flexbox class="top-line">
                <flexbox-item class="label right-line">生产批号</flexbox-item>
                <flexbox-item class="label">需拣数量</flexbox-item>
              </flexbox>
              <flexbox class="top-line" v-for="(item,ind) in phList" :key="ind">
                <flexbox-item
                  class="right-line"
                  :style="{textAlign:'center',fontWeight:'bold'}"
                >{{item.scph}}</flexbox-item>
                <flexbox-item
                  :style="{textAlign:'center',fontWeight:'bold',color:'red'}"
                >{{item.sl}}</flexbox-item>
              </flexbox>
            </div>

            <!-- <x-Table>
              <thead>
                <tr>
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
            </x-Table>-->
          </div>
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
    <audio ref="successAudio" src="/static/picksuccess.mp3" preload="auto" muted></audio>
    <audio ref="failAudio" src="/static/pickfail.mp3" preload="auto" muted></audio>
  </div>
</template>

<script>
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
    ...mapGetters(["getUserId"]),
    baseInfo() {
      if (0 in this.detailList) {
        return this.detailList[0];
      } else {
        return {};
      }
    },
    phList() {
      if (0 in this.detailList) {
        return this.detailList.map(item => {
          return {
            scph: item.SCPH,
            sl: item.SL
          };
        });
      } else {
        return [];
      }
    }
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
    pickGoodTotalCount() {
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
            count: this.pickGoodTotalCount()
          }).then(res => {
            if (res.success) {
              this.$vux.toast.show({
                text: "拣货成功",
                time: 500,
                width: "2rem"
              });
              this.shopList.splice(0, 1);
              this.actionInput();
              this.$refs.successAudio.play();
            } else {
              this.$vux.toast.show({
                text: "拣货失败",
                width: "2rem",
                type: "error"
              });
              this.$refs.failAudio.play();
            }
          });
        } else {
          this.$refs.failAudio.play();
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
.shadow {
  margin: 5px;
  box-shadow: 0 0 4px 2px red;
}
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
    max-height: 90%;
    // display: table;
    background-color: #fff;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .yjs-table-box {
      // font-size: 20px;
      flex-grow: 1;
      padding: 10px;
      overflow: auto;
    }
    .yjs-modal-edit {
      position: relative;
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
  font-size: 0.28rem;
  line-height: 0.35rem;

  //   height: 100%;
  // overflow: auto;
  // font-size: 24px;
  // line-height: 30px;
  .label {
    text-align: center;
    color: grey;
  }
  /deep/ .vux-flexbox-item {
    margin-left: 0 !important;
    padding: 5px 0;
  }
}
.back-color {
  background: #1eb5d2;
}
.popup-content {
  z-index: 1000;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  width: 80%;
  left: 50%;
  transform: translateX(-50%);
}
.top-line,
.right-line {
  position: relative;
}
.right-line::after {
  content: "";
  position: absolute;
  border: 1px solid black;
  transform: translateY(-50%) scaleX(0.5);
  width: 0;
  height: 80%;
  right: 0;
  top: 50%;
}
.top-line::after {
  content: "";
  position: absolute;
  border: 1px solid black;
  transform: scaleY(0.5);
  width: 100%;
  height: 0;
  left: 0;
  top: 0;
}
</style>
