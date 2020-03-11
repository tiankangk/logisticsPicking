<template>
  <span class="checkbox">
    <x-icon type="ios-checkmark-empty" size="30" :class="{active:value}" class="content"></x-icon>
    <input class="input" @change="handleChange" :checked="value" type="checkbox" />
  </span>
</template>

<script>
export default {
  name: "d_checkbox",
  props: {
    value: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  model: {
    prop: "value",
    event: "change"
  },

  methods: {
    handleChange(e) {
      this.$emit("change", e.target.checked);
    }
  }
};
</script>

<style lang="less" scoped>
.checkbox {
  position: relative;
  display: inline-block;
  width: 0.35rem;
  height: 0.35rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  overflow: hidden;
  .content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    z-index: 9;
  }
  .active {
    background-color: #2d8cf0;
  }
  .input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 10;
  }
}
</style>