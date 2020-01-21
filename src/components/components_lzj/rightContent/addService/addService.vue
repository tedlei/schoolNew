    <template>
        <div class="schoolService col333 fx" ref="schoolService">
            <h4 class="pointer">学校客服</h4>
            <div class="scroll">
                <div class="schoolService_main fx">
                    <div class="fx">
                        <span class="tit">在线咨询自动回复：</span>
                        <i class="text">{{resContext}}</i>
                    </div>
                    <div class="fx">
                        <div class="edit">
                        <textarea v-model="context" maxlength="100"
                                  placeholder="请设置自动回复内容, 如：您好，我现在有事不在，一会再和您联系。"
                                  name="textarea"
                                  cols="30"
                                  rows="10"></textarea>
                            <span class="maxNumber">{{maxNumber}} 字</span>
                            <button @click="commitContext">提交</button>
                        </div>
                    </div>
                    <div class="fx">

                    </div>
                </div>
                <div class="schoolServiceAdd">
                    <div class="fx">
                        <span>客服添加</span>
                        <button @click="add('add')">添加</button>
                        <span>注：最多可添加5个客服人员</span>
                    </div>
                    <table class="layui-table">
                        <colgroup>
                            <col width="10">
                            <col width="200">
                            <col width="200">
                            <col width="200">
                        </colgroup>
                        <thead>
                        <tr class="not">
                            <th>序号</th>
                            <th>客服昵称</th>
                            <th>手机号</th>
                            <th>客服操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, i) in listData" :key="i">
                            <td>{{i+1}}</td>
                            <td>{{item.serveName}}</td>
                            <td>{{item.serveAccount}}</td>
                            <td>
                                <!-- <span class="pointer">编辑</span>-->
                                <span class="pointer" @click="deleteOption(i)">删除</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </template>

    <script>
        export default {
            data() {
                return {
                    resContext: '',
                    context: '',    // 编辑内容
                    maxNumber: 100, // 字数限制
                    listData: []
                }
            },
            methods: {
                /**
                 * 设置自动回复内容
                 */
                commitContext(){
                    let context = this.context;
                    if (!context.trim().length) {
                        this.$message({message: '提交内容不能为空', type: 'warning'});
                        return
                    }
                    this.fetch({
                        url: 'schoolServe/addSchoolReply.do',
                        method: 'post',
                        data: {
                            schoolReply: context
                        }
                    }, 4).then(()=>{
                        this.resContext = context;
                        this.context = '';
                        this.$message({message: '提交成功', type: 'success'});
                    });
                },
                // 人员添加
                add(url){
                    this.childRouteJump(url);
                },
                // 人员删除
                deleteOption(i){
                    this.fetch({
                        url: 'schoolServe/delete.do',
                        method: 'post',
                        data: {
                            id: this.listData[i].id + ''
                        }
                    }, 4).then(()=>{
                        this.$message({message: '删除成功', type: 'success'});
                        this.listData.splice(i, 1);
                    })
                },
                /**
                 * 获取客服列表
                 */
                initialize(){
                    this.fetch({
                        url: 'schoolServe/select.do',
                        method: 'post',
                        data: {}
                    }, 4).then((res)=>{
                        this.listData = res.data.list;
                        let schoolReply = res.data.schoolReply;
                        this.resContext = schoolReply ? schoolReply.schoolReply : '空';
                    })
                }
            },
            watch: {
                context(value){
                    let len = value.length;
                    len = Math.min(len, 100);
                    this.maxNumber = 100 - len
                    // if (value.length)
                }
            },
            created() {
                this.initialize();
            }
        }
    </script>

    <style lang="less" scoped>
        .schoolService{
            flex: 1;
            flex-direction: column;
            padding: 20px 20px 0;
            background-color: #fff;
            h4{
                padding-bottom: 20px;
                border-bottom: 1px solid #E6E6E6;
                font-size: 18px;
            }
            .scroll{
                flex: 1;
                overflow-y: auto;
                .schoolService_main{
                    flex-direction: column;
                    padding-top: 30px;
                    padding-bottom: 50px;
                    div:nth-child(1){
                        margin-bottom: 40px;
                        .tit{
                            min-width: 140px;
                        }
                        .text{
                            color: #2AB0EA;
                        }
                    }
                    div:nth-child(2){
                        textarea{
                            width:763px;
                            height:150px;
                            padding: 18px 20px;
                            border:1px solid rgba(230,230,230,1);
                            word-break: keep-all;
                            word-wrap: break-word; // 只对英文起作用，以单词作为换行依据。
                            white-space: pre-wrap; //只对中文起作用，强制换行。
                            text-align: justify;  // 文本两端对齐
                            text-justify:inter-ideograph;
                            border-radius:5px;
                        }
                        .edit{
                            flex-direction: column;
                            align-items: center;
                            position: relative;
                            .maxNumber{
                                position: absolute;
                                right: 0;
                                bottom: 76px;
                                color: #CCCCCC;
                                font-size: 14px;
                            }
                            button{
                                display: block;
                                width:150px;
                                height:40px;
                                margin: 26px auto 0;
                                background:rgba(42,176,234,1);
                                color: #fff;
                                border-radius:5px;
                            }
                        }
                    }
                }
                .schoolServiceAdd{
                    font-size: 18px;
                    .fx{
                        align-items: center;
                        button{
                            width:120px;
                            height:50px;
                            margin: 0 30px;
                            background:rgba(42,176,234,1);
                            color: #fff;
                            border-radius:5px;
                        }
                        span:nth-last-child(1){
                            font-size:14px;
                            color:rgba(153,153,153,1);
                        }
                    }
                    th, td{
                        text-align: center;
                        span{
                            margin: 0 20px;
                        }
                        span:nth-child(1){color: red;}
                    }
                    /*tr:not(.not):hover{*/
                    /*    background-color: #fff;*/
                    /*}*/
                }
            }
        }
    </style>