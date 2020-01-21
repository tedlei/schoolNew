<template>
    <div class="add fx">
        <div class="head fx">
            <span class="col333 pointer" @click="back">学校客服</span>
            <i class="iconfont icondayu"></i>
            <span class="col333">客服添加</span>
        </div>
        <ul class="main">
            <li class="fx">
                <label for="phone" class="col666">手机号</label>
                <input id="phone" v-model="phone" placeholder="请输入手机号查询" type="text" @keydown="enterSearch">
                <i class="iconfont iconsoushuo pointer active" @click="search"></i>
            </li>
            <li class="fx" v-if="searchResult">
                <label class="col666">账户名</label>
                <span style="margin-bottom: 16px;color: #2AB0EA;">{{nickName}}</span>
            </li>
            <li class="fx" v-if="searchResult">
                <div>
                    <div class="fx">
                        <label for="accountName" class="col666">客服昵称</label>
                        <input id="accountName" v-model="accountName" placeholder="请输入客服昵称" @keydown="enterCommit" type="text">
                    </div>
                    <button class="pointer active" @click="commit">立即提交</button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                phone: '',
                savePhone: '',
                accountName: '',
                nickName: '',
                searchResult: false
            }
        },
        computed: {
            phoneVerification(){
                return  /^1([2-9])\d{9}/.test(this.phone);
            },
            accountNameVerification(){
                return !!this.accountName
            }
        },
        methods: {
            enterCommit(e){
                if (e.key === 'Enter') {
                    this.commit();
                }
            },
            commit(){
                if (!this.accountNameVerification) {
                    this.$message({message: '客服昵称不能为空', type: 'warning'});
                    return;
                }
                
                let {accountName, savePhone, nickName} = this;

                this.fetch({
                    url: 'schoolServe/add.do',
                    method: 'post',
                    data: {
                        userId: this.userInfo.user.id, // 当前用户id
                        serveName: accountName, // 客服昵称
                        servePhone: savePhone,    // phone
                        serveAccount: nickName  // 账户名
                    }
                }, 4).then((res)=>{
                    if (!res.data.success) {
                        this.$message({message: res.data.message, type: 'warning'});
                        return
                    }
                    this.$message({message: '添加成功', type: 'success'});
                    this.phone = '';
                    this.accountName = '';
                    this.searchResult = false;
                });
            },
            back(){this.pop()},
            /**
             * 搜索用户
             */
            enterSearch(e){
                if (e.key === 'Enter') {
                    this.search();
                }
            },
            /**
             * 搜索用户
             */
            search(){
                if (!this.phoneVerification) {
                    this.$message({
                        message: '请输入正确的手机号',
                        type: 'warning'
                    });
                    return;
                }
                // this.phone 手机号
                this.fetch({
                    url: 'attention/service.do',
                    method: 'post',
                    data: {
                        username: this.phone
                    }
                }, 4).then((res)=>{
                    if (res.data) {
                        this.savePhone = res.data.phone;
                        this.nickName = res.data.nickName;
                        this.$message({message: '搜索成功', type: 'success'});
                        this.searchResult = true;
                    } else {
                        this.$message({message: '未查找到用户', type: 'warning'});
                    }
                });
            }
        },
        watch: {
            accountName(){

            }
        }
    }
</script>

<style lang="less" scoped>
    .add{
        flex: 1;
        flex-direction: column;
        padding: 20px;
        background-color: #fff;
        font-size: 18px;
        .head{
            align-items: center;
            padding-bottom: 22px;
            border-bottom: 1px solid #E6E6E6;
            i{
                display: inline-block;
                font-size: 13px;
                margin: 1px 9px 0;
            }
        }
        .main{
            flex: 1;
            padding-top: 20px;
            li{
                label{
                    display: inline-block;
                    width: 90px;
                    padding-right: 20px;
                    text-align: right;
                }
                input{
                    width:500px;
                    height:50px;
                    background:rgba(255,255,255,1);
                    border:1px solid rgba(230,230,230,1);
                    font-size: 16px;
                    text-indent: 1em;
                    border-radius:5px;
                    &::-webkit-input-placeholder,
                    &::-moz-placeholder,
                    &:-moz-placeholder,
                    &:-ms-input-placeholder{
                        color: #ccc;
                    }
                }
            }
            li:nth-child(1){
                align-items: center;
                margin-bottom: 16px;
                i{
                    display: inline-block;
                    width:100px;
                    height:50px;
                    background:rgba(42,176,234,1);
                    color: #fff;
                    font-size: 30px;
                    text-align: center;
                    line-height: 50px;
                    border-radius:0 5px 5px 0;
                }
            }
            li:nth-child(3){
                div div{
                    align-items: center;
                }
                button{
                    display: block;
                    width:150px;
                    height:40px;
                    margin: 40px auto 0;
                    background-color:rgba(42,176,234,1);
                    color: #fff;
                    font-size: 16px;
                    border-radius:5px;
                }
            }
        }
    }
</style>
