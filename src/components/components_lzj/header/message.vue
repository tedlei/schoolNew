<template>
    <div class="message">
        <el-dropdown @visible-change="isShow"
                     ref="dropdown" @command="toMessage">
            <div class="el-dropdown-link" style="color: #fff">
                <div v-show="messageList.length" class="el-dropdown-menu-left1-main-num"></div>
                <span>消息</span>
                <i class="iconfont icondown"></i>
            </div>

            <!-- 登陆时的状态 -->
            <el-dropdown-menu slot="dropdown" class="el-dropdown-menu-left1 fx" ref="dropdown-menu">
                <el-dropdown-item class="el-dropdown-menu-left1-tit" style="color: #333;">
                    消息
                    <span
                            v-show="messageList.length"
                            class="clear col999 pointer"
                            @click.stop="centerDialogVisible = true">清空</span>
                </el-dropdown-item>

                <!-- 无消息 -->
                <el-dropdown-item
                        divided
                        class="el-dropdown-menu-left1-main"
                        v-show="!messageList.length">
                    <svg class="icon" aria-hidden="true" style="font-size: 150px;">
                        <use xlink:href="#iconwuxiaoxi1"></use>
                    </svg>
                    <div><span>没有新消息</span></div>
                </el-dropdown-item>

                <!-- 有消息 -->
                <el-dropdown-item
                        divided
                        v-show="messageList.length"
                        class="el-dropdown-menu-left1-main el-dropdown-menu-left1-main1">
                    <div @click.stop="()=>{}">
                        <el-dialog
                                class="dialog main_message"
                                :modal="false"
                                title="确定清空？"
                                :visible.sync="centerDialogVisible"
                                center
                                :modal-append-to-body="false"
                                :destroy-on-close="true">
                                <span slot="footer" class="dialog-footer">
                                    <el-button @click="centerDialogVisible = false">取 消</el-button>
                                    <el-button type="primary" @click="clearMessage">确 定</el-button>
                                </span>
                        </el-dialog>
                    </div>
                    <div v-for="(item, i) in messageList" :key="i" class="pointer fx main_message" @click="toMsgPage(item.name, item.id)">
                        <div class="el-dropdown-menu-left1-main-num"></div>
                        <span class="col333">{{item.nickName}}</span>
                        <span class="col666 messageContent">{{item.messageContent}}</span>
                    </div>
                </el-dropdown-item>

                <el-dropdown-item divided class="el-dropdown-menu-left1-footer" command="/systemMessage">
                    <span>查看更多消息</span>
                    <i class="iconfont icondayu"></i>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapState} from 'vuex'
    import {Dropdown, DropdownMenu, DropdownItem, Dialog, Button} from 'element-ui';
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(Dialog);
    Vue.use(Button);
    export default {
        data(){
            return {
                centerDialogVisible: false, // 清楚框是否显示
                messageList: []
            }
        },
        methods: {
            clearMessage(){
                this.centerDialogVisible = false;
                // 调用接口清除信息

                this.messageList = [];
            },
            /**
             * isShow 监听消息下拉框是否显示
             * @param  {[Boolean]}  val [false 关闭清除框]
             * @return {void}
             */
            isShow(val){
                if (val) return;
                this.centerDialogVisible = false
            },
            /**
             * toMsgPage   鉴别参数
             * val  判断是 系统还是客服
             */
            async toMsgPage(val, id){
                let query = {};
                if (val === 'sys') {
                    query.category = 1
                } else query.category = 2;
                // 将消息改为已读
                await this.readTheMessage(query.category, id);

                let current = this.$router.history.current;
                // 如果当前处于消息页面 则只更改category值
                if (current.path === '/systemMessage' && current.query.category*1 === query.category) {
                    this.$store.commit('changeMessageSync', true);
                    return;
                }
                this.push({path: '/index/systemMessage', query});
            },
            toMessage(url){
                if (!url) return;
                let query = {};
                if (url === '/systemMessage') query.category = 1;
                this.push({path: '/index' + url, query})
            },
            /**
             * 获取未读消息列表
             */
            getMessage(){
                if (this.userInfo) {
                    function addData(data, arr, name){
                        // 大于5取5  反之正常取
                        let len = data.length > 5 ? 5 : data.length;
                        for (let i = 0; i < len; i++) {
                            data[i].name = name;
                            arr.push(data[i]);
                        }
                    }

                    this.fetch({
                        url: 'userMessage/getMessage.do',
                        method: 'post',
                        data: {
                            userId: this.userInfo.schoolUser.id + '',
                        }
                    }, 2).then((res)=>{
                        let {mess, sys} = res.data;
                        let arr = [];
                        // if (kefu.length) {
                        //     addData(kefu, arr, 'kefu')
                        // }
                        if (mess.length) {
                            addData(mess, arr, 'mess')
                        }
                        if (arr.length < 5 && sys.length) {
                            addData(sys, arr, 'sys')
                        }
                        
                        this.messageList = arr;
                    });
                }
            },
            /**
             * 将消息改为已读
             */
            readTheMessage(num, id){
                num = num + '';
                if (num !== '1') {
                    num = '3';
                }
                this.fetch({
                    url: 'userMessage/updateMessage.do',
                    method: 'post',
                    data: {
                        id: id,
                        userId: this.userInfo.user.id + '',
                        num
                    }
                }, 2).then(()=>{
                    // 状态更改重新获取未读消息
                    this.getMessage();
                })
            }
        },
        mounted() {
            this.getMessage();
        },
        computed: {...mapState(['headMessageSync'])},
        watch: {
            headMessageSync(value){
                if (value) {
                    this.getMessage();
                    this.$store.commit('changeHeadMessageSync', false);
                }
            },
        }
    }
</script>
<style src="./message.css"></style>
<style lang="less" scoped>
    .message{
        position: relative;
        font-size: 12px;
        color: #808080;
        .icondown{
            font-size: 12px;
        }
        .quit{
            color: #FF0000;
        }
    }

</style>