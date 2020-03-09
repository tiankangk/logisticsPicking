<template>
  <div class="yjs-home">
    <public-header></public-header>

    <div class="yjs-table">
      <div class="yjs-title">
        <div class="title">
          可接单订单
          <span>{{canGetSingleOrderCount}}</span>,
          多订单
          <span>{{canGetOrderCount}}</span>,
          拣货单
          <span>{{singleOrderCount}}</span>-
          <span>{{moreOrderCount}}</span>
        </div>
      </div>
      <div class="yjs-table-box">
        <router-view />
      </div>

      <div class="yjs-footer">
        <div class="yjs-btn-group">
          <x-button
            :style="{background:isOrderStatus?'#1eb5d2':'#a4e4cf',color:'#fff'}"
            mini
            text="单品接单"
            @click.native="handleGetSingleOrder"
          ></x-button>
          <x-button
            :style="{background:isOrderStatus?'#a4e4cf':'#1eb5d2',color:'#fff'}"
            mini
            text="多品接单"
            @click.native="handleGetOrder"
          ></x-button>
          <x-button
            mini
            text="开始拣货"
            :style="{background:pickStatus?'#a4e4cf':'#1eb5d2',color:'#fff'}"
            @click.native="clickLogin"
          ></x-button>
        </div>
      </div>
    </div>
    <!-- 接多品单弹框 -->
    <get-order
      ref="getOrder"
      :isOrder="isOrder"
      :isDrop="isDrop"
      @continueGetOrder="continueGetOrder"
      :getOrder="getOrder"
    ></get-order>
    <!-- 接单品单弹框 -->
    <get-single-order ref="getSingleOrder" :isDrop="isDrop" :getSingleOrder="getSingleOrder"></get-single-order>
    <audio ref="audio" loop src="/static/bg.mp3" preload="auto" muted></audio>
    <audio ref="getOrderNotice" src="/static/getOrder.mp3" preload="auto" muted></audio>
    <iframe allow="autoplay" style="display:none" src="/static/bg.mp3"></iframe>
  </div>
</template>

<script>
import getOrder from "@/components/getOrder";
import getSingleOrder from "@/components/getSingleOrder";
import { mapGetters } from "vuex";
import publicHeader from "@/components/header";
import {
  getPickGoodsOrder,
  getPickGoodsUserAllOrder,
  getPickGoodOrderCount,
  getPickGoodsSingleOrder,
  getPickGoodsUserStatus,
  getPickGoodSingleOrderCount,
  getSingleMoreOrderCount
} from "@/api";
import { setTimeout, clearTimeout, setInterval, clearInterval } from "timers";
export default {
  name: "home",
  components: {
    getOrder,
    getSingleOrder,
    publicHeader
  },
  data() {
    return {
      timer: null,
      isOrder: {
        val: true
      },
      singleOrderCount: 0,
      moreOrderCount: 0,
      canGetSingleOrderCount: 0,
      canGetOrderCount: 0,
      isDrop: {
        isGetOrder: false,
        isGetSingleOrder: false
      },
      getSingleOrder: [],
      getOrder: {}
      // testOrderSingle: 19,
      // textOrderMany: 18
    };
  },
  computed: {
    // 判断是否能拣货
    pickStatus() {
      return this.getPickOrderCount <= 0;
    },
    // 判断接单按钮的状态
    btnStatus() {
      let limitCount = 24;
      return this.canGetSingleOrderCount >= limitCount
        ? "single"
        : this.canGetSingleOrderCount < limitCount &&
          this.canGetOrderCount >= limitCount
        ? "many"
        : "all";

      // return this.testOrderSingle >= limitCount
      //     ? "single"
      //     : this.testOrderSingle < limitCount &&
      //       this.textOrderMany >= limitCount
      //     ? "many"
      //     : "all";
    },
    ...mapGetters(["getUsername", "getUserId", "getPickOrderCount"]),
    isOrderStatus() {
      return this.$route.name === "singleShopInfo";
    }
  },
  methods: {
    // 获取用户的权限状态
    async getUserStatus() {
      return await getPickGoodsUserStatus({
        userId: this.getUserId
      }).then(res => {
        return res.result;
      });
    },
    /**
     * 点击拣货按钮进入拣货
     */
    clickLogin() {
      if (this.pickStatus) {
        this.$vux.toast.show({
          text: "没有能拣的商品",
          width: "2rem",
          type: "warn"
        });
      } else {
        if (this.$route.name === "singleShopInfo") {
          this.$router.push("singleOrder");
        } else {
          this.$router.push("/order");
        }
      }
    },
    /**
     * 扫码接单后自动接单
     */
    continueGetOrder() {
      this.handleGetOrder();
    },
    // 接单品单
    async handleGetSingleOrder() {
      this.$router.push("/home");
      let userStatus = await this.getUserStatus();
      if (userStatus !== 4) {
        // if(true){

        if (
          (this.btnStatus === "single" || this.btnStatus === "all") &&
          this.pickStatus
        ) {
          // if(true){
          getPickGoodsSingleOrder({ userId: this.getUserId }).then(res => {
            if (res.success === true) {
              this.isDrop.isGetSingleOrder = true;
              this.getSingleOrder = res.result;
              this.$nextTick(() => {
                this.$refs.getSingleOrder.$refs.car.focus();
              });

              this.$refs.getOrderNotice.play();
            } else if (res.success === 1) {
              this.$vux.toast.show({
                text: "订单冲突，请重新接单",
                width: "2rem",
                type: "warn"
              });
            } else {
              this.$vux.toast.show({
                text: "没有能接的订单",
                width: "2rem",
                type: "warn"
              });
            }
          });
        } else {
          this.$vux.toast.show({
            text: "不能接单品单",
            width: "2rem",
            type: "warn"
          });
        }
      }
    },
    /**
     * 接多品单
     */
    async handleGetOrder() {
      this.$router.push("/home/variousShopInfo");
      let userStatus = await this.getUserStatus();
      if (userStatus !== 4) {
        // if (true) {
        if (this.btnStatus === "many" || this.btnStatus === "all") {
          // if (true) {
          if (this.getPickOrderCount < 20) {
            getPickGoodsOrder({ userId: this.userId }).then(res => {
              if (res.success === true) {
                this.$refs.getOrder.$refs.car.focus();
                this.isDrop.isGetOrder = true;
                this.closeTimer();
                this.getOrder = {
                  orderInfo: res.result,
                  shopList: res.allShop
                };
                this.getOrder.YPSL = res.shopCount;

                this.$refs.getOrderNotice.play();
              } else if (res.success === 1) {
                this.$vux.toast.show({
                  text: "订单冲突，请重新接单",
                  width: "2rem",
                  type: "warn"
                });
              } else {
                this.$vux.toast.show({
                  text: "没有能接的订单",
                  width: "2rem",
                  type: "warn"
                });
              }
              this.isOrder.val = true;
            });
          } else {
            this.$vux.toast.show({
              text: "多品可接订单不能超过20个",
              width: "2rem",
              type: "warn"
            });
          }
        } else {
          this.$vux.toast.show({
            text: "不能接多品单",
            width: "2rem",
            type: "warn"
          });
        }
      }
    },

    closeTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    // 获取可接单品订单的数量
    getSingleOrderCount() {
      getPickGoodSingleOrderCount().then(res => {
        this.canGetSingleOrderCount = res.result;
      });
    },
    // 获取可接多品订单的数量
    getVariousOrderCount() {
      // 获取多订单的数量
      getPickGoodOrderCount().then(res => {
        this.canGetOrderCount = res.result;
      });
    },
    // 每5分钟判断有没有订单并按提示
    getOrderCount() {
      let count = 0;
      this.timer = setInterval(() => {
        this.getSingleOrderCount();
        this.getVariousOrderCount();
        // 如果是单品订单的页面
        if (isOrderStatus) {
          if (this.canGetSingleOrderCount > 0) {
            this.$refs.audio.play();
            let timerOut = setTimeout(() => {
              this.$refs.audio.pause();
              clearTimeout(timerOut);
            }, 30000);
          }
        } else {
          if (this.canGetOrderCount > 0) {
            this.$refs.audio.play();
            let timerOut = setTimeout(() => {
              this.$refs.audio.pause();
              clearTimeout(timerOut);
            }, 30000);
          }
        }

        // getPickGoodOrderCount().then(res => {
        //     this.canGetOrderCount = res.result;
        //     if (res.result > 0) {
        //         count++;
        //         this.$refs.audio.play();
        //     }
        //     let timerOut = setTimeout(() => {
        //         this.$refs.audio.pause();
        //         clearTimeout(timerOut);
        //     }, 30000);
        // });
      }, 300000);
    },
    getSingleMoreOrderCount() {
      getSingleMoreOrderCount({ userId: this.getUserId }).then(res => {
        if (res.success) {
          this.singleOrderCount = res.singleNum;
          this.moreOrderCount = res.moreNum;
        } else {
          this.singleOrderCount = 0;
          this.moreOrderCount = 0;
        }
      });
    }
  },
  async mounted() {
    this.getSingleOrderCount();
    this.getVariousOrderCount();
    this.getOrderCount();
    this.getSingleMoreOrderCount();
  },
  destroyed() {
    this.closeTimer();
  }
};
</script>

<style lang="less" scoped>
@import "../style/public.less";
@import "../style/home.less";
</style>