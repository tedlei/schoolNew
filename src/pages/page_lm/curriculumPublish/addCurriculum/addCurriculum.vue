<template>
  <div class="addTeac-app">
    <ul class="addt_u1">
      <li class="addt_l1 fx" v-if="classifyList.length>0">
        <div class="addt_d_span">
          <span>分类选择</span>
        </div>
        <div class="addt_d_select">
          <el-select v-model="curriculumObj.schoolCategory" class="select_width" placeholder="请选择自定义课程分类">
            <el-option
              v-for="item in classifyList"
              :key="item.categoryName"
              :label="item.categoryName"
              :value="item.categoryName">
            </el-option>
          </el-select>
        </div>
        <span class="addt_li_span">注：此处是课程分类添加后选择，如没有添加，则没有选项。</span>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>学科具体分类</span>
        </div>
        <div class="addt_d_select">
          <el-select 
            v-model="curriculumObj.schoolclass" 
            :class="isCommit||curriculumObj.schoolclass?'':'border_bg'" 
            placeholder="请选择课程分类">
            <el-option
              v-for="item in curriculumClassList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="curriculumObj.schoolTwo" v-if="gradeClassList.length>0" placeholder="请选择年级分类">
            <el-option
              v-for="item in gradeClassList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select v-model="curriculumObj.schoolOne" 
          :class="isCommit||curriculumObj.schoolOne?'':'border_bg'" 
          v-if="subjectClassList.length>0" 
          placeholder="请选择科目分类">
            <el-option
              v-for="item in subjectClassList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </div>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>课程名称</span>
        </div>
        <div class="addt_d_input" :class="isCommit||curriculumObj.courseName?'':'border_bg'">
          <input type="text" v-model="curriculumObj.courseName" placeholder="请输入课程名称">
        </div>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>上传课程封面</span>
        </div>
        <div class="addt_d_img fx">
         <el-upload class="avatar-uploader"
            :action="localtion+'/upload.do'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :disabled="false"
            :before-upload="beforeAvatarUpload">
            <img v-if="curriculumObj.courseImage" 
            :src="curriculumObj.courseImage" 
            :class="imgWH.width>imgWH.height?'imgW':'imgH'"
            class="avatar">
            <template v-else>
              <i class="el-icon-plus"></i>
              <p>添加图片</p>
            </template>
          </el-upload>
          <span class="addt_span">（注：请上传课程封面，图片不超过300kb，建议尺寸：524*412px 图片格式：JPG PNG）</span>
        </div>
      </li>
    
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>课程价格</span>
        </div>
        <div class="addt_d_input input_width" :class="isCommit||curriculumObj.coursePrice?'':'border_bg'">
          <input type="number" v-model="curriculumObj.coursePrice" placeholder="请输入课程价格">
        </div>
        <span class="addt_li_span">元</span>
        <el-radio v-model="curriculumObj.courseHidePrice" label="0">直接展示</el-radio>
        <el-radio v-model="curriculumObj.courseHidePrice" label="1">预约后展示</el-radio>
      </li>

      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>上课时间</span>
        </div>
        <el-radio v-model="curriculumObj.courseTime" label="不限">不限</el-radio>
        <el-radio v-model="curriculumObj.courseTime" label="全日制">全日制</el-radio>
        <el-radio v-model="curriculumObj.courseTime" label="白天班">白天班</el-radio>
        <el-radio v-model="curriculumObj.courseTime" label="晚上班">晚上班</el-radio>
        <el-radio v-model="curriculumObj.courseTime" label="周末班">周末班</el-radio>
        <el-radio v-model="curriculumObj.courseTime" label="寒暑假班">寒暑假班</el-radio>
        <el-radio v-model="curriculumObj.courseTime" label="电话咨询">电话咨询</el-radio>
        <el-radio v-model="curriculumObj.courseTime" label="自由安排">自由安排</el-radio>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>上课地点</span>
        </div>
        <!-- :class="isCommit||curriculumObj.courseAddress?'':'border_bg'" -->
        <div class="addt_d_select fx">
          <el-select 
            v-model="curriculumObj.courseOneAddress" 
            :class="isCommit||curriculumObj.courseOneAddress?'':'border_bg'"
            placeholder="请选择省">
            <el-option
              v-for="item in courseOneAddressList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select 
            v-model="curriculumObj.courseTwoAddress" 
            :class="isCommit||curriculumObj.courseTwoAddress?'':'border_bg'"
            placeholder="请选择市">
            <el-option
              v-for="item in courseTwoAddressList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-select 
            v-model="curriculumObj.courseThreeAddress" 
            :class="isCommit||curriculumObj.courseThreeAddress?'':'border_bg'"
            placeholder="请选择区">
            <el-option
              v-for="item in courseThreeAddressList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          
          <input type="text" 
            class="addt_width_input" 
            :class="isCommit||curriculumObj.courseAddress?'':'border_bg'"
            v-model="curriculumObj.courseAddress" 
            placeholder="请输入详细地址">
        </div>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>学习周期</span>
        </div>
        <div class="addt_d_input" :class="isCommit||curriculumObj.coursePeriod?'':'border_bg'">
          <input type="text" v-model="curriculumObj.coursePeriod" placeholder="请输入学习周期">
        </div>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>课程级别</span>
        </div>
        <el-radio v-model="curriculumObj.courseGrade" label="不限">不限</el-radio>
        <el-radio v-model="curriculumObj.courseGrade" label="初级">初级</el-radio>
        <el-radio v-model="curriculumObj.courseGrade" label="中级">中级</el-radio>
        <el-radio v-model="curriculumObj.courseGrade" label="高级">高级</el-radio>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>教学目标</span>
        </div>
        <div class="addt_d_textarea" :class="isCommit||curriculumObj.courseTarget?'':'border_bg'">
          <el-input
            type="textarea"
            :rows="8"
            placeholder="这里可以写1000个字的教学目标。"
            v-model="curriculumObj.courseTarget">
          </el-input>
          <span>{{targerNum}}字</span>
        </div>
      </li>

      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>课程内容</span>
        </div>
        <div class="addt_d_button">
          <el-button type="primary" @click="topAddjl">添加</el-button>
        </div>
      </li>

      <li class="addt_l1">
        <div class="addt_d_div" v-html="curriculumObj.courseContent"></div>
      </li>
      
    </ul>
    <div class="addt_button">
      <el-button type="primary" @click="topCommit">立即提交</el-button>
    </div>
  </div>
</template>

<script>
import './addCurriculum.less';
import addCurriculum from './addCurriculum.js'
export default {
  ...addCurriculum
}

</script>
