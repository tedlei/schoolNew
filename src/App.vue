<template>
    <div>
        <router-view/>
    </div>
</template>

<script>
    export default {
        data(){
            return {
            }
        },
        created(){
            let userInfo = this.getItem('userInfo');
            let schoolNum = this.$route.query.schoolNum;   //获取从用户端传过来的参数
            let phone = '';''
            if (schoolNum) {
                phone = this.uncompile(schoolNum);
                this.setItem('userInfo', '');
            } else if(userInfo) {
                phone = userInfo.user.phone
            } else {
                this.verifyLogin({
                    message: '未登陆，请先登陆！',
                    url: 'http://www.chuniaoedu.com/#/index/loginAndRegister'
                }, false);
                return
            }
            this.seachUserIsLogin(phone);
        },
        methods:{
            uncompile(code){  //对获取的schoolNum进行解密
                code=unescape(code);  
                var c=String.fromCharCode(code.charCodeAt(0)-code.length);
                for(var i=1;i<code.length;i++){  
                    c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));  
                }  
                return c;
            },

            //查询用户是否登陆
            seachUserIsLogin(phone){
                let url = 'user/findByPhone.do';
                let data = {phone};
                this.fetch({url,data,method:'get'},2).then(res=>{
                    let userInfo = res.data;
                    this.setItem('userInfo',userInfo);
                    // 执行header.vue中的getUsername方法  获取昵称
                    this.$children[0].$children[0].getUsername(userInfo.user.nickName);
                    //执行首页中的getLineData方法，获取数据
                    let elVue = this.$children[0].$children[2];
                    if (elVue.getLineData) {
                        elVue.getLineData()
                    }
                })
            }
        },
        destroyed() {
            window.localStorage.removeItem('userInfo');
        },
        watch: {
            // 路由改变获取消息
            $route(to, from){
                if (to.path !== from.path) {
                    this.$store.commit('changeHeadMessageSync', true);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
