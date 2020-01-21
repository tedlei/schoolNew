<template>
    <ul>
        <li v-for="(item, i) in navListData"
            :key="i"
            class="pointer"
            :class="(num || '0') === (i + '') ? 'li-bg' : ''"
            @click="cutNum(i, item.url)">
            <div class="li-tit fx">
                <span :class="'iconfont ' + item.iconfont"></span>
                <i>{{item.context}}</i>
                <span :style="{
                    visibility: item.rightIconfontShow ? 'visible' : 'hidden',
                    transform: item.isOptions ? 'rotate(90deg)' : 'rotate(0deg)'
                }"
                      class="iconfont icondayu"></span>
            </div>
            <div class="options fx" v-if="item.isOptions">
                <span v-for="(val, idx) in item.optionData"
                      :key="idx"
                      class="pointer"
                      @click.stop="secondOptions(val.optionUrl, i, idx)"
                      :class="i+ '-' + idx === num ? 'li-bg' : ''">
                    <em class="iconfont iconyousanjiao"></em>
                    <i>{{val.text}}</i>
                </span>
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        data(){
            return {
                num: 0, // 一级导航切换
                navListData: []
            }
        },
        props: ['listData'],
        methods: {
            cutNum(i, url){
                if(this.isLogin)return
                if (url !== 'current') {
                    // 存在二级菜单时
                    if (url) url = '/' + url;
                    let param = '?id=' +  i;
                    if (!i) param = '';
                    this.push("/index" + url + param);
                }
                this.navListData[i].isOptions = !this.navListData[i].isOptions;
            },
            // 点击二级导航
            secondOptions(optionUrl, i, idx){
                if(this.isLogin)return
                this.push('/index/' + optionUrl + '?id=' + i + '-' + idx);
            }
        },
        created(){
            this.num = this.$route.query.id;
            // 处理navListData对象。
            let navListData = this.parse(this.listData);
            for (let i = 0, len = navListData.length; i < len; i++){
                let isShow = false;
                if (!navListData[i].optionData) {
                    navListData[i].optionData = [];
                } else isShow = true;
                // 控制右边icon图片是否显示
                navListData[i].rightIconfontShow = isShow;

                // 控制是否显示二级菜单
                navListData[i].isOptions = false;
            }
            this.navListData = navListData;
        },
        watch: {
            $route(route){
                this.num = route.query.id;
            }
        },
        computed: {
            isLogin(){
                let user = this.getItem('userInfo');
                return user?false:true;
            }
        },
    }
</script>

<style lang="less" scoped>
    ul{
        flex: 1;
        background-color: #47525E;
        padding-top: 20px;
        li{
            .li-tit{
                align-items: center;
                justify-content: center;
                color: #fff;
                padding: 16px 30px 16px 46px;
                & span:nth-child(1){
                    font-size: 18px;
                }
                i{
                    display: block;
                    width: 70px;
                    font-size: 16px;
                    margin: 0 20px;
                }
                & span:nth-last-child(1){
                    position: relative;
                    top: 2px;
                }
                .icondayu{
                    font-size: 12px;
                }
                .options{
                    flex-direction: column;
                }
            }
            .options{
                flex-direction: column;
                span{
                    box-sizing: border-box;
                    display: block;
                    width: 100%;
                    padding: 16px 0 16px 30px;
                    background-color: #47525E;
                    color: #fff;
                    text-align: center;
                    .iconyousanjiao{
                        position: relative;
                        top: -2px;
                        font-size: 14px;
                    }
                    i{
                        font-size: 16px;
                    }
                }
                .li-bg{
                    background-color: #2B3743;
                }
            }
        }
        .li-bg{
            background-color: #2B3743;
        }
    }
</style>