<template>
  <div class="basi-app fx">
    <div class="basi_d1">
      <p>基础设置</p>
    </div>
    <div class="basi_d2" ref="basi_d2">
      <div class="basi_d2_li basi_height fx">
        <div class="basi_bdi_span"><span>学校封面</span></div>
        <el-upload
          class="avatar-uploader"
          :action="localtion+upLoadImgUrl"
          :show-file-list="false"
          :on-success="getSiCodeImg"
          :before-upload="beforeAvatarUpload">
          <img v-if="basicSettings.schoolImage" :src="basicSettings.schoolImage" class="avatar">
          <div v-else class="el_sz">
            <div class="el_s"></div>
            <div class="el_h"></div>
          </div>
        </el-upload>
        <div style="margin-left:20px;" slot="tip" class="el-upload__tip">建议尺寸：340*240px 格式为JPG、PNG,且不超过1M</div>
      </div>
      <div class="basi_d2_li fx">
        <div class="basi_bdi_span"><span>公众号二维码</span></div>
        <div class="basi_bdi_input input">
          <el-input v-model="fileImgName.schoolPublicCode" :disabled="true"></el-input>
        </div>
        <el-upload
          ref='img1'
          class="upload-demo"
          :action="localtion+upLoadImgUrl"
          :limit="1"
          :on-success="getqrCodeImg"
          :before-upload="beforeAvatarUpload">
          <el-button size="small" @click="topQk(1)" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸：200*200 px 格式为JPG、PNG,且不超过1M</div>
        </el-upload>
      </div>
      <div class="basi_d2_li fx">
        <div class="basi_bdi_span"><span>广告图1</span></div>
        <div class="basi_bdi_input input">
          <el-input v-model="fileImgName.schoolAdvertOne" :disabled="true"></el-input>
        </div>
        <el-upload
          ref='img2'
          class="upload-demo"
          :action="localtion+upLoadImgUrl"
          :limit="1"
          :on-success="getOneAdvertisingImg"
          :before-upload="beforeAvatarUpload">
          <el-button size="small" @click="topQk(2)" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸：1200*464 px 格式为JPG、PNG,且不超过1M</div>
        </el-upload>
      </div>
      <div class="basi_d2_li fx">
        <div class="basi_bdi_span"><span>广告图2</span></div>
        <div class="basi_bdi_input input">
          <el-input v-model="fileImgName.schoolAdvertTwo" :disabled="true"></el-input>
        </div>
        <el-upload
          ref='img3'
          class="upload-demo"
          :action="localtion+upLoadImgUrl"
          :limit="1"
          :on-success="getTwoAdvertisingImg"
          :before-upload="beforeAvatarUpload">
          <el-button size="small" @click="topQk(3)" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸：1200*464 px 格式为JPG、PNG,且不超过1M</div>
        </el-upload>
      </div>
      <div class="basi_d2_li fx">
        <div class="basi_bdi_span"><span>广告图3</span></div>
        <div class="basi_bdi_input input">
          <el-input v-model="fileImgName.schoolAdvertThree" :disabled="true"></el-input>
        </div>
        <el-upload
          ref='img4'
          class="upload-demo"
          :action="localtion+upLoadImgUrl"
          :limit="1"
          :on-success="getThreeAdvertisingImg"
          :before-upload="beforeAvatarUpload">
          <el-button size="small" @click="topQk(4)" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸：1200*464 px 格式为JPG、PNG,且不超过1M</div>
        </el-upload>
      </div>
      <div class="basi_d2_li fx">
        <div class="basi_bdi_span"><span>学校位置图</span></div>
        <div class="basi_bdi_input input">
          <el-input v-model="fileImgName.schoolMapImage" :disabled="true"></el-input>
        </div>
        <el-upload
          ref='img5'
          class="upload-demo"
          :action="localtion+upLoadImgUrl"
          :limit="1"
          :on-success="getMapImg"
          :before-upload="beforeAvatarUpload">
          <el-button class="basi_up_btn" size="small" @click="topQk(5)" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">建议尺寸：600*400 px 格式为JPG、PNG,且不超过1M</div>
        </el-upload>
      </div>

    </div>
    <div class="basi_btn">
      <el-button :disabled="isBtn" @click="btnCommit" type="primary">立即提交</el-button>
    </div>
  </div>
</template>

<script>
import basics from './basics.js'
export default {
...basics
}

</script>

<style lang='less'>
.basi-app{
  flex-direction: column;
  position: relative;
  height: 100%;
  .basi_d1{
    width: 100%;
    border-bottom: 1px solid rgba(230,230,230,1);
    padding-bottom: 20px;
    p{
      font-size: 18px;
      color:rgba(51,51,51,1);
    }
  }
  .basi_d2{
    // flex: 1;
    width: 100%;
    overflow-y: auto;
    .basi_d2_li{
      margin-top:10px;
      width: 100%;
      height: 40px;
      align-items: center;
      .avatar-uploader{
        margin-left: 2%;
        width:340px;
        height:240px;
        background:rgba(204,204,204,1);
        border-radius:5px;
        overflow: hidden;
        .el-upload{
          width: 100%;
          height: 100%;
          line-height: 240px;
          img{
            width: 100%;
            height: 100%;
          }
          i{
            font-size: 24px;
          }
        }
      }


      
      .basi_bdi_span{
        width: 9%;
        text-align: right;
        font-size: 16px;
        color:rgba(102,102,102,1);
      }
      .basi_bdi_input{
        margin-left: 2%;
        width: 30%;
        height: 100%;
        border:1px solid rgba(230,230,230,1);
        border-radius:5px;
        .el-input{
          border:0;
          height: 100%;
          .el-input__inner{
            border:0;
            height: 100%;
          }
        }
      }
      .basi_icon{
        margin-left: 30px;
        width: 18px;
        height: 18px;
        color: rgba(51,213,156,1);
        i{
          font-size: 18px;
        }
      }
      .basi_span{
        margin-left: 5px;
        font-size: 14px;
      }
      .fontColor{
        color:red;
      }
      .basi_select{
        border:0;
        display: flex;
        .el-select{
          border:1px solid rgba(230,230,230,1);
          border-radius:5px;
        }
        .el-select+.el-select{
          margin-left: 1%;
        }
      }
      .input{
        width:45%;
      }
      .upload-demo{
        width: 450px;
        margin-left: 2%;
        .el-upload-list{
          display: none;
        }
        .el-upload__tip{
          margin-left: 3%;
          display:inline-block;
        }
        // .basi_up_btn{
        //   background: #01a2ab;
        // }
      }
    }
    .basi_height{
      height: 240px;
      align-items:flex-start;
      .el-upload{
        border:1px solid #e5e7eA;
        background: white;
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        .el_sz{
          width: 100px;
          height: 100px;
          .el_s{
            margin: auto;
            width: 0;
            height: 100%;
            border: 1px solid #e5e7eA;
          }
          .el_h{
            margin-top: -50px;
            width:  100%;
            height:0;
            border: 1px solid #e5e7eA;
          }
        }
      }
      .basi_bdi_span,.el-upload__tip{
        margin-top: 20px;
      }
    }
  }
  .basi_btn{
    padding-top: 50px;
    text-align: center;
  }
}
</style>