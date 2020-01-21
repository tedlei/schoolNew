<template>
  <div class="sid-app fx" ref="sid_app">
    <div class="sid_d1">
      <span>学校资料</span>
    </div>

    <div class="ifi_app">
      <div class="ifi_title fx">
        <span>基本信息</span>
        <el-button type="primary" @click="topSave">保存</el-button>
      </div>
      <ul class="ifi_ul">
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>手机号码</p></div>
          <span class="ifi_span">{{userInfo.user.phone}}</span>
        </li>
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>帐户名</p></div>
          <span class="ifi_span">{{userInfo.user.name?userInfo.user.name:'暂无帐户名，请在用户端的个人中心设置。'}}</span>
        </li>
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>联系人</p></div>
         <span class="ifi_span">{{userInfo.schoolUser.linkman}}</span>
        </li>
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>邮箱</p></div>
          <div class="ifi_li_div2" :class="!emailCorrect?'borderRed':''">
            <el-input v-model="userInfo.user.email" placeholder="请输入邮箱"></el-input>
          </div>
          <div class="ifi_li_div3 fx" v-if="userInfo.user.email||!emailCorrect">
            <div class="ifi_icon">
              <i :class="emailCorrect?'el-icon-circle-check green':'el-icon-circle-close red'"></i>
            </div>
            <div :class="emailCorrect?'':'red'">请输入邮箱，如：130xxxxxxxx@qq.com</div>
          </div> 
        </li>
      </ul>
      <div class="ifi_title">
        <span>认证信息</span>
        <span class="ifi_span">注：认证信息一年只能修改一次</span>

        <el-button class="ifi_button" :disabled="!isUpdate" @click="topUpload" type="primary">重新上传认证信息</el-button>
      </div>
      <ul class="ifi_ul">
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>机构名称</p></div>
          <div class="ifi_li_div2" :class="!oratCorrect?'borderRed':''">
            <el-input v-model="userInfo.schoolUser.organizationName" :disabled="!isUpdate" placeholder="请输入机构名称"></el-input>
          </div>
          <div class="ifi_li_div3 fx" v-if="userInfo.schoolUser.organizationName||!oratCorrect">
            <div class="ifi_icon">
              <i :class="oratCorrect?'el-icon-circle-check green':'el-icon-circle-close red'"></i>
            </div>
            <div :class="oratCorrect?'':'red'">请输入机构名称,如是分校，请写明分校地区,如：XX教育XX校区</div>
          </div> 
        </li>
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>学校电话</p></div>
          <div class="ifi_li_div2" :class="!fixedPhoneCorrect?'borderRed':''">
            <el-input v-model="userInfo.schoolUser.schoolPhone" :disabled="!isUpdate" placeholder="请输入学校电话"></el-input>
          </div>
          <div class="ifi_li_div3 fx" v-if="userInfo.schoolUser.schoolPhone||!fixedPhoneCorrect">
            <div class="ifi_icon">
              <i :class="fixedPhoneCorrect?'el-icon-circle-check green':'el-icon-circle-close red'"></i>
            </div>
            <div :class="fixedPhoneCorrect?'':'red'">请输入学校电话,如：023-XXXXXXXX</div>
          </div> 
        </li>
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>学校网址</p></div>
          <div class="ifi_li_div2" :class="!urlCorrect?'borderRed':''">
            <el-input v-model="userInfo.schoolUser.schoolUrl" :disabled="!isUpdate" placeholder="请输入学校网址"></el-input>
          </div>
          <div class="ifi_li_div3 fx" v-if="userInfo.schoolUser.schoolUrl||!urlCorrect">
            <div class="ifi_icon">
              <i :class="urlCorrect?'el-icon-circle-check green':'el-icon-circle-close red'"></i>
            </div>
            <div :class="urlCorrect?'':'red'">请输入学校网址,如：http://www.baidu.com</div>
          </div> 
        </li>
        
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>主营行业</p></div>
          <div>
            <el-checkbox-group v-model="schoolTrade" :disabled="!isUpdate">
              <el-checkbox label="学习辅导"></el-checkbox>
              <el-checkbox label="艺术培训"></el-checkbox>
              <el-checkbox label="学历提升"></el-checkbox>
              <el-checkbox label="职业培训"></el-checkbox>
              <el-checkbox label="资格证书"></el-checkbox>
            </el-checkbox-group>
          </div>
        </li>
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>授课地区</p></div>
          <div class="ifi_sel">
            <el-select v-model="userInfo.schoolUser.oneDddress" placeholder="请选择" :disabled="!isUpdate">
              <el-option
                v-for="(item,i) in provinceList"
                :key="i+'sheng'"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-select v-if="cityList.length>0" v-model="userInfo.schoolUser.twoDddress" placeholder="请选择" :disabled="!isUpdate">
              <el-option
                v-for="(item,i) in cityList"
                :key="i+'shi'"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-select v-if="areaList.length>0" v-model="userInfo.schoolUser.threeDddress" placeholder="请选择" :disabled="!isUpdate">
              <el-option
                v-for="(item,i) in areaList"
                :key="i+'qu'"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
        </li>

        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>学校详细地址</p></div>
          <div class="ifi_li_div2" :class="!addressCorrect?'borderRed':''">
            <el-input v-model="userInfo.schoolUser.schoolAddress" :disabled="!isUpdate" placeholder="请输入学校详细地址"></el-input>
          </div>
          <div class="ifi_li_div3 fx" v-if="userInfo.schoolUser.schoolAddress||!addressCorrect">
            <div class="ifi_icon">
              <i :class="addressCorrect?'el-icon-circle-check green':'el-icon-circle-close red'"></i>
            </div>
            <div :class="addressCorrect?'':'red'">请输入学校详细地址,如：某某街道办事处</div>
          </div> 
        </li>

        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>学校LOGO</p></div>
          <div class="ifi_upload">
            <el-upload class="avatar-uploader loginImg"
              :action="localtion+action"
              :show-file-list="false"
              :on-success="logoSuccess"
              :disabled="!isUpdate"
              :before-upload="schoolLogo">
              <img v-if="userInfo.schoolUser.schoolLogo" :src="userInfo.schoolUser.schoolLogo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="ifi_up_text">
            请上传清晰的学校LOGO,照片大小不超过300K,上传成功即表明雏鸟拥有其图片的使用权
          </div>
        </li>

        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>营业执照</p></div>
          <div class="ifi_upload">
            <el-upload class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :on-success="aptitudeSuccess"
              :disabled="!isUpdate"
              :before-upload="schoolAptitude">
              <img v-if="userInfo.schoolUser.schoolAptitude" :src="userInfo.schoolUser.schoolAptitude" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="ifi_up_text">
            请上传营业执照,照片大小不超过1M,信息只为审核使用，不对外展示
          </div>
        </li>
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>办学许可</p></div>
          <div class="ifi_upload">
            <el-upload class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :on-success="aptitudeSuccess"
              :disabled="!isUpdate"
              :before-upload="schoolPermission">
              <img v-if="userInfo.schoolUser.schoolPermission" :src="userInfo.schoolUser.schoolPermission" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="ifi_up_text">
            请上传办学许可,照片大小不超过1M,信息只为审核使用，不对外展示
          </div>
        </li>
        
        <li class="ifi_li fx">
          <div class="ifi_li_div1"><p>品牌资质</p></div>
          <div class="ifi_upload">
            <el-upload class="avatar-uploader"
              :action="action"
              :show-file-list="false"
              :on-success="brandSuccess"
              :disabled="!isUpdate"
              :before-upload="schoolBrand">
              <img v-if="userInfo.schoolUser.schoolCertificate" :src="userInfo.schoolUser.schoolCertificate" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
          <div class="ifi_up_text">
            请上传清晰的授权文件,照片大小不超过1M,图片只为审核使用，不对外展示
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import './schoolInfoData.less'
import info from './schoolInfoData.js'
export default {
  ...info
}
</script> 


<style lang='less' scoped>
.sid-app{
  padding:20px 20px;
  width: 100%;
  height: 100%;
  background-color: white;
  flex-direction: column;
  position: relative;
  .sid_d1{
    padding-bottom:20px;
    width: 100%;
    border-bottom: 1px solid #E6E6E6;
    font-size: 18px;
    color:rgba(51,51,51,1);
  }
  .sid_view{
    width: 100%;
    flex: 1;
    overflow-y: auto;
  }
}
</style>