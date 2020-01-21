// import引入组件
//首页
import homePage from '@/pages/page_lm/homePage/homePage.vue'

//网站设置
import setting from '@/pages/page_lm/websiteSetting/setting'

//学校相册
import schoolPhoto from '@/pages/page_lm/schoolPhoto/schoolPhoto'

//教师发布
import teacherPublish from '@/pages/page_lm/teacherPublish/teacherPublish'
import teacherList from '@/pages/page_lm/teacherPublish/teacherList'
import addTeacher from '@/pages/page_lm/teacherPublish/addTeacher/addTeacher'
import teacherUndergo from '@/pages/page_lm/teacherPublish/teacherUndergo'

//资讯发布
import informationPublish from '@/pages/page_lm/informationPublish/informationPublish'
import informationList from '@/pages/page_lm/informationPublish/informationList'
import addInformation from '@/pages/page_lm/informationPublish/addInformation'
import informationUndergo from '@/pages/page_lm/informationPublish/informationUndergo'

//课程发布
import curriculumPublish from '@/pages/page_lm/curriculumPublish/curriculumPublish'
import curriculumList from '@/pages/page_lm/curriculumPublish/curriculumList'
import addCurriculum from '@/pages/page_lm/curriculumPublish/addCurriculum/addCurriculum'
import curriculumUndergo from '@/pages/page_lm/curriculumPublish/curriculumUndergo'

//学校资料设置
import schoolInfoData from '@/pages/page_lm/schoolInfoData/schoolInfoData.vue'

export default [

  {path:'',name:'homePage',component:homePage},

  {path:'setting',component:setting},

  {path:'schoolInfoData',name:'schoolInfoData',component:schoolInfoData},
  
  {path:'schoolPhoto',name:'schoolPhoto',component:schoolPhoto},

  {path:'teacherPublish',component:teacherPublish,children:[
    {path:'',name:'teacherList',component:teacherList},
    {path:'addTeacher',name:'addTeacher',component:addTeacher},
    {path:'teacherUndergo',name:'teacherUndergo',component:teacherUndergo},
  ]},
  
  {path:'informationPublish',component:informationPublish,children:[
    {path:'',name:'informationList',component:informationList},
    {path:'addInformation',name:'addInformation',component:addInformation},
    {path:'informationUndergo',name:'informationUndergo',component:informationUndergo},
  ]},
  
  {path:'curriculumPublish',component:curriculumPublish,children:[
    {path:'',name:'curriculumList',component:curriculumList},
    {path:'addCurriculum',name:'addCurriculum',component:addCurriculum},
    {path:'curriculumUndergo',name:'curriculumUndergo',component:curriculumUndergo},
  ]}

]