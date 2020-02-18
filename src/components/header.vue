<template>
    <div class="header">
        <div @click="showHeader" class="pull-down">
            <x-icon type="ios-arrow-down" size="30"></x-icon>
        </div>
        <transition name="bounce">
            <div v-if="isShow" class="yjs-title" :style="{'z-index':zIndexVal}">
                <div class="title">
                    <x-icon type="ios-arrow-left" style="color:#fff;" size="40" @click="goback"></x-icon>
                    <div class="username">{{username}}</div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "publicHeader",
        data() {
            return {
                username: "",
                isShow: false,
                zIndexVal: 49
            };
        },
        methods: {
            showHeader() {
                this.isShow = !this.isShow;
            },
            goback() {
                this.$router.push({ path: "/" });
                localStorage.removeItem("userId");
                localStorage.removeItem("username");
                localStorage.removeItem("mc");
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
        padding: 0 30px;
        background: #20a7d0;
        font-size: 18px;

        z-index: 50;
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