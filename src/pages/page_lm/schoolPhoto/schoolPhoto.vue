<template>
  <div class="teacpho-app fx">
    <div class="teac_d1" ref="teac_d1">
      <div class="basi_d1">
        <p>学校相册</p>
      </div>
      <div class="teac_tp fx" ref="teac_tp">
        <template v-for="(item,i) of imgList">
          <div class="teac_img" v-if="item.imgUrl" :key="i">
            <img :src="item.imgUrl" :class="item.width>item.height?'imgWidth':'imgHeight'" alt="正在加载">
            <div @click="topDelete(i)">删除</div>
          </div>
        </template>
        <el-upload
          class="upload-demo"
          :action="localtion+'/upload.do'"
          multiple
          :limit="1000"
          :on-success="getThreeAdvertisingImg"
          :before-upload="beforeAvatarUpload">
          <el-button size="small" type="primary">
            <i class="el-icon-plus"></i>
            <p>添加照片</p>
          </el-button>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import {Dialog,Upload,Button} from 'element-ui';
import Vue from 'vue'
Vue.use(Dialog);
Vue.use(Upload);
Vue.use(Button);
export default {
  data() {
    return {
      imgList: [],


    };
  },
  methods: {
    //上传广告图片3
    getThreeAdvertisingImg(res,file){
      if(!res.success) {
        this.$message({message:'上传失败，请重新上传！',type: 'warning'});
        return
      }
      let obj = this.imgList[this.imgList.length-1];
      obj.imgUrl = File.response.message;
      this.imgList.splice(this.imgList.length-1,1,obj)
    },

    //判断图片格式和大小
    beforeAvatarUpload(file) {    
      const isJPG = file.type === 'image/png'||file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) this.$message({message:'上传头像图片只能是 JPG或png 格式!',type: 'warning'});
      if (!isLt2M) this.$message({message:'上传头像图片大小不能超过 2MB!',type: 'warning'});

      //获取上传图片的高和宽
      let _URL = window.URL || window.webkitURL;
      let img = new Image();
      let then = this;
      img.onload = function() {
        let obj = {width:img.width,height:img.height}
        then.imgList.push(obj);
      };
      img.src = _URL.createObjectURL(file);  

      return isJPG && isLt2M;
    },

    //删除上传图片
    topDelete(num){
      this.imgList.splice(num,1);
    }
  },
  mounted() {
    this.showScroll('teac_tp', true, 85);
  }
}

</script>

<style lang='less'>
.teacpho-app{
  flex: 1;
  position: relative;
  flex-direction: column;
  .teac_d1{
    flex: 1;
    padding:20px 20px;
    background-color: white;
    border-radius:5px;
    flex-direction: column;
    .basi_d1{
      width: 100%;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(230,230,230,1);
      p{
        font-size: 18px;
        color:rgba(51,51,51,1);
      }
    }
  }
  .teac_tp{
    overflow-y: auto;
    flex-wrap: wrap;
    align-content: start;
    align-items: flex-start;
    width: 100%;
    .teac_img{
      margin-top: 20px;
      margin-left: 30px;
      width:240px;
      height:320px;
      border-radius: 5px;
      border:1px solid rgba(230,230,230,1);
      text-align: center;
      line-height: 315px;
      overflow: hidden;
      position: relative;
      .imgWidth{
        width: 100%;
      }
      .imgHeight{
        height: 100%;
      }
      div{
        position:absolute;
        bottom: 0;
        width: 100%;
        height:50px;
        background:rgba(0,0,0,1);
        color: white;
        text-align: center;
        line-height: 50px;
        border-radius:0px 0px 5px 5px;
        opacity:0.7;
        bottom:-50px;
        transition:bottom 0.3s;
        cursor: pointer; 
      }
    }
    .teac_img:hover>div{
      bottom: 0;
    }
    .upload-demo{
      margin-left: 30px;
      margin-top: 20px;
      width:240px;
      height:320px;
      .el-upload{
        width: 100%;
        height: 100%;
        .el-button{
          background:rgba(250,250,250,1);
          border:1px solid rgba(230,230,230,1);
          border-radius:5px;
          width: 100%;
          height: 100%;
          font-size: 60px;
          i{
            color:rgba(204,204,204,1);
          }
          p{
            color:rgba(102,102,102,1);
            margin-top: 20px;
            font-size: 16px;
          }
        }
      }
      .el-upload-list{
        display: none;
      }
    }
  }
}
</style>