<template>
  <div class="tepu-app fx" ref="tepu_app">
    <div class="tepu_d1">
      <template v-for="(item,i) of urlList">
        <span :key="i">
          <span :class="item.src?'cursor':''" @click="topTz(item.src)">{{item.title}}</span>
          <i v-if="item.src" class="el-icon-arrow-right"></i>
        </span>
      </template>
      <button v-if="isBtn" class="tepu_btn" @click="topBack">返回</button>
    </div>

    <router-view class="tepu_view"></router-view>
    <!-- <div class="tepu_zdc fx" v-if="iszdc">
      <div class="tepu_zdc_div">
        亲，您的账户为普通学校账户，不能添加教师
        ，请<span @click="toptz">升级</span>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      urlList:[],
      isBtn:false,
      // iszdc:false,  
    };
  },

  created(){
    // this.isShowZdc()
    
  },

  mounted(){
     this.getUrl(this.$route)
  },
  methods: {
    getUrl(route){
      this.urlList = [] 
      let arr = route.path.slice(7).split('/');
      let num = route.query.num;
      this.isBtn = false;
      if(arr.indexOf('addTeacher')>=0){
        this.urlList = [
          {src:'/index/teacherPublish',title:'教师发布'},
          {src:'',title:num?'修改教师':'添加教师'}
        ]
        this.isBtn = true;
        return
      }
      if(arr.indexOf('teacherUndergo')>=0){
        this.urlList = [
          {src:'/index/teacherPublish',title:'教师发布'},
          {src:'/index/teacherPublish/addTeacher',title:num?'修改教师':'添加教师'},
          {src:'',title:'教师介绍添加'}
        ]
        this.isBtn = true;
        return
      }
      this.urlList = [
        {src:'',title:'教师发布'}
      ]
    },

    //点击跳转
    topTz(src){
      if(!src)return;
      let query = this.$route.query; 
      let str = src+'?id='+query.id;
      if(src==='/index/teacherPublish/addTeacher'){
        if(query.type) str += '&type='+query.type;
        if(query.num) str += '&num='+query.num;
      }
      this.push(str);
    },

    //点击返回时
    topBack(){
      let {query,path} = this.$route;
      let pathList = path.slice(1).split('/')
      let str = '';
      for(let num in pathList){
        if(pathList[num]==='teacherUndergo'){
          str = str + '/addTeacher'
        }else{
          if(num*1!==pathList.length-1){
            str = str + '/'+ pathList[num];
          }
        }
      }
      str = str+ '?id=' + query.id;
      if(query.type) str += '&type='+query.type;
      if(query.num) str += '&num='+query.num;
      this.push(str);
    },

    //判断是否为普通用户
    // async isShowZdc(){
    //   let userInfo = await this.getItem('userInfo');
    //   if(userInfo){
    //     let roleList = userInfo.user.roleList;
    //     let roleName = roleList[roleList.length-1].roleName;
    //     this.iszdc = roleName==='school'?true:false;
    //   }
    // },

    //跳转到用户端保证金页面
    toptz(){
      location.href = 'http://127.0.0.1:8080/#/cashDeposit';
    }
  },

  watch:{
    $route:function(path){
      this.getUrl(path);
    }
  }
}

</script>

<style lang='less' scoped>
.tepu-app{
  padding:20px 20px;
  width: 100%;
  height: 100%;
  background-color: white;
  flex-direction: column;
  position: relative;
  .tepu_d1{
    padding-bottom:20px;
    width: 100%;
    border-bottom: 1px solid #E6E6E6;
    font-size: 18px;
    color:rgba(51,51,51,1);
    .cursor{
      cursor: pointer;
    }
    .cursor:active{
      color:rgba(151,151,101,1);
    }
    .tepu_btn{
      float: right;
      width: 75px;
      height: 30px;
      background-color: #2AB0EA;
      color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .tepu_view{
    width: 100%;
    flex: 1;
    overflow-y: auto;
  }
  .tepu_zdc{
    justify-content: center;
    align-items: center;
    position:absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.3);
    top: 0;
    left: 0;
    z-index: 10001;
    .tepu_zdc_div{
      width: 500px;
      height: 200px;
      border-radius: 5px;
      background: #fff;
      text-align: center;
      line-height: 200px;
      font-size: 16px;
      color: #666;
      span{
        color: #2ab0ea;
        cursor: pointer;
      }
    }
  }
}
</style>