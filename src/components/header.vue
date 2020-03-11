<template>
  <div class="header">
    <div class="pull-down">
      <div class="pull-left">
        <x-icon @click="showHeader" type="ios-arrow-down" size="30"></x-icon>
      </div>
      <div class="pull-right">
        <x-icon type="ios-help-empty" @click="handleAbnormal" size="30"></x-icon>
      </div>
    </div>
    <transition name="bounce">
      <div v-if="isShow" class="yjs-title" :style="{'z-index':zIndexVal}">
        <div class="title">
          <x-icon type="ios-arrow-left" style="color:#fff;" size="40" @click="goback"></x-icon>
          <div class="username">{{username}}</div>
        </div>
      </div>
    </transition>
    <modal
      width="90%"
      v-model="isModal"
      title="异常订单"
      @on-ok="submitAbnormal"
      @visibleChange="visibleChange"
    >
      <x-input
        title="商品信息"
        :style="{fontSize:'0.3rem'}"
        v-model="shopInfo"
        placeholder="请输入商品名称/条码/助记码/拣货篮"
        @on-enter="handleSearch"
      ></x-input>
      <d-table :columns="columns" :data="data" height="4rem" @on-selection-change="selectChange"></d-table>
    </modal>
  </div>
</template>

<script>
import {
  getMobileAbnormalOrderShop,
  changePickGoodAbnormalOrderStauts
} from "api";
import { mapGetters } from "vuex";
export default {
  name: "publicHeader",
  inject: ["reload"],
  data() {
    return {
      isModal: false,
      shopInfo: "",
      username: "",
      isShow: false,
      zIndexVal: 49,
      data: [],
      chooseAbnormalRow: {},
      columns: [
        {
          type: "radio",
          minWidth: 60,
          align: "center"
        },

        {
          title: "单据编号",
          minWidth: 120,
          key: "id"
        },
        {
          title: "客户名称",
          minWidth: 120,
          key: "DWMC"
        },

        {
          title: "药品编码",
          minWidth: 100,
          key: "YPBM"
        },
        {
          title: "生产批号",
          minWidth: 100,
          key: "SCPH"
        },
        {
          title: "药品名称",
          minWidth: 120,
          key: "YPMC"
        },
        {
          title: "药品规格",
          minWidth: 100,
          key: "YPGG"
        },
        {
          title: "剂型名称",
          minWidth: 80,
          key: "JXMC"
        },
        {
          title: "生产厂家",
          minWidth: 150,
          key: "SCCJ"
        },
        {
          title: "计量单位",
          minWidth: 80,
          key: "JLDW"
        },
        {
          title: "订单数量",
          minWidth: 80,
          key: "SL"
        },
        {
          title: "货位编号",
          minWidth: 100,
          key: "HWBH"
        },
        {
          title: "拣货篮号",
          minWidth: 80,
          key: "carid"
        },

        {
          title: "差错原因",
          minWidth: 120,
          key: "YCYY"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["getUserId"])
  },
  methods: {
    visibleChange(val) {
      if (!val) {
        this.chooseAbnormalRow = {};
        this.shopInfo = "";
      }
    },
    handleSearch() {
      this.chooseAbnormalRow = {};
      this.handleAbnormal();
    },
    selectChange(selectList) {
      this.chooseAbnormalRow = selectList;
    },
    showHeader() {
      this.isShow = !this.isShow;
    },
    goback() {
      this.$router.push({ path: "/" });
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("mc");
    },
    handleAbnormal() {
      let data = {
        userId: this.getUserId,
        YPBM: this.shopInfo
      };
      this.$vux.loading.show({
        text: "Loading"
      });
      getMobileAbnormalOrderShop(data).then(res => {
        this.$vux.loading.hide();
        if (res.code === 200) {
          this.data = res.result;
          this.isModal = true;
        } else {
          this.data = [];
          this.$vux.toast.show({
            text: `没有异常订单`,
            width: "3rem",
            type: "warn"
          });
        }
      });
    },
    submitAbnormal() {
      if (0 in Object.keys(this.chooseAbnormalRow)) {
        this.chooseAbnormalRow.choosePeople = 1;
        changePickGoodAbnormalOrderStauts(this.chooseAbnormalRow).then(res => {
          if (res.code === 200) {
            this.$vux.toast.show({
              text: "恢复成功",
              time: 500,
              width: "2rem"
            });
            this.reload();
          } else {
            this.$vux.toast.show({
              text: `恢复失败`,
              width: "3rem",
              type: "warn"
            });
          }
        });
      } else {
        this.$vux.toast.show({
          text: `请选择订单`,
          width: "3rem",
          type: "warn"
        });
      }
    }
  },
  mounted() {
    let isInHome = this.$route.fullPath.includes("home");
    this.isShow = isInHome ? true : false;
    this.zIndexVal = isInHome ? 0 : 49;
    this.username = localStorage.getItem("mc");
  }
};
</script>

<style lang="less" scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    top: -100%;
  }
  50% {
    top: -50%;
  }
  100% {
    top: 0;
  }
}

.header {
  .pull-down {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    position: fixed;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    // padding: 0 30px;
    // background: #20a7d0;
    font-size: 18px;
    overflow: hidden;
    z-index: 50;
    display: flex;
    .pull-left {
      background: #20a7d0;
      padding: 0 15px;
    }
    .pull-right {
      background: red;
      padding: 0 15px;
    }
    .icon-red {
      color: #fff;
    }
  }
}

.yjs-title {
  width: 90%;
  position: absolute;
  top: 0rem;
  left: 50%;
  // padding: 0 10px;
  transform: translateX(-50%);
  // width: 8rem;
  height: 1.2rem;
  line-height: 1.2rem;
  // margin-left: -4rem;
  text-align: center;
  border-radius: 10px;
  background: linear-gradient(left, #1eb5d2, #1acaa6);
  background: -webkit-linear-gradient(left, #1eb5d2, #1acaa6);
  box-shadow: 0 5px 15px #ddd;
  .title {
    display: flex;
    justify-content: space-between;
    font-size: 30px;
    color: #fff;
    align-items: center;
    padding: 0 20px;
  }
}
</style>