<template>
  <div class="shade" v-if="isShow">
    <div class="modal" :style="{width:width}">
      <div class="modal-header">
        <div class="header-title">{{title}}</div>
        <x-icon type="ios-close-empty" size="40" class="icon-grey" @click="close"></x-icon>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer">
          <div>
            <x-button mini type="default" @click.native="close" :style="{marginTop:0}">取消</x-button>
            <x-button mini type="primary" @click.native="handleSure" :style="{marginTop:0}">确定</x-button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "modal",
  props: {
    isShow: {
      type: Boolean,
      default() {
        return false;
      }
    },
    title: {
      type: String,
      default() {
        return "";
      }
    },
    width: {
      type: String,
      default() {
        return "auto";
      }
    }
  },
  model: {
    prop: "isShow",
    event: "closed"
  },
  watch:{
    isShow(val){
      this.$emit('visibleChange',val);
    }
  },
  methods: {
    close() {
      this.$emit("closed", false);
    },
    handleSure(){
        this.$emit('on-ok');
    }
  }
};
</script>

<style lang="less" scoped>
.icon-grey {
  fill: #ccc;
}
.shade {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(55, 55, 55, 0.6);
  z-index: 99;
  overflow: auto;
  font-size: 0.4rem;
  .modal {
    position: relative;
    left: 50%;
    top: 1rem;
    transform: translateX(-50%);
    display: inline-block;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    min-width: 5rem;
    .modal-header {
      padding: 0.1rem;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .modal-body {
      
    }
    .modal-footer {
      padding: 0.1rem;
      border-top: 1px solid #ccc;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>