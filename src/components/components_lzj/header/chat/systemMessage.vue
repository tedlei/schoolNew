<template>
    <div class="msg fx">
        <div class="main fx" ref="msg_main">
            <div class="left-nav col999">
                <span class="fx fxCenter pointer" :class="cutBool !== 2  ? 'bgc-fff col333' : ''"
                      @click="cut(1)">系统</span>
                <span class="fx fxCenter pointer" :class="cutBool === 2 ? 'bgc-fff col333' : ''"
                      @click="cut(2)">聊天</span>
            </div>
            <messageList v-if="!isChat"
                         :cutBool="cutBool"
                         @changeChat="changeChat"
                         :oldCurrentPage1.sync="oldCurrentPage1"
                         :oldCurrentPage2.sync="oldCurrentPage2"
                         :oldCurrentPage3.sync="oldCurrentPage3"></messageList>
            <chat v-else :cutBool="cutBool"></chat>
        </div>
    </div>
</template>

<script>
    import messageList from "./messageList";
    import chat from "./chat";

    export default {
        components: {messageList, chat},
        data(){
            return {
                cutBool: 1,  // 系统与聊天的切换
                isChat: false,  // 是否打开当前下的聊天界面
                // 左侧对应的每一个右侧聊天界面的开关
                id1: null,   // 系统聊天界面存储的聊天用户id
                id2: null,   // 客服界面存储的聊天用户id
                id3: null,   // 学校存储的聊天用户id
                oldCurrentPage1: 1,     // 保存的系统消息页码
                oldCurrentPage2: 1,     // 保存的客服消息页码
                oldCurrentPage3: 1,     // 保存的学校消息页码
            }
        },
        methods: {
            // 左侧点击切换 更改num值  status值获取为对应的开关值
            cut(val){
                let {path} = this.$route,
                    id = 0;

                switch (val) {
                    case 1:
                        id = this.id1;
                        break;
                    case 2:
                        id = this.id2;
                        break;
                    case 3:
                        id = this.id3;
                        break;
                }

                let query = {};
                query.category = val;
                // 如果为true  则开启聊天界面 并传入聊天用户id
                if (id) query.id = id;
                this.push({path, query});
            },
            // 点击进入聊天界面  对应的status改为1 开启状态
            changeChat(userId, schoolId){
                let rt = this.$route;
                this.push({path: rt.path, query: {category: this.cutBool, id: userId}});

                let val = this.cutBool;
                switch (val) {
                    case 1:
                        this.id1 = schoolId;
                        break;
                    case 2:
                        this.id2 = schoolId;
                        break;
                    case 3:
                        this.id3 = schoolId;
                        break;
                }
            },
            // 每次路由更改， 更新对应的num与status值
            init(e){
                let category = e.query.category*1,
                    id = e.query.id;
                this.cutBool = category;
                switch (category) {
                    case 1:
                        this.id1 = id;
                        break;
                    case 2:
                        this.id2 = id;
                        break;
                    case 3:
                        this.id3 = id;
                        break;
                }

                this.isChat = !!id;
            }
        },
        created(){
            this.init(this.$route)
        },
        watch: {
            $route(e){
                this.init(e)
            }
        },
        mounted() {
            this.showScroll('msg_main');
        }
    }
</script>

<style scoped lang="less">
    .msg{
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
        .main{
            flex: 1;
            background-color: #fff;
            border-radius:5px;
            .left-nav{
                width: 80px;
                padding-top: 10px;
                background-color: #E6E6E6;
                border-radius:0 5px 0 5px;
                span{
                    height: 60px;
                    width: 80px;

                }
                .fxCenter{
                    justify-content: center;
                    align-items: center;
                }
                .bgc-fff{
                    background-color: #fff;
                }
            }
        }
    }

</style>