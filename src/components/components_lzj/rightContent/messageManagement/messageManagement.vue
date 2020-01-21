    <template>
        <div class="messageManagement col333 fx">
            <h4 class="fx">预约中心</h4>
            <div class="fx table_paging">
                <div class="table" ref="tableContent">
                    <table class="layui-table">
                        <colgroup>
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="100">
                            <col width="300">
                            <col width="100">
                            <col>
                        </colgroup>
                        <thead>
                        <tr class="not">
                            <th>序号</th>
                            <th>姓名</th>
                            <th>联系电话</th>
                            <th>预约分类</th>
                            <th>预约时间</th>
                            <th>留言内容</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, i ) in messageObj.rows" :key="i">
                            <td>{{i+1}}</td>
                            <td>{{item.userName}}</td>
                            <td>{{item.appoPhone}}</td>
                            <td>{{item.appoName === '1' ? '课程' : '教师'}}</td>
                            <td>{{item.creationTime}}</td>
                            <td>{{item.appoMessage}}</td>
                            <td>
                                <span @click="deleteMessage(i)" class="pointer">删除</span>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <!-- 分页器 -->
                <pagination :currentPage="currentPage"
                            :sum="messageObj.total"
                            :currentChange="currentChange"
                            :onePageNumber="onePageNumber"></pagination>
            </div>
        </div>
    </template>

    <script>
        import pagination from "../../../common/pagination";

        export default {
            components: {pagination},
            data() {
                return {
                    currentPage: 1, // 当前页
                    onePageNumber: 10, // 每页条数
                    messageObj: {}
                }
            },
            created(){
                this.getMessageObj();
            },
            methods: {
                /**
                 * 获取预约消息列表
                 */
                getMessageObj(){
                    let {currentPage, onePageNumber} = this;
                    this.fetch({
                        url: 'attention/select.do',
                        method: 'post',
                        data: {
                            pageNum:currentPage + '',
                            pageSize: onePageNumber + ''
                        }
                    }, 4).then((res)=>{
                        this.messageObj = res.data;
                    })
                },
                // 获取页数
                currentChange(value){
                    this.currentPage = value;
                    this.getMessageObj();
                },

                // 删除消息
                deleteMessage(i){
                    this.fetch({
                        url: 'attention/remove.do',
                        method: 'post',
                        data: {
                            id: this.messageObj.rows[i].id + ''
                        }
                    }, 4).then((res)=>{
                        this.$message({message: '删除成功', type: 'success'});
                        this.messageObj.rows.splice(i, 1);
                        this.messageObj.total--;
                        // 删除值是否为当前页最后一条 为真则当前页码减1 并请求上一列表数据
                        if ((this.currentPage - this.messageObj.total/this.onePageNumber) === 1){
                            this.currentPage--;
                            this.getMessageObj();
                        }
                    })
                }
            },
            mounted() {
                this.showScroll('tableContent', true, 150)
            }
        }
    </script>

    <style lang="less" scoped>
        .messageManagement{
            flex: 1;
            flex-direction: column;
            padding: 20px;
            background-color: #fff;
            h4{
                padding-bottom: 20px;
                border-bottom: 1px solid #E6E6E6;
                font-size: 18px;
            }
            tr{
                th, td{
                    text-align: center;
                }
                & td:nth-last-child(2){
                    text-align: left;
                }
            }
            .table_paging{
                flex: 1;
                flex-direction: column;
                justify-content: space-between;
                padding: 18px 10px 0;
                .table{
                    height: 100%;
                    overflow-y: auto;
                    border: 1px solid #e6e6e6;
                    border-right-width: 0;
                    border-left-width: 0;
                    table{
                        margin: 0;
                        & tr td:nth-last-child(1){
                            color: red;
                        }
                    }
                }
                .paging{
                    height: 60px;
                }
                /*tr:not(.not):hover{*/
                /*    background-color: #fff;*/
                /*}*/
            }
        }
    </style>