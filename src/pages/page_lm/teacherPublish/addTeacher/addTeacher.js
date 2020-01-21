import Vue from "vue"
import {Upload,Button} from 'element-ui'
import data from './data.js'
Vue.use(Upload)
Vue.use(Button)
export default {
  data () {
    return {
      teacherPublishObj:{    //教师发布
        teacherName:'',    //教师名字
        teacherAge:'',   //教学年龄
        teacherPhone:'',    //教师电话
        teacherImage:'',     //教师照片
        teacherSchool:'',    //教师毕业学校
        teacherAdept:'',   //擅长的课程

        teacherIntro:'',  //教师寄语
        teacherMessage:'',  //教师经历

      },


      getYearList:[],   //获取年列表
      getMonthList:[],   //获取月列表
      getDateList:[],   //获取日列表

      getYear:null,     //获取年
      getMonth:null,     //获取月
      getDate:null,     //获取日
      
      selectTeachingList:data,   //获取教学列表
      teaching1:null,   //获取课程
      teaching2:null,
      

      isUpdate:false,   //是否修改 

      isError:true,    //提交时验证

      userInfo:{},
    };
  },

  created() {
    let userInfo = this.getItem('userInfo');
    if(userInfo) this.userInfo = userInfo;
    let num = this.$route.query.num;
    if(num){
      this.isUpdate = true;
    }else{
      this.isUpdate = false;
    }
  },

  mounted() {
    let tph = this.getItem('teacherPublishObj');
    if(tph){
      this.teacherPublishObj = tph;
      this.getData(tph);
    }else{
      this.getTeacherObj();
    }

  },

  methods: {
    //获取图片路劲
    handleAvatarSuccess(res, file) {
        this.teacherPublishObj.teacherImage = file.response.message;
    },
    //判断图片格式和大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png'||file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 < 300;
      if (!isJPG) this.$message({message:'上传工作照只能是 JPG或png 格式!',type:'warning'});
      if (!isLt2M) this.$message({message:'上传工作照大小不能超过300kb!',type:'warning'});
      return isJPG && isLt2M;
    },
    
    //点击添加经历
    topAddjl(){
      let query = this.$route.query;
      this.setItem('teacherPublishObj',this.teacherPublishObj);
      let str = 'teacherUndergo?id='+query.id;
      if(query.type) str += '&type='+query.type;
      if(query.num) str += '&num='+query.num;
      this.push(str);
    },

    //查询教师
    getTeacherObj(){
      let url = '/teacherPublish/queryById.do';
      let id = this.$route.query.num;
      if(!id) return
      this.fetch({url,data:{id},method:'post'},5).then(res=>{
        this.teacherPublishObj = res.data;
        this.getData(res.data);
      })
    },


    //修改教师
    updateTeacher(){
      let url = '/teacherPublish/edit.do';
      let obj = this.teacherPublishObj;
      obj.teacher_oneaddress = this.userInfo.schoolUser.oneDddress;
      obj.teacher_twoaddress = this.userInfo.schoolUser.twoDddress;
      obj.organization_name = this.userInfo.schoolUser.organizationName;
      console.log(obj,'修改');
      this.fetch({url,data:obj,method:'post'},5).then(res=>{
        if(res.data.success){
          this.push({path:"/index/teacherPublish",query:{id:this.$route.query.id}});
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'});
      })
    },
    
    //当选择课程时
    getTeaching(val1,val2){
      let str = '';
      if(val1) str += (str?',':'')+val1; 
      if(val2) str += (str?',':'')+val2; 
      this.teacherPublishObj.teacherAdept = str;
    },

    //自动选择课程
    autoGetTeaching(str){
      if(!str)return
      let arr = str.split(',');
      if(arr[0]) this.teaching1 = arr[0];
      if(arr[1]) this.teaching2 = arr[1];
    },

    //当获取数据时
    getData(obj){
      let tpObj = this.teacherPublishObj;
      // for(let name in tpObj){
      //   if(obj[name]) tpObj[name] = obj[name];
      // }
      obj.teacherAdept&&this.autoGetTeaching(obj.teacherAdept);
    },

    //添加教师
    topCommit(){
      let tpObj = this.teacherPublishObj;
      if(!tpObj.teacherName||!tpObj.teacherAge||!tpObj.teacherSchool||!tpObj.teacherAdept||!tpObj.teacherIntro){
        this.$message({message:'您有内容未填写或选项未选择！',type:"warning"})
        this.isError = false;
        return
      }
      if(tpObj.teacherPhone.length!==11){
        this.$message({message:'教师电话格式不正确！',type:"warning"})
        return
      }
      if(!tpObj.teacherMessage){
        this.isError = false;
        this.$message({message:'教师经历未填写',type:"warning"})
        return
      }
      this.isError = true;
      let url = '/teacherPublish/add.do'
      tpObj.teacher_oneaddress = this.userInfo.schoolUser.oneDddress;
      tpObj.teacher_twoaddress = this.userInfo.schoolUser.twoDddress;
      tpObj.organization_name = this.userInfo.schoolUser.organizationName;
      this.fetch({url,data:tpObj,method:'post'},5).then(res=>{
        if(res.data.success){
          this.push({path:"/index/teacherPublish",query:{id:this.$route.query.id}});
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'});
      })
    },
    
  },
  watch: {
    'teaching1':function(val){
      this.getTeaching(val,this.teaching2)
    },
    'teaching2':function(val){
      this.getTeaching(this.teaching1,val)
    }
  },
  computed: {
    syFontNum(){
      let ti = this.teacherPublishObj.teacherIntro;
      let num = 150 - ti.length;
      if(num<0){
        num = 0;
        this.teacherPublishObj.teacherIntro = ti.slice(0,149);
        this.$message({message:'字数以达到最大限制',type:'warning'});
      }
      return num; 
    }
  },
}