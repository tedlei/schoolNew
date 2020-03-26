import Vue from "vue"
import {Upload,Button,Radio} from 'element-ui'
import chinaCityList from '../../../../../public/js/chinaCityList'
import data from './data.js'
Vue.use(Upload)
Vue.use(Button)
Vue.use(Radio)
export default {
  data () {
    return {
      classifyList:[],   //自定义课程分类列表
      curriculumClassList:[],   //课程分类列表
      gradeClassList:[],    //年级分类列表
      subjectClassList:[],    //科目分类列表

      curriculumObj:{  
        schoolCategory:'',   //选中的自定义课程分类
        schoolclass:'',   //选中的课程分类
        schoolTwo:'',    //选中的年级分类
        schoolOne:'',    //选中的科目分类
        courseName:'',    //课程名称
        courseImage:'',    //课程封面
        coursePrice:'',    //价格
        courseHidePrice:'0',    //是否展示  0:展示   1：预约后展示
        courseTime:'不限',    //课程时间
        coursePeriod:'',    //课程周期
        courseGrade:'不限',    //上课级别
        courseTarget:'',    //教学目标
        courseContent:'',    //课程教学类容——介绍
        courseText:'',   //课程教学类容——介绍  纯文本
        courseOneAddress:'',   //选择省
        courseTwoAddress:'',   //选择市
        courseThreeAddress:'',  //选择区
        courseAddress:'',   //详细地址
      },

      targerNum:1000,   //教学目标剩余字数

      // temporaryCurrObj:{},  

      getYearList:[],   //获取年列表
      getMonthList:[],   //获取月列表
      getDateList:[],   //获取日列表
      
      getYear:null,     //获取年
      getMonth:null,     //获取月
      getDate:null,     //获取日

      isCommit:true,    //是否可提交

      imgWH:{    //上传图片高宽
        width:0,
        height:0
      },
      
      courseOneAddressList:[],  //省列表
      courseTwoAddressList:[],   //市列表
      courseThreeAddressList:[],  //区列表
    };
  },

  created(){
    this.getcourseOneAddressList();
    let classifyList = this.getItem('classifyList');
    if(classifyList){
      this.classifyList = classifyList;
    }
    this.getcurriculumClass(data);
  },

  mounted() {
    let cuo = this.getItem("curriculumObj");
    let num = this.$route.query.num;
    if(cuo){
      this.getData(cuo) ;
    }else if(num){
      this.getCurrObj(num)
    } 
  },

  methods: {
    //获取省列表
    getcourseOneAddressList(){
      this.courseOneAddressList = chinaCityList['0'];
    },

    //获取市列表
    getCityList(num){
      this.courseTwoAddressList = chinaCityList['0_'+num];
    },

    //获取区列表
    getDistrictList(num,num1){
      this.courseThreeAddressList = chinaCityList['0_'+num+'_'+num1];
    },

    //获取图片路劲
    handleAvatarSuccess(res, file) {
      this.curriculumObj.courseImage = file.response.message;
    },

    //判断图片格式和大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png'||file.type === 'image/jpeg';
      const isLt2M = file.size / 1024  < 300;
      if (!isJPG) this.$message({message:'上传课程封面图片只能是 JPG或png 格式!',type:'warning'});
      if (!isLt2M) this.$message({message:'上传课程封面图片大小不能超过300kb!',type:'warning'});
      
      //获取上传图片的高和宽
      let _URL = window.URL || window.webkitURL;
      let img = new Image();
      let then = this;
      img.onload = function() {
        then.imgWH.width = img.width;
        then.imgWH.height = img.height;
      };
      img.src = _URL.createObjectURL(file);  
      return isJPG && isLt2M;
    },

    //点击添加经历
    topAddjl(){
      this.setItem("curriculumObj",this.curriculumObj);
      let query = this.$route.query;
      let str = 'curriculumUndergo?id='+query.id;
      if(query.type) str += '&type='+query.type;
      if(query.num) str += '&num='+query.num;
      this.push(str);
    },

    //获取课程分类
    getcurriculumClass(data){
      let list = data.condList[0].type;
      let num = list.indexOf('不限');
      if(num!==-1)list.splice(num,1)
      this.curriculumClassList = list
    },

    //获取年级分类
    gradeClass(num){
      let num1 = -1;
      if(num<=2) num1 = num - 1;
      else if(num>=4&&num<=6) num1 = num - 2;
      else num1 = -1;
      this.gradeClassList = ['不限'];
      this.subjectClassList = [];
      if(num1===-1){
        this.gradeClassList = [];
        this.getSubjectClass(num,-1);
        return
      }
      this.gradeClassList.push(...data.gradeList[num1])
    },

    //获取科目分类
    getSubjectClass(num,num1){
      this.subjectClassList = ['不限'];
      if((num===6&&num1===7)||(num===7&&num1===-1)){
        this.subjectClassList = [];
      }
      if(num1===-1){
        let obj = data.subject;
        this.subjectClassList.push(...obj[num]);
      }else{
        let obj = data.subject[num];
        let list = [];
        if(num===1||num===2){
          if(num1===6) list = obj[1];
          else list = obj[0];
        }else{
          if(num1===0){
            this.subjectClassList = [];
            list = [];
          }else{
            list = obj[num1-1];
          }
        }
        this.subjectClassList.push(...list);
      }
    },
    
    //页面获取数据时
    getData(obj){
      let cObj = this.curriculumObj;
      for(let name in cObj){
        if(obj[name]) cObj[name] = obj[name];
      }
      setTimeout(() => {
        if(obj.schoolTwo) cObj.schoolTwo = obj.schoolTwo;
      }, 5);
      setTimeout(() => {
        if(obj.schoolOne) cObj.schoolOne = obj.schoolOne;
        cObj.courseTwoAddress = obj.courseTwoAddress;
      }, 10);
      setTimeout(() => {
        cObj.courseThreeAddress = obj.courseThreeAddress;
      }, 15);
    },

    //点击提交时
    topCommit(){
      let cuObj = this.curriculumObj;
      let num = this.$route.query.num;
      if(!cuObj.schoolclass||!cuObj.schoolOne||!cuObj.courseName||!cuObj.coursePrice
        ||!cuObj.coursePeriod||!cuObj.courseTarget||!cuObj.courseOneAddress
        ||!cuObj.courseTwoAddress||!cuObj.courseThreeAddress||!cuObj.courseAddress){
        this.$message({message:'您有类容未填写或未选择！',type:'warning'})
        this.isCommit = false;
        return
      }
      if(!cuObj.courseContent){
        this.$message({message:'课程类容未填写，请点击’添加‘按钮填写课程类容！',type:'warning'})
        return
      }
      let url = '/course/save.do';
      if(num){
        url = '/course/updateCourse.do'
        cuObj.id = num;
      }
      cuObj.organizationName = this.getItem('userInfo').schoolUser.organizationName;
      this.fetch({url,data:cuObj,method:'post'},3).then(res=>{
        if(res.data.success){
          this.setItem('curriculumObj',null)
          this.push({path:'/index/curriculumPublish',query:{id:this.$route.query.id}});
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'});
      })
    },

    //获取课程内容
    getCurrObj(num){
      let url = '/course/findByCourse.do';
      let data = {courseId:num};
      this.fetch({url,data,method:'get'},3).then(res=>{
        this.getData(res.data); 
      })
    },
   
  },
  watch: {
    "curriculumObj.courseOneAddress":function(val){
      if(!val)return
      let list = chinaCityList['0'];
      let num = list.indexOf(val);
      this.curriculumObj.courseTwoAddress = '';
      this.courseTwoAddressList = [];
      this.getCityList(num);
    },
    "curriculumObj.courseTwoAddress":function(val){
      if(!val)return
      let list = chinaCityList['0'];
      let num = list.indexOf(this.curriculumObj.courseOneAddress);
      let list1 = chinaCityList['0_'+num];
      let num1 = list1.indexOf(val);
      this.curriculumObj.courseThreeAddress = '';
      this.courseThreeAddressList = [];
      if(num>-1){
        this.getDistrictList(num,num1);
      }
    },
    "curriculumObj.schoolclass":function(val){
      let list = data.condList[0].type;
      let num = list.indexOf(val);
      this.curriculumObj.schoolOne = '';
      this.curriculumObj.schoolTwo = '';
      num>=0?this.gradeClass(num):'';
    },
    "curriculumObj.schoolTwo":function(val){
      if(!val) return;
      let num = this.curriculumClassList.indexOf(this.curriculumObj.schoolclass);
      let num1 = this.gradeClassList.indexOf(val);
      this.getSubjectClass(num,num1);
    },
    "curriculumObj.coursePrice":function(val){
      this.curriculumObj.coursePrice = val<0?val*-1:val;
    },
    "curriculumObj.courseTarget":function(val){
      let num = 1000-val.length;
      this.targerNum = num;
      if(num<0){
        this.$message({message:'以达到最大字数！',type:'warning'});
        this.curriculumObj.courseTarget = val.slice(0,1000)
      }
    }
  },
}