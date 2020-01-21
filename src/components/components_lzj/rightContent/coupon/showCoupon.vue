<template>
    <div class="coupon_main">
        <div class="coupon_main_tit fx">
            <span>优惠劵添加</span>
            <i class="pointer" @click="toAdd">添加</i>
        </div>
        <ul class="coupon_main_context fx">
            <li class="fx" v-for="(item, i) in couponNumber" :key="i">
                <span>{{item.money}}</span>
                <span>{{item.condition}}</span>
                <span>{{item.expirationTime}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                couponNumber: [
                    {
                        money: '10元学校优惠券',
                        condition: '满100元使用',
                        expirationTime: '有效日期至：2019-8-27'
                    },
                    {
                        money: '10元学校优惠券',
                        condition: '满100元使用',
                        expirationTime: '有效日期至：2019-8-27'
                    },
                    {
                        money: '10元学校优惠券',
                        condition: '满100元使用',
                        expirationTime: '有效日期至：2019-8-27'
                    }
                ]
            }
        },
        methods: {
            toAdd(){this.childRouteJump('add');}
        }
    }
</script>

<style lang="less" scoped>
    .coupon_main {
        flex: 1;
        overflow-y: auto;
        padding-top: 30px;
        .coupon_main_tit {
            align-items: center;
            i {
                width: 120px;
                height: 50px;
                margin-left: 30px;
                background-color: rgba(42, 176, 234, 1);
                color: #fff;
                text-align: center;
                line-height: 50px;
                border-radius: 5px;
            }
        }

        .coupon_main_context {
            flex-wrap: wrap;
            justify-content: space-between;
            padding: 0 50px;

            li {
                flex-direction: column;
                width: 380px;
                height: 235px;
                padding: 0 30px;
                margin-top: 30px;
                background-color: rgba(230, 230, 230, 1);
                border-radius: 5px;

                span {
                    margin-top: 27px;
                }
            }
        }
    }
</style>