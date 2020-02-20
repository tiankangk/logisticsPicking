<template>
  <div class="yjs-home">
    <public-header></public-header>
    <div class="yjs-order">
      <div class="yjs-regin-home">
        <swiper :options="swiperOption" class="swiper-width">
          <swiper-slide v-for="(item,ind) in shopList" :key="ind">
            <x-button
              type="primary"
              mini
              :text="ind"
              :gradients="['#1acaa6', '#1acaa6']"
              @click.native="clickRegin(item)"
            ></x-button>
          </swiper-slide>
        </swiper>
      </div>
      <div class="yjs-content">
        <div class="yjs-content-sub">
          <div class="yjs-content-list" v-for="(item,ind) in allShopList" :key="ind">
            <div class="yjs-content-number">{{ind}}</div>
            <x-Table>
              <thead>
                <tr>
                  <th :style="{width:'6%'}">药品编码</th>
                  <th :style="{width:'20%'}">商品名称</th>
                  <th :style="{width:'8%'}">规格</th>
                  <th :style="{width:'26%'}">生产厂家</th>
                  <th :style="{width:'5%'}">数量</th>
                  <th :style="{width:'8%'}">产品批号</th>
                  <th :style="{width:'11%'}">货架位号</th>
                  <th :style="{width:'8%'}">有效期至</th>
                  <th :style="{width:'9%'}">货篮编码</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(shop,ind) in item"
                  :style="{background:shop.JHZT == 'T'?'':'#e6e12f'}"
                  :key="ind"
                >
                  <td>{{shop.YPBM}}</td>
                  <td>{{shop.YPMC}}</td>
                  <td>{{shop.YPGG}}</td>
                  <td>{{shop.SCCJ}}</td>
                  <td>{{shop.SL}}</td>
                  <td>{{shop.SCPH}}</td>
                  <td>{{shop.HWBH}}</td>
                  <td>{{shop.YXQZ | formatTime}}</td>
                  <td>{{shop.carid}}</td>
                </tr>
              </tbody>
            </x-Table>
          </div>
        </div>
      </div>
    </div>

    <div class="yjs-modal" v-show="isHide">
      <div class="yjs-modal-home">
        <div class="model-header">
          <div class="yjs-content-number">{{areaNum+'区'}}</div>
          <div class="yjs-modal-edit" @click="clickClose">
            <img src="~assets/error.png" alt />
          </div>
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
              <flexbox-item>{{baseInfo.KCSL}}</flexbox-item>
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
                <flexbox-item :span="4" :style="{fontWeight:'bold',color:'blue'}">{{baseInfo.carid}}</flexbox-item>
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
          </div>
        </div>
        <!-- <div :style="{flexGrow:1}">
          <group>
            <cell-form-preview class="table-fontsize" :list="shopInforList"></cell-form-preview>
          </group>
        </div>-->
        <div class="yjs-modal-input">
          <group>
            <x-input
              ref="cargoRackInput"
              title
              @keyup.enter.native="handlePick"
              label-width="100"
              placeholder="请扫描货位架编号"
              v-model="cargoRackNum"
            ></x-input>
            <x-button class="back-color" @click.native="handleJumpPick">跳过</x-button>
          </group>
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
    <!-- <popup-header
            left-text="取消"
            title="选择"
            show-bottom-border="true"
    ></popup-header>-->
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
  Flexbox,
  FlexboxItem,
  Radio
} from "vux";
import {
  getPickGoodsUserAllOrderShop,
  pickGoods,
  markReviewDiffOrder
} from "@/api";
import "swiper/dist/css/swiper.css";
import publicHeader from "@/components/header";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { setTimeout, clearTimeout } from "timers";
export default {
  name: "order",
  inject: ["reload"],
  components: {
    Flexbox,
    FlexboxItem,
    XTable,
    XInput,
    XButton,
    Group,
    Tab,
    TabItem,
    CellFormPreview,
    swiper,
    swiperSlide,
    publicHeader,
    PopupHeader,
    Popup,
    Radio
  },
  data() {
    return {
      isPopup: false,
      chooseVal: "批号不符",
      options: ["批号不符", "数量不足", "货位架不存在"],
      isHide: false,
      cargoRackNum: "",
      areaNum: "",
      shopList: {},
      allShopList: {},
      baseInfo: {},
      phList: [],
      swiperOption: {
        slidesPerView: 6
      },
      //   shopInforList: [],
      pickShopList: [
        {
          YPBM: "",
          YPMC: "",
          YPGG: "",
          SCCJ: "",
          SL: "",
          SCPH: "",
          HWBH: "",
          YXQZ: "",
          carid: ""
        }
      ]
    };
  },

  filters: {
    formatTime(val) {
      return val ? val.split("T")[0] : "";
    }
  },
  watch: {
    pickShopList(newVal) {
      console.log("newVal", newVal);
      if (0 in newVal) {
        this.baseInfo = newVal[0];
        this.phList = [
          {
            scph: newVal[0].SCPH,
            sl: newVal[0].SL
          }
        ];
        //   newVal.map(item => {
        //   return {
        //     scph: item.SCPH,
        //     sl: item.SL
        //   };
        // });
      } else {
        this.baseInfo = {};
        this.phList = [];
      }
      //   this.shopInforList = [
      //     {
      //       label: "药品编码",
      //       value: newVal[0].YPBM
      //     },
      //     {
      //       label: "商品名称",
      //       value: newVal[0].YPMC
      //     },
      //     {
      //       label: "规格",
      //       value: newVal[0].YPGG
      //     },
      //     {
      //       label: "计量单位",
      //       value: newVal[0].JLDW
      //     },
      //     {
      //       label: "生产厂家",
      //       value: newVal[0].SCCJ
      //     },
      //     {
      //       label: "",
      //       value: `<div style="width:100%;border-top:1px solid black;"></div>`
      //     },
      //     {
      //       label: "数量",
      //       value: `<span style="font-weight:bold;color:red;">${newVal[0].SL}</span>`
      //     },
      //     {
      //       label: "产品批号",
      //       value: `<span style="font-weight:bold;color:#0ec713;">${newVal[0].SCPH}</span>`
      //     },

      //     {
      //       label: "有效期至",
      //       value: `<span style="font-weight:bold;color:red;">${
      //         newVal[0].YXQZ ? newVal[0].YXQZ.split("T")[0] : ""
      //       }</span>`
      //     },
      //     {
      //       label: "货篮编码",
      //       value: `<span style="font-weight:bold;color:#0ec713;">${newVal[0].carid}</span>`
      //     },
      //     {
      //       label: "货架位号",
      //       value: `<span style="font-weight:bold;color:red;">${
      //         newVal[0].HWBH ? newVal[0].HWBH.toUpperCase() : ""
      //       }</span>`
      //     }
      //   ];
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
      // this.$vux.confirm.show({
      //     content: "确定要跳过拣货吗",
      //     title: "提示",
      //     // 组件除show外的属性
      //     onCancel() {},
      //     onConfirm() {
      let userId = localStorage.getItem("userId");
      let person = localStorage.getItem("mc");
      markReviewDiffOrder({
        shopInfo: that.pickShopList[0],
        // orderId: that.pickShopList[0].ID,
        person,
        reason: this.chooseVal
        // ypbm: that.pickShopList[0].YPBM,
        // scph: that.pickShopList[0].SCPH
      }).then(res => {
        if (res.success) {
          if (that.pickShopList.length === 1) {
            delete that.shopList[that.areaNum];

            if (Object.keys(that.shopList).length == 0) {
              that.reload();
            } else {
              that.areaNum = Object.keys(that.shopList)[0];
              that.clickRegin(that.shopList[Object.keys(that.shopList)[0]]);
            }
          } else {
            that.pickShopList.splice(0, 1);
            that.confirmValidity(that.pickShopList[0].YXQZ);
          }
        } else {
          this.$vux.toast.show({
            text: `拣货跳过失败`,
            width: "3rem",
            type: "warn"
          });
        }
      });
      // }
      // });
      this.isPopup = false;
    },

    /**
     * 跳过拣货
     */
    handleJumpPick() {
      this.isPopup = true;
      // let pickShopList = this.pickShopList;
      // let confirmValidity = this.confirmValidity;
      // let shopList = this.shopList;
      // let areaNum = this.areaNum;
      // let reload = this.reload;
    },
    /**
     * 获得商品距离有效期的时间
     */
    getValidityTime(time) {
      let nowTime = new Date().getTime();
      let validityTime = new Date(time).getTime();
      let distanceTime = validityTime - nowTime;
      return distanceTime / 2592000000;
    },
    /**
     * 不同时间段提示不同的内容
     */
    confirmValidity(time) {
      let validityMonth = this.getValidityTime(time);
      if (validityMonth <= 6 && validityMonth > 3) {
        this.$vux.toast.show({
          text: "距有效期小于6个月",
          width: "3rem",
          type: "warn"
        });
      } else if (validityMonth <= 3 && validityMonth > 1) {
        this.$vux.toast.show({
          text: "距有效期小于3个月",
          width: "3rem",
          type: "warn"
        });
      } else if (validityMonth <= 1) {
        this.$vux.toast.show({
          text: "距有效期小于1个月",
          width: "3rem",
          type: "warn"
        });
      }
    },
    /**
     * 点击区按钮，弹出对应商品信息
     */
    clickRegin(shopInfor) {
      this.pickShopList = shopInfor;
      this.confirmValidity(this.pickShopList[0].YXQZ);
      this.isHide = true;
      this.$nextTick(() => {
        this.$refs.cargoRackInput.focus();
      });
      this.areaNum = shopInfor[0].FQBH;
    },
    /**
     * 关闭弹出的商品信息
     */
    clickClose() {
      this.reload();
    },
    /**
     * 扫货位架开始拣货
     */
    handlePick() {
      let timer = setTimeout(() => {
        let cargoRackNum = this.cargoRackNum
          ? this.cargoRackNum.replace(/\s+/g, "").toLowerCase()
          : "";
        let HWBH = this.pickShopList[0].HWBH
          ? this.pickShopList[0].HWBH.replace(/\s+/g, "").toLowerCase()
          : "";
        if (
          cargoRackNum == HWBH
          // this.cargoRackNum.replace(/\s+/g, "").toLowerCase() ==
          // this.pickShopList[0].HWBH.replace(/\s+/g, "").toLowerCase()
        ) {
          let userId = localStorage.getItem("userId");
          pickGoods({
            orderId: this.pickShopList[0].ID,
            userId,
            ypbm: this.pickShopList[0].YPBM,
            scph: this.pickShopList[0].SCPH
          }).then(res => {
            if (res.success) {
              this.$vux.toast.show({
                text: `拣货完成，拣货篮号<span style="color:red;">${this.pickShopList[0].carid}</span>`,
                width: "3rem",
                type: "success"
              });
              if (this.pickShopList.length === 1) {
                // this.reload();
                delete this.shopList[this.areaNum];
                if (Object.keys(this.shopList).length == 0) {
                  this.reload();
                } else {
                  this.areaNum = Object.keys(this.shopList)[0];
                  this.clickRegin(this.shopList[Object.keys(this.shopList)[0]]);
                }
              } else {
                this.pickShopList.splice(0, 1);
                this.confirmValidity(this.pickShopList[0].YXQZ);
              }
              this.$refs.successAudio.play();
            } else {
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
        this.cargoRackNum = "";
        this.$refs.cargoRackInput.focus();
        clearTimeout(timer);
      }, 500);
    },
    /**
     * 给对象的属性排序
     */
    sortNameFun(obj) {
      var newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
      var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
      for (var i = 0; i < newkey.length; i++) {
        //遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
      }
      return newObj; //返回排好序的新对象
    },
    /**
     * 给对象的属性的值排序
     */
    sortValFun(prop) {
      return (obj1, obj2) => {
        if (obj2[prop] && obj1[prop]) {
          return obj1[prop].slice(4) - obj2[prop].slice(4);
        }
      };
    },
    transformResult(result, sortVal) {
      let shopList = {};
      result.forEach(item => {
        if (!Array.isArray(shopList[item.FQBH])) {
          shopList[item.FQBH] = [];
        }
        shopList[item.FQBH].push(item);
      });
      let newShopList = this.sortNameFun(shopList);
      console.log("sortVal", sortVal);
      for (let item in newShopList) {
        // if (newShopList[item].HWBH) {
        newShopList[item] = newShopList[item].sort(this.sortValFun(sortVal));
        // }
      }
      // this.shopList = this.sortNameFun(shopList);
      return newShopList;
    }
  },
  mounted() {
    let userId = localStorage.getItem("userId");
    this.$vux.loading.show({
      text: "Loading"
    });
    getPickGoodsUserAllOrderShop({ userId }).then(res => {
      this.$vux.loading.hide();
      // let shopList = {};
      if (res.result) {
        this.shopList = this.transformResult(res.result, "HWBH");
        this.allShopList = this.transformResult(res.resultAll, "JHRQ");
        // res.result.forEach(item => {
        //     if (!Array.isArray(shopList[item.FQBH])) {
        //         shopList[item.FQBH] = [];
        //     }
        //     shopList[item.FQBH].push(item);
        // });
        // console.log("shopList", shopList);
        // let newShopList = this.sortNameFun(shopList);
        // for (let item in newShopList) {
        //     console.log("item1", newShopList[item]);
        //     // if (newShopList[item].HWBH) {
        //     newShopList[item] = newShopList[item].sort(
        //         this.sortValFun("HWBH")
        //     );
        //     // }
        // }
        // console.log("newShopList", newShopList);
        // // this.shopList = this.sortNameFun(shopList);
        // this.shopList = newShopList;
      } else {
        this.$router.push({ path: "/home" });
      }
    });
  }
};
</script>

<style lang="less" scoped>
@import "../style/public.less";
@import "../style/order.less";
.table-fontsize {
  font-size: 22px;
}
.swiper-width {
  width: 100%;
}
.yjs-modal-input /deep/ .weui-cells {
  margin-top: 0;
}
.back-color {
  background: #1eb5d2;
}
.popup-content {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  width: 80%;
  left: 50%;
  transform: translateX(-50%);
  // padding: 0 1rem;
}
.yjs-table-box {
  overflow: auto;
  // font-size: 20px;
  flex-grow: 1;
  padding: 10px;
}
.yjs-modal-input /deep/ .weui_icon_clear {
  font-size: 30px !important;
}
.mainContent {
  //   height: 100%;
  // overflow: auto;
  font-size: 0.28rem;
  line-height: 0.35rem;
  .label {
    text-align: center;
    color: grey;
  }
  /deep/ .vux-flexbox-item {
    margin-left: 0 !important;
    padding: 5px 0;
  }
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
.top-line::before {
  content: "";
  position: absolute;
  border: 1px solid black;
  transform: scaleY(0.5);
  width: 100%;
  height: 0;
  left: 0;
  top: 0;
}
.shadow {
  margin: 5px;
  box-shadow: 0 0 4px 2px red;
}
</style>