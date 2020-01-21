<template>
  <div class="addTeac-app">
    <ul class="addTeac_u1">
      <li class="addTeac_l1 fx">
        <div class="addTeac_d_span">
          <span>教师姓名</span>
        </div>
        <div class="addTeac_d_input" :class="isError||teacherPublishObj.teacherName?'':'border_bg'">
          <input type="text" v-model="teacherPublishObj.teacherName" placeholder="请输入教师姓名">
        </div>
      </li>
      <li class="addTeac_l1 fx">
        <div class="addTeac_d_span">
          <span>教学年龄</span>
        </div>
        <div class="addTeac_d_input" :class="isError||teacherPublishObj.teacherAge?'':'border_bg'">
          <input type="number" class="inputWidth" v-model="teacherPublishObj.teacherAge" placeholder="请输入教学年龄">
        </div>
      </li>
      <li class="addTeac_l1 fx">
        <div class="addTeac_d_span">
          <span>教师电话</span>
        </div>
        <div class="addTeac_d_input" :class="isError||teacherPublishObj.teacherPhone?'':'border_bg'">
          <input type="number" class="inputWidth" v-model="teacherPublishObj.teacherPhone" placeholder="请输入教师电话">
        </div>
      </li>
      <li class="addTeac_l1 fx">
        <div class="addTeac_d_span">
          <span>工作照</span>
        </div>
        <div class="addTeac_d_img fx">
         <el-upload class="avatar-uploader"
            :action="localtion+'/upload.do'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :disabled="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="teacherPublishObj.teacherImage" :src="teacherPublishObj.teacherImage" class="avatar">
            <template v-else>
              <i class="el-icon-plus"></i>
              <p>添加图片</p>
            </template>
          </el-upload>
          <span class="addTeac_span">（注：请上传教师的工作照，图片不超过300K，建议尺寸：220*280px 图片格式：JPG PNG）</span>
        </div>
      </li>
      <li class="addTeac_l1 fx">
        <div class="addTeac_d_span">
          <span>毕业学校</span>
        </div>
        <div class="addTeac_d_input" :class="isError||teacherPublishObj.teacherSchool?'':'border_bg'">
          <input type="text" v-model="teacherPublishObj.teacherSchool" placeholder="请输入教师毕业学校">
        </div>
      </li>
      
      <li class="addTeac_l1 fx">
        <div class="addTeac_d_span">
          <span>授课内容</span>
        </div>
        <div class="addTeac_d_select">
          <el-select v-model="teaching1" filterable placeholder="请选择课程1" :class="isError||teacherPublishObj.teacherAdept?'':'border_bg'">
            <template v-for="item in selectTeachingList">
              <el-option
                v-show="item!==teaching1&&item!==teaching2"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </template>
          </el-select>
          <el-select v-model="teaching2" filterable placeholder="请选择课程2" :class="isError||teacherPublishObj.teacherAdept?'':'border_bg'">
            <template v-for="item in selectTeachingList">
              <el-option
                v-show="item!==teaching1&&item!==teaching2"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </template>
          </el-select>
        </div>
      </li>

      <li class="addTeac_l1 fx">
        <div class="addTeac_d_span">
          <span>教学寄语</span>
        </div>
        <div class="addTeac_d_textarea" :class="isError||teacherPublishObj.teacherIntro?'':'border_bg'">
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入教学寄语"
            v-model="teacherPublishObj.teacherIntro">
          </el-input>
          <span>剩余{{syFontNum}}个字</span>
        </div>
      </li>

      <li class="addTeac_l1 fx">
        <div class="addTeac_d_span">
          <span>教师经历</span>
        </div>
        <div class="addTeac_d_button">
          <el-button type="primary" @click="topAddjl">添加</el-button>
        </div>
      </li>

      <li class="addTeac_l1 fx">
        <div class="addTeac_d_span">
          <span></span>
        </div>
        <div class="addTeac_d_div" v-html="teacherPublishObj.teacherMessage"></div>
      </li>
      
    </ul>
    <div class="addTeac_button">
      <el-button type="primary" @click="!isUpdate?topCommit():updateTeacher()">{{!isUpdate?'立即提交':'修改'}}</el-button>
    </div>

 
  </div>
</template>

<script>
import './addTeacher.less';
import addTeacher from './addTeacher.js'
export default {
  ...addTeacher
}

</script>
