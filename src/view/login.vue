<template>
    <div class="yjs-home yjs-login">
        <div class="yjs-madal">
            <div class="yjs-avatar">
                <img src="~assets/p1.png" alt width="66%" />
            </div>
            <div class="yjs-warning" v-show="isLogin">
                <img src="~assets/error.png" alt />
                <span>用户没有启用或账号、密码错误</span>
            </div>
            <div class="yjs-input-sub">
                <group class="yjs-yjs-input-item">
                    <x-input
                        v-model="username"
                        @keyup.enter.native="clickLogin"
                        placeholder="请输入用户名"
                        label-width="100"
                    >
                        <img slot="label" src="~assets/adm.png" alt />
                    </x-input>
                </group>
                <group class="yjs-yjs-input-item">
                    <x-input
                        type="password"
                        placeholder="请输入密码"
                        @keyup.enter.native="clickLogin"
                        v-model="password"
                    >
                        <img slot="label" src="~assets/pw.png" alt />
                    </x-input>
                </group>

                <div class="yjs-btn">
                    <x-button
                        type="primary"
                        text="登录"
                        :gradients="['#2d8cf0', '#2d8cf0']"
                        @click.native="clickLogin"
                    ></x-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { XButton, Cell, XInput, Group, XImg } from "vux";
    import { mapMutations } from "vuex";
    import { pickGoodsLogin } from "@/api";
    export default {
        name: "login",
        components: {
            XButton,
            Cell,
            XInput,
            Group,
            XImg
        },
        data() {
            return {
                username: "",
                password: "",
                isLogin: false
            };
        },
        methods: {
            ...mapMutations(["setUsername"]),
            /**
             * 点击登录按钮
             */
            clickLogin() {
                if (!this.username) {
                    this.$vux.toast.show({
                        text: "请输入账户",
                        width: "2rem",
                        type: "warn"
                    });
                    return;
                } else if (!this.password) {
                    this.$vux.toast.show({
                        text: "请输入密码",
                        width: "2rem",
                        type: "warn"
                    });
                    return;
                } else {
                    pickGoodsLogin({
                        username: this.username,
                        password: this.password
                    }).then(res => {
                        if (res.success) {
                            this.setUsername({
                                username: res.result.DLMC,
                                id: res.result.BM,
                                mc: res.result.MC
                            });
                            this.$router.push({ path: "/home" });
                        } else {
                            this.isLogin = true;
                            setTimeout(() => {
                                this.isLogin = false;
                            }, 1000);
                        }
                    });
                }
            }
        }
    };
</script>

<style lang="less" scoped>
@import "../style/public.less";
@import "../style/login.less";
</style>