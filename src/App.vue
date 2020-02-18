<template>
    <div id="app">
        <router-view v-if="isRouterAlive"/>
    </div>
</template>

<script>
    export default {
        name: "App",
        provide() {
            return {
                reload: this.reload
            };
        },
        data() {
            return {
                isRouterAlive: true
            };
        },
        methods: {
            reload() {
                this.isRouterAlive = false;
                this.$nextTick(() => {
                    this.isRouterAlive = true;
                });
            }
        }
    };
</script>

<style lang="less">
@import "~style/base.less";
#app {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  
}
 .weui-dialog__hd {
    font-size: 12px;
}
/*竖屏*/
// @media screen and (orientation: portrait){
// 　#app{
//       transform: rotateZ(90deg);
// }
// }
/*横屏*/
// @media screen and (orientation: landscape){
// 　body{background:#000}
// }
</style>
