<template>
    <div v-if="hideError" class="right-content fx"
         :style="{justifyContent: cutBool*1 !== 2 ? 'flex-start' : 'space-between'}">
        <div class="title fx col333">
            <span class="iconfont iconzuo col999 pointer" @click="back"></span>
            <span>{{(function(){
                            let str = '系统消息';
                            if(cutBool*1 === 2) str = '动态消息列表';
                            return str;
                        }())}}</span>
            <span></span>
        </div>

        <!-- 根据日期显示消息 -->
        <div ref="scroll" class="right-content-main fx">

            <!-- 点击查看历史消息 -->
            <div v-show="cutBool*1===2 || cutBool*1===3" class="historyMessage pointer" @click="getHistoryMessage">{{historyText}}</div>

            <div v-for="(item, i) in dataList.list" :key="i">
                <div class="timer">{{item.timer}}</div>

                <!-- 聊天消息 根据id区分是发出的消息还是接受的消息 切换right-content-main-from 与 right-content-main-send类名  -->
                <div v-for="(value, index) in item.main" :key="index"
                     :class="value.messageSource === '2' ? 'right-content-main-from fx' : 'right-content-main-send fx'">
                    <img :src="value.messageSource === '2' ? dataList.fromImgSrc : dataList.sendImgSrc" alt="">
                    <!-- 聊天信息 -->
                    <div>
                        <span v-if="value.messageSource === '2'"
                                  style="display:block;margin-bottom: 9px;font-size: 16px;">{{value.teacherName}}</span>
                        <div class="details">
                            <p>{{value.messageContent}}</p>
                            <div class="triangle"></div><!-- 箭头 -->
                            <div class="delete pointer" @click="dlt(i, index, value.id)">删除</div>
                        </div>
                    </div>
                    <!-- 小时分钟时间 -->
                    <div class="hm">{{value.timer}}</div>
                </div>
            </div>
        </div>
        <div v-show="cutBool*1===2 || cutBool*1===3" class="footer">
            <div class="right-content-footer-message">
                <el-input
                        class="chat"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 3}"
                        placeholder="请输入内容"
                        @focus="focus"
                        @blur="blur"
                        @keydown.enter.native="enterSend"
                        v-model="input">
                </el-input>
                <span class="number col999">{{400 - input.length}}字</span>
            </div>
            <div class="send" :class="input.length ? 'isSend' : ''" @click="send(input, 'send')">发送</div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {Input} from 'element-ui'

    Vue.use(Input);

    // socket.io
    import socket from '../../../../../public/js/socket.io'

    export default {
        data(){
            return {
                pageNum: 0,
                pageSize: 10,
                historyText: '点击查看历史消息',
                input: '',
                oldScrollHeight: '',    // 更新历史之前保存更新之前的滚动高度
                authScrollHeight: false, // 当为true 则不触发更新生命周期
                dataList: {}
            }
        },
        props: ['cutBool'],
        methods:{
            focus(){
                let el = document.querySelector('.right-content-footer-message .chat .el-textarea__inner');

                el.style.backgroundColor = '#fff';
            },
            blur(){
                let el = document.querySelector('.right-content-footer-message .chat .el-textarea__inner');

                el.style.backgroundColor = '#FAFAFA';
            },
            init(r){
                let {category, id} = r.query;
                if (r.query.id) {
                    this.getDataList(category, id);
                }
            },
            /**
             * 获取聊天消息列表
             */
            getDataList(category, elId, dataList){
                let userInfo = this.userInfo;
                if (userInfo) {
                    let {pageNum, pageSize} = this;

                    if (dataList) {
                        pageNum = Math.ceil(dataList.sum/pageSize);
                    } else {
                        pageNum = 0;
                        // 获取已渲染消息数量
                        this.setItem('chatShowNumber', 0);
                        pageSize = Math.max(pageSize, this.getItem('chatShowNumber')*1);
                    }

                    let num = category*1 === 1 ? '4' : '0';  // 如果是获取系统消息则传入4 否则任意值

                    let userId = userInfo.schoolUser.id;
                    
                    this.fetch({
                        url: 'userMessage/getMessageDetails.do',
                        method: 'post',
                        data: {
                            userId, // 本人id
                            elId, // 聊天对象id
                            pageNum: pageNum.toString(),   // 页数
                            pageSize: pageSize.toString(), // 数量
                            num
                        }
                    }, 2).then((res)=>{
                        if (res.data.message === '没有该用户') {
                            // 未查找到用户 显示404
                            this.hideError = false;
                            this.authScrollHeight = null;
                            return;
                        } else this.hideError = true;
                        let data;
                        if (num === '4') {
                            // 为系统消息获取
                            res.data.messageSource = '2'; // 显示到接收消息方
                            data = [res.data];
                        }else data = res.data.object;
                        // 适配器 适配前端数据结构 start
                        let obj = {},
                            number = -1,
                            length = 0;
                        // 存在值则为点击查看历史消息触发
                        if (dataList) {
                            if (res.data.object.length === 0) {
                                this.historyText = '没有更多数据了';
                                return
                            }

                            length = Object.keys(dataList.list).length;
                            if (length) {
                                obj = dataList;
                                number = 0;
                            }
                        }

                        for (let i = 0, len = data.length; i < len; i++) {
                            let timer = data[i].time.split(' '),
                                timer1 = timer[0],
                                timer2 = timer[1].slice(0, 5);

                            // 是否已有当前 number 的属性存在  且存在属性对象值中的日期时间是否与当前日期时间相等
                            if (number > -1 && obj.list[number].main[0].time.slice(0, 10) === timer1) {
                                data[i].timer = timer2;
                                obj.list[number].main.unshift(data[i]);
                                obj.sum++;
                            } else {
                                // 反之则新增一个数组对象存储消息列表
                                // 获取总条数 设置存储消息的数组
                                if (number === -1) {
                                    obj.list = [];
                                    obj.sum = 0;
                                }
                                obj.sum++;
                                let d = {};
                                d.timer = timer1;
                                d.main = [];
                                data[i].timer = timer2;
                                d.main[0] = data[i];
                                obj.list.unshift(d);
                                if (!length)  number++;
                            }

                            // 等于则为所接收的消息
                            if (data[i].phone !== userInfo.user.phone) {
                                data[i].messageSource = '2'
                            }
                        }
                        obj.fromImgSrc = res.data.head;
                        obj.sendImgSrc = userInfo.user.head;
                        
                        // 未查找到数据时
                        if (typeof obj.sum === 'undefined') {
                            obj.sum = 0;
                            obj.list = [];
                        }
                        
                        // 适配器  end
                        this.dataList = obj;

                        // 获取当前显示数据的长度， 当刷新时设置pageSize为此数量
                        this.setItem('chatShowNumber', obj.sum);
                    });
                }
            },

            /**
             * 建立socket连接
             */
            createSocket(){
                let ws = socket('http://120.78.145.39:9108/');
                ws.on('communication', msg => {   // key 用于接受服务端定义为key的对应消息
                    console.log(msg,'接收过来的数据');
                    this.send(msg, 'from');
                });
                let schoolId = this.userInfo.schoolUser.id;
                ws.emit('username', 'user' + schoolId);
                this.socket = ws;
            },

            /**
             * 获取历史消息
             */
            getHistoryMessage(){
                // 使滚动条处于当前消息的位置不变
                this.authScrollHeight = false;
                // 传入当前显示数据  往里面添加
                let {category, id} = this.$route.query;
                this.getDataList(category, id, this.parse(this.dataList));

                this.closeUpdated();
            },

            /**
             * send  发送消息
             */
            send(input, from){
                // 滚动条滚动到底部
                this.authScrollHeight = true;

                let dataList = this.parse(this.dataList),
                    nowTimer = this.getTimer();

                dataList.sum++;

                if (!input.trim().length) {
                    this.$message('请输入内容');
                    return;
                }

                // dataList 中 选项的的data属性的数据
                let obj = {},
                    userInfo = this.userInfo;
                let schoolId = this.$route.query.id;
                let userId = userInfo.schoolUser.id;

                if (from === 'send') {
                    obj.messageContent = input;
                    obj.messageSource = '1';
                    obj.teacherName = userInfo.schoolUser.organizationName;
                } else {
                    let arr = input.split(',');
                    obj.messageContent = arr[0];
                    obj.messageSource = '2';
                    obj.teacherName = arr[1];
                }

                obj.schoolId = schoolId;    // 聊天对象id
                obj.userId = userId;     // 当前用户id
                obj.time = nowTimer;
                obj.timer = nowTimer.slice(11, -3);
                let nowDate = nowTimer.slice(0, 10);

                // 发送时间等于最后的日期  则往日期的data中添加数据
                if (dataList.list.length && nowDate === dataList.list[dataList.list.length - 1].timer) {
                    let dataObj = dataList.list[dataList.list.length - 1];
                    dataObj.main.push(obj);
                } else {    // 新一日的数据
                    let dataListOption = {};
                    dataListOption.timer = nowDate;
                    dataListOption.main = [];
                    dataListOption.main.push(obj);
                    dataList.list.push(dataListOption);
                }
                this.dataList = dataList;
                if (from === 'send') {
                    obj = this.parse(obj);
                    obj.Target = 'user' + schoolId;
                    obj.self = 'user' + userId;
                    obj.phone = userInfo.user.phone;
                    delete obj.timer;
                    
                    // 向套接字发送消息
                    this.socket.emit('communication', this.stringify(obj));
                }

                this.closeUpdated();

                // 发送完毕 初始化input值
                this.input = '';
            },
            // 关闭 beforeUpdate  updated
            closeUpdated(){
                let timer = setTimeout(()=>{
                    this.authScrollHeight = null;
                    clearTimeout(timer);
                })
            },
            dlt(i, index, id){
                let dataList  = this.parse(this.dataList);
                if (this.cutBool*1 !== 2) {
                    // 删除系统消息
                    this.fetch({
                        url: 'userMessage/removeSysMessage.do',
                        method: 'post',
                        data: {
                            id,
                            userId: this.userInfo.user.id
                        }
                    }, 2).then(()=>{
                        this.dataList = {};
                    })
                } else {
                    // 客服与学校消息删除单条消息
                    let schoolId = this.$route.query.id;
                    this.fetch({
                        url: 'userMessage/removeMessageDetails.do',
                        method: 'post',
                        data: {
                            id,
                            userId: this.userInfo.user.id,
                            schoolId,
                        }
                    }, 2).then(()=>{
                        dataList.sum--;
                        dataList.list[i].main.splice(index, 1);
                        if (dataList.list[i].main.length === 0) dataList.list.splice(i, 1);
                        this.dataList = dataList;
                    })
                }
                // this.dataList = dataList;
            },
            back(){
                let {path,query} = this.$route;
                this.push(path + '?category=' + query.category);
            },
            // enter键发送消息
            enterSend(){
                this.send(this.input, 'send');
            }
        },
        beforeUpdate(){
            // 输入时或者发送消息时不处罚获取oldScrollerHeight
            if (this.authScrollHeight === null || this.authScrollHeight) return;

            // 获取更新之前的滚动高度
            let el = this.$refs.scroll;
            this.oldScrollHeight = el.scrollHeight;
        },
        updated() {
            // 输入时不触发更新
            if (this.authScrollHeight === null) return;

            let el = this.$refs.scroll;
            
            if (this.authScrollHeight) {
                // 滚动到底部
                el.scrollTop = el.scrollHeight;
            } else {
                // 滚动条保持当前位置不变
                el.scrollTop = el.scrollHeight - this.oldScrollHeight;
            }
        },
        watch: {
            input(value){
                if (!value) return;
                this.authScrollHeight = null;
                if (value.length >= 400) {
                    this.input = value.substring(0, 400)
                }
            },
            $route(r){
                this.init(r);
            }
        },
        created() {
            this.userInfo = this.getItem('userInfo');

            // 阻止enter默认事件
            document.addEventListener('keydown', (e)=>{
                if (!e.shiftKey && e.key === 'Enter'){
                    e.preventDefault();
                }
            });
        },
        mounted() {
            this.createSocket();
            // 设置聊天框最大高度
            if (this.cutBool*1 === 2) {
                this.showScroll('scroll', true, 240, true);
            }

            this.init(this.$route);
        },
        destroyed() {
            // 断开socket连接
            // this.socket.close();
        }
    }
</script>

<style lang="less">
    .right-content{
        .chat {
            .el-textarea__inner{
                min-height: 50px;
                padding-right: 85px;
                background-color: #FAFAFA;
            }
        }
    }
</style>

<style scoped lang="less">
    .right-content{
        flex-direction: column;
        flex: 1;
        .title{
            justify-content: space-between;
            align-items: center;
            height: 71px;
            padding: 0 30px;
            border-bottom: 1px solid #e6e6e6;
            font-size: 16px;
        }
        .right-content-main{
            position: relative;
            overflow-x: hidden;
            flex: 1;
            flex-direction: column;
            align-content: flex-end;
            padding: 15px 30px 0;
            .historyMessage{
                position: absolute;
                left: 0;
                right: 0;
                width: 128px;
                margin: auto;
                padding: 4px 16px;
                color: #4a4a4a;
                font-size: 12px;
                background-color: #e1e1e1;
                border-radius: 16px;
            }
            .timer{
                text-align: center;
                margin: 30px 0 30px;
            }
            img{
                width: 60px;
                height: 60px;
                border-radius: 50%;
            }
            .right-content-main-from, .right-content-main-send{
                align-items: center;
                margin-bottom: 30px;
                font-size: 14px;
                .details{
                    position: relative;
                    max-width: 580px;
                    padding: 8px;
                    line-height: 24px;
                    border-radius:5px;
                    .triangle{
                        position: absolute;
                        top: 4px;
                        border-width: 8px 17px;
                        border-style: solid;
                    }
                    .delete{
                        position: absolute;
                        bottom: -32px;
                        width: 28px;
                        color: #ccc;
                    }
                }
                .hm{
                    height: 30px;
                    color: #ccc;
                }
            }
            .right-content-main-from{
                img{
                    margin-right: 40px;
                }
                .details{
                    background-color: #E6E6E6;
                    color: #333;
                    .triangle{
                        left: -34px;
                        border-color: #fff #e6e6e6 #fff #fff;
                    }
                    .delete{
                        right: 0;
                    }
                }
                .hm{
                    margin-left: 30px;
                }
            }
            .right-content-main-send{
                flex-direction: row-reverse;
                justify-content: end;
                img{
                    margin-left: 40px;
                }
                .details{
                    background-color: #2AB0EA;
                    color: #fff;
                    .triangle{
                        right: -34px;
                        border-color: #fff #fff #fff #2AB0EA;
                    }
                    .delete{
                        left: 0;
                    }
                }
                .hm{
                    margin-right: 30px;
                }
            }
            /*& > div:nth-last-child(1){*/
            /*    margin-bottom: -30px;*/
            /*}*/
        }
        .footer{
            position: relative;
            height: 170px;
            padding: 15px 30px 15px;
            border-top: 1px solid #e6e6e6;
            .right-content-footer-message{
                position: relative;
                .number{
                    position: absolute;
                    bottom: 6px;
                    right: 20px;
                    font-size:14px;
                }
            }
            .send{
                float: right;
                width:80px;
                height:40px;
                margin-top: 20px;
                background:rgba(230,230,230,1);
                color:rgba(153,153,153,1);
                font-size:14px;
                text-align: center;
                line-height: 40px;
                border-radius:5px;
            }
            .isSend{
                background-color: #2ab0ea;
                color: #fff;
            }
        }
    }
</style>
