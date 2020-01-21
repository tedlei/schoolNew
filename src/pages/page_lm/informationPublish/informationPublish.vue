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
  </div>
</template>

<script>
export default {
  data () {
    return {
      urlList:[],
      isBtn:false,
    };
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
      if(arr.indexOf('addInformation')>=0){
        this.urlList = [
          {src:'/index/informationPublish',title:'资讯发布'},
          {src:'',title:num?'修改资讯':'添加资讯'}
        ]
        this.isBtn = true;
        return
      }
      if(arr.indexOf('informationUndergo')>=0){
        this.urlList = [
          {src:'/index/informationPublish',title:'资讯发布'},
          {src:'/index/informationPublish/addInformation',title:num?'修改资讯':'添加资讯'},
          {src:'',title:'资讯类容添加'}
        ]
        this.isBtn = true;
        return
      }
      this.urlList = [
        {src:'',title:'资讯发布'}
      ]
    },

    //点击跳转
    topTz(src){
      if(!src)return;
      let query = this.$route.query; 
      let str = src+'?id='+query.id;
      if(src==='/index/informationPublish/addInformation'){
        if(query.type) str += '&type='+query.type;
        if(query.num) str += '&num='+query.num;
      }
      this.push(str);
    },

    //点击返回时
    topBack(){
      this.$router.go(-1);
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
  .tepu_d1{
    width: 100%;
    padding-bottom: 20px;
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
}
</style>