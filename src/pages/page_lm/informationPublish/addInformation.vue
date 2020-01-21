<template>
  <div class="addInfo-app">
    <ul class="addt_u1">
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>资讯分类</span>
        </div>
        <div class="addt_d_select">
          <el-select v-model="schoolInfoObj.schoolMessage" placeholder="请选择资讯分类">
            <el-option
              v-for="item in getYearList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span span_padding">
          <span>动态资讯</span>
        </div>
        <div class="addt_d_select">
          <el-switch
            v-model="schoolInfoObj.isok">
          </el-switch>
        </div>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>标题</span>
        </div>
        <div class="addt_d_input">
          <input type="text" v-model="schoolInfoObj.schoolTopic" placeholder="请输入标题">
        </div>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>作者</span>
        </div>
        <div class="addt_d_input">
          <input type="text" v-model="schoolInfoObj.schoolAuthor" placeholder="请输入作者姓名">
        </div>
      </li>
      <li class="addt_l1 fx" v-if="schoolInfoObj.isok">
        <div class="addt_d_span">
          <span>资讯封面</span>
        </div>
        <div class="addt_img">
          <el-upload
            class="avatar-uploader"
            :action="localtion+upLoadImgUrl"
            :show-file-list="false"
            :on-success="aptitudeSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="schoolInfoObj.schoolMessageImage" :src="schoolInfoObj.schoolMessageImage" class="avatar">
            <template v-else>
              <i class="el-icon-plus avatar-uploader-icon"></i>
              <p>点击上传资讯封面图片</p>
            </template>
          </el-upload>
        </div>
        <div class="addt_span">
          请上传资讯封面，建议尺寸：335*268 px 格式为JPG、PNG,且不超过1M
        </div>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>资讯内容</span>
        </div>
        <div class="addt_d_button">
          <el-button type="primary" @click="topAddjl">添加</el-button>
        </div>
      </li>

      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span></span>
        </div>
        <div class="addt_d_div" v-html="schoolInfoObj.schoolContent"></div>
      </li>
    </ul>
    <div class="addt_button">
      <el-button type="primary" @click="topCommit">立即提交</el-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue"
import {Switch,Upload} from 'element-ui'
Vue.use(Switch)
Vue.use(Upload)
export default {
  data () {
    return {
      getYearList:['学前资讯','小学资讯','中学资讯','艺术培训','学历提升','职业培训','资格证书','其他资讯'],
      schoolInfoObj:{
        schoolMessage:'',    //资讯分类
        schoolTopic:'',    //标题
        schoolAuthor:'',   //作者名称
        schoolContent:'',   //资讯类容
        schoolDynamic:'',   //1：开启动态 0:关闭动态1
        schoolMessageImage:'',
        isok:false,
      },
      upLoadImgUrl:'/upload.do',   //上传图片路径
      getSchInfo:{},  //获取远程数据
      isValue:true,
    };
  },

  created(){
    let num = this.$route.query.num;
    this.getObj(num);
  },

  methods: {
    //获取图片路劲
    aptitudeSuccess(res, file) {
      if(!res.success) {
        this.$message({message:'上传失败，请重新上传！',type: 'warning'});
        return
      }
      this.schoolInfoObj.schoolMessageImage = res.message;
    },

    //判断图片格式和大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png'||file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) this.$message({message:'上传头像图片只能是 JPG或png 格式!',type: 'warning'});
      if (!isLt2M) this.$message({message:'上传头像图片大小不能超过 1MB!',type: 'warning'});
      return isJPG && isLt2M;
    },

    //获取数据
    getObj(num){
      if(num){
        let url = '/attention/selectMessage.do'
        this.fetch({url,data:{id:num},method:'post'},4).then(res=>{
          this.schoolInfoObj=res.data;
          if(res.data.schoolDynamic ==='1'){
            this.schoolInfoObj.isok = true;
          }
          this.getBDData()
        })
      }else{
        this.getBDData();
      }
    },

    //获取本地数据
    getBDData(){
      let schoolInfoObj = this.getItem('schoolInfoObj');
      if(schoolInfoObj) this.schoolInfoObj = schoolInfoObj;
    },

    //跳转到添加资讯类容
    topAddjl(){
      this.setItem('schoolInfoObj',this.schoolInfoObj);
      let query = this.$route.query;
      let str = 'informationUndergo?id='+query.id;
      if(query.type) str += '&type='+query.type;
      if(query.num) str += '&num='+query.num;
      this.push(str);
    },

    //点击提交时
    topCommit(){
      let schoolInfoObj = this.schoolInfoObj;
      if(!schoolInfoObj.schoolMessage){
        this.$message({message:'请选择资讯分类！',type:'warning'});
        return
      }
      if(!schoolInfoObj.schoolTopic){
        this.$message({message:'请输入标题！',type:'warning'});
        return
      }
      if(!schoolInfoObj.schoolAuthor){
        this.$message({message:'请输入作者名称！',type:'warning'});
        return
      }
      if(schoolInfoObj.isok&&!schoolInfoObj.schoolMessageImage){
        this.$message({message:'请输上传资讯封面图！',type:'warning'});
        return
      }
      if(!schoolInfoObj.schoolContent){
        this.$message({message:'请输入资讯类容！',type:'warning'});
        return
      }
      schoolInfoObj.userId = this.getItem('userInfo').schoolUser.id;
      let num = this.$route.query.num;
      let url = '/attention/save.do';
      if(num){
        url = '/attention/updateMessage.do';
        schoolInfoObj.id = num;
      }
      if(!schoolInfoObj.isok){
        delete schoolInfoObj.schoolMessageImage
      }
      this.fetch({url,data:schoolInfoObj,method:'post'},4).then(res=>{
        if(res.data){
          if(res.data.success){
            this.setItem('schoolInfoObj',null);
            this.push('/index/informationPublish?id='+this.$route.query.id)
          }
          this.$message({message:res.data.message,type:res.data.success?'success':'warning'});
        }
      })
    }
  }
}

</script>

<style lang='less'>
.addInfo-app{
  width: 100%;
  .addt_u1{
    width: 100%;
    .addt_l1{
      margin-top: 20px;
      width: 100%;
      .addt_d_span{
        padding-top: 12px;
        width: 100px;
        text-align: right;
        font-size: 18px;
        color:rgba(102,102,102,1);
      }
      .span_padding{
        padding-top: 0;
      }
      .addt_d_select{
        margin-left: 20px;
        .el-select{
          width:180px;
          height:50px;
          border-radius:5px;
          .el-input>.el-input__inner{
            height: 50px;
            font-size: 16px;
            color:rgba(51,51,51,1);
          }
        }
        .el-select+.el-select{
          margin-left: 20px;
        }
      }
      .addt_d_input{
        margin-left: 20px;
        width:500px;
        height:50px;
        border:1px solid rgba(230,230,230,1);
        border-radius:5px;
        overflow: hidden;
        input{
          padding-left: 10px;
          width: 100%;
          height: 100%;
          font-size: 16px;
          color:rgba(51,51,51,1);
        }
      }
      .addt_d_button{
        margin-left: 20px;
        .el-button{
          width:120px;
          height:40px;
          background:rgba(42,176,234,1);
          border-radius:5px;
        }
      }
      .addt_d_div{
        flex: 1;
        margin-left: 20px;
        padding-right: 20px;
        min-height: 30px;
        img{
          display: block;
          max-width: 995px !important;
          margin:10px auto;
        }
        div{
          display: inline-block;
        }
      }
      .addt_img{
        margin-left:20px; 
        width: 335px;
        height: 268px;
        border:1px solid #e6e6e6;
        border-radius: 5px;
        overflow: hidden;
        .avatar-uploader{
          width: 100%;
          height: 100%;
          .el-upload{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            color: #e6e6e6;
            i{
              font-size: 60px;
            }
            p{
              margin-top:5px;
            }
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .addt_span{
        font-size: 16px;
        color: #999;
        margin-top: 235px;
        margin-left: 10px;
      }
    }
  }
  .addt_button{
    margin-top: 30px;
    text-align: center;
    .el-button{
      width:150px;
      height:40px;
      background:rgba(42,176,234,1);
      border-radius:5px;
    }
  }
}
</style>