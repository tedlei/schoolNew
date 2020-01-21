    <template>
        <div class="head fx" ref="head">
            <div class="log fx" ref="log">
                <img src="../../../../public/images/log.png" alt="">
            </div>
            <ul class="fx">
                <li class="pointer" @click="()=>{this.push('/')}">
                    <span>欢迎，{{username}}</span>
                </li>
                <li v-if="false" class="pointer" @click.stop="open">
                    <span>优惠劵使用</span>
                </li>
                <li class="pointer">
                    <messagePop></messagePop>
                </li>
                <li class="pointer" @click="toClient">
                    <span>客户端</span>
                </li>
            </ul>
            <!-- 优惠劵使用 -->
            <div v-if="isShow" class="pop" @click.stop="()=>{}">
                <div class="title fx">
                    <span></span>
                    <span>优惠劵使用</span>
                    <i class="iconfont iconcuohao pointer" @click="close"></i>
                </div>
                <div v-if="!isSuccess" class="section fx">
                    <span class="col333">优惠劵</span>
                    <input type="text" v-model="inputValue">
                </div>
                <div v-if="!isSuccess" class="btn fx">
                    <span :style="{backgroundColor: inputValue.trim() ? '#2AB0EA' : '#CCCCCC'}"
                          @click="useCoupons">确认使用</span>
                </div>
                <div v-if="isSuccess" class="success fx">
                    <span class="col333">使用成功！</span>
                    <i @click="close">确认</i>
                </div>
            </div>
        </div>
    </template>

    <script>
        import messagePop from "./message";

        export default {
            components: {messagePop},
            data(){
                return {
                    isShow: false,  // 控制弹窗显示
                    inputValue: '',  // 优惠劵码
                    isSuccess: false,    // 是否使用成功
                    username: ''    // 用户昵称
                }
            },
            mounted() {
                let w = screen.width;
                w = Math.max(1440, w);
                this.$refs.head.style.height = 80 / 1920 * w + 'px';

                this.$refs.log.style.width = 300 / 1920 * w + 'px';


                // 注册弹窗消失事件
                document.addEventListener('click', ()=>{
                    this.close()
                })
            },
            methods: {
                // 获取昵称
                getUsername(value){this.username = value;},
                open(){
                    this.isShow = !this.isShow;
                    this.isSuccess = false;
                },
                close() {this.isShow = false},
                /**
                 * 使用优惠劵
                 */
                useCoupons(){
                    let result = this.inputValue.trim();
                    if (!result) return;
                    this.$message({
                        message: '无效优惠劵码',
                        type: 'warning'
                    });
                    this.isSuccess = true;
                    this.inputValue = '';
                    // 请求接口使用
                },
                toClient(){
                    window.location.href = 'http://www.chuniaoedu.com/'
                }
            }
        }
    </script>
    <style lang="less" scoped>
        .head{
            background-color: #2B3743;
            justify-content: space-between;
            .log{
                justify-content: center;
                align-items: center;
                height: 100%;
                img{
                    width: 58%;
                }
            }
            ul{
                align-items: center;
                padding-right: 60px;
                color: #fff;
                li{
                    margin-right: 30px;
                }
                & li:nth-last-child(1){
                    margin-right: 0;
                }
                & li:nth-last-child(2) i{
                    font-size: 12px;
                }
            }
            .pop{
                position: fixed;
                z-index: 10;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
                width: 626px;
                height: 566px;
                padding:  0 20px;
                background-color: #fff;
                box-shadow:0 0 13px 0 rgba(4,0,0,0.1);
                .title{
                    justify-content: space-between;
                    align-items: center;
                    height: 70px;
                    margin-bottom: 38px;
                    border-bottom: 1px solid #E6E6E6;
                    color: #333;
                    font-size: 24px;
                    i{
                        font-size: 15px;
                        &:hover{
                            color: red;
                        }
                    }
                }
                .section, .btn{
                    justify-content: center;
                }
                .section{
                    align-items: center;
                    span{
                        margin-right: 20px;
                    }
                    input{
                        width:376px;
                        height:50px;
                        background:rgba(255,255,255,1);
                        border:1px solid rgba(230,230,230,1);
                        font-size: 20px;
                        text-indent: 1em;
                        border-radius:5px;
                    }
                }
                .btn span{
                    width:150px;
                    height:40px;
                    margin-top: 30px;
                    color: #fff;
                    line-height: 40px;
                    text-align: center;
                    border-radius:5px;
                }
                .success{
                    align-items: center;
                    flex-direction: column;
                    span{
                        font-size: 24px;
                    }
                    i{
                        width:150px;
                        height:40px;
                        margin-top: 30px;
                        background:rgba(42,176,234,1);
                        color: #fff;
                        font-size: 16px;
                        text-align: center;
                        line-height: 40px;
                        border-radius:5px;
                    }
                }
            }
        }
    </style>
