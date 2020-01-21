<template>
    <div class="coupon fx col333">
        <h4>
            <span  @click="back" class="pointer">优惠劵</span>
            <span v-if="!addShow" class="coupon">已使用优惠券200张</span>
            <i v-if="addShow" class="iconfont icondayu"></i>
            <span v-if="addShow">优惠券添加</span>
        </h4>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
            back(){
                if (this.$route.path === '/index/coupon') return;
                this.pop()
            }
        },
        computed: {
            addShow(){return this.$route.path !== '/index/coupon'}
        }
    }
</script>

<style lang="less" scoped>
    .coupon{
        flex: 1;
        flex-direction: column;
        background-color: #fff;
        padding: 20px;
        h4 {
            padding-bottom: 20px;
            font-size: 18px;
            border-bottom: 1px solid #E6E6E6;
            .coupon{
                margin-left: 10px;
                font-size: 18px;
                color:rgb(51,51,51);
            }
            .iconfont{
                position: relative;
                top: -1.5px;
                font-size: 13px;
            }
        }
    }
</style>