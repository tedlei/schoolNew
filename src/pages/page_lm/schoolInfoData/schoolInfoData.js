import chinaCityList from '../../../../public/js/chinaCityList.js'
import Vue from 'vue'
import {CheckboxGroup,Checkbox} from 'element-ui'
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
export default {
  data() {
    return {
      userInfo:{   //用户信息
        user:{    //普通用户信息
          phone:'',  //电话号码
          name:'',   //帐户名
          email:'',    //邮箱
          password:''   //密码
        },
        schoolUser:{   //学校用户信息
          id:'',
          linkman:'',    //联系人
          organizationName:'',  // 学校名称
          schoolPhone:'',  //  学校电话
          oneDddress:'',    //省
          twoDddress:'',   //市
          threeDddress:'' ,    //区
          schoolAddress:'',   //学校详细地址
          schoolUrl:'',  //  学校网址
          schoolTrade:'',  //  学校行业
          schoolAptitude:'',  // 学校资质
          schoolPermission:'',  //办学许可
          schoolLogo:'',  // 学校LOGO
          schoolCertificate:'',  // 学校证书
        }
      },

      schoolTrade:[],   //学校行业

      provinceList:[],   //省列表
      cityList:[],   //市列表
      areaList:[],   //区列表
      
      emailCorrect:true,   //邮箱验证
      oratCorrect:true,   //机构全称验证
      fixedPhoneCorrect:true,   //固话验证
      urlCorrect:true,   //网址验证
      industryCorrect:false,   //学校行业
      addressCorrect:true,  //学校详细地址

      isUpdate:true,  //是否可修改

      action:"/upload.do",   //图片上传路径
    }
  },
  created() {
    this.getProvince();
    let userInfo = this.getItem('userInfo');
    if(!userInfo) return
    this.seachIsUpdate();
    for(let name in this.userInfo){
      for(let name1 in this.userInfo[name]){
        this.userInfo[name][name1] = userInfo[name][name1]
      }
    }
    this.getHy(userInfo.schoolUser.schoolTrade);
    
  },
  methods: {
    //查询是否可以修改认证信息
    seachIsUpdate(){
      let url = '/attention/findUpdate.do';
      this.fetch({url,data:{},method:'get'},4).then(res=>{
        this.isUpdate = res.data;
      })
    },

    //获取图片路劲
    handleAvatarSuccess(res, file ,str) {
      switch(str){
        case 'aptitude' : this.userInfo.schoolUser.schoolAptitude = file.response.message;
        break;
        case 'permission' : this.info.schoolUser.schoolPermission = file.response.message;
        break;
        case 'logo' : this.userInfo.schoolUser.schoolLogo = file.response.message;
        break;
        case 'brand' : this.userInfo.schoolUser.schoolCertificate = file.response.message;
        break;
      }
    },
    //判断图片格式和大小
    beforeAvatarUpload(file,str) {
      let isJPG = file.type === 'image/png'||file.type === 'image/jpeg';
      let isLt2M = true;
      if (!isJPG) {this.$message.error('上传图片只能是 JPG或png 格式!')}
      if(str==='aptitude'||str==='brand'||str==='permission'){
        isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) this.$message.error('上传'+str==='aptitude'?'营业执照':str==='brand'?'授权文件':'办学许可'+'图片大小不能超过 1MB!');
      }
      if(str==='logo'){
        isLt2M = file.size / 1024 < 300;
        if (!isLt2M) this.$message.error('上传LOGO图片大小不能超过 300k!');
      }
      return isJPG && isLt2M;
    },


    //学校资质
    schoolAptitude(file){
      return this.beforeAvatarUpload(file,'aptitude');
    },
    aptitudeSuccess(res, file){
      this.handleAvatarSuccess(res, file, 'aptitude');
    },

    //办学许可
    schoolPermission(file){
      return this.beforeAvatarUpload(file,'permission');
    },
    permissionSuccess(res, file){
      this.handleAvatarSuccess(res, file, 'permission');
    },
    
    //学校LOGO
    schoolLogo(file){
      return this.beforeAvatarUpload(file,'logo');
    },
    logoSuccess(res,file){
      this.handleAvatarSuccess(res, file, 'logo');
    },

    //品牌资质
    schoolBrand(file){
      return this.beforeAvatarUpload(file,'brand');
    },
    brandSuccess(res,file){
      this.handleAvatarSuccess(res, file, 'brand');
    },

    //获取省
    getProvince(){
      this.provinceList = chinaCityList['0'];
    },
    //获取市
    getCity(num){
      this.cityList = chinaCityList['0_'+num];
    },
    //获取区
    getArea(num1,num2){
      this.areaList = chinaCityList['0_'+num1+'_'+num2];
    },
    //获取主营行业
    getHy(str){
      this.schoolTrade = JSON.parse(str);
    },
    
    //保存基本信息
    topSave(){
      let url = 'attention/updateUser.do';
      let userInfo = this.getItem('userInfo');
      this.fetch({url,data:{email:this.userInfo.user.email},method:'post'},4).then(res=>{
        if(res.data.success){
          userInfo.user.email = this.userInfo.user.email;
          this.setItem('userInfo',userInfo);
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'});
      })
    },

    //上传认证信息
    topUpload(){
      let url = '/attention/updateSchool.do';
      let schoolUser = this.userInfo.schoolUser;
      let userInfo = this.getItem('userInfo');
      schoolUser.schoolCertificate = schoolUser.schoolCertificate + '&&phone&&'+userInfo.user.phone;
      this.fetch({url,data:schoolUser,method:'post'},4).then(res=>{
        if(res.data.success){
          this.isUpdate = false;
          for(let name1 in schoolUser){
            userInfo.schoolUser[name1] = schoolUser[name1]
          }
          userInfo.schoolUser.schoolCertificate = userInfo.schoolUser.schoolCertificate.split('&&phone&&')[0];
          this.setItem('userInfo',userInfo);
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'});
      })
    }
  },
  watch: {
    //选择省时
    'userInfo.schoolUser.oneDddress':function(val){
      let list = this.provinceList;
      let schoolUser = this.userInfo.schoolUser;
      this.getCity(list.indexOf(val));
      let twoDddress = this.getItem('userInfo').schoolUser.twoDddress;
      schoolUser.twoDddress = twoDddress;
      schoolUser.threeDddress = '';
      this.areaList = [];
    },
    //选择市
    'userInfo.schoolUser.twoDddress':function(val){
      if(!val)return
      let list = this.provinceList;
      let list1 = this.cityList;
      this.getArea(list.indexOf(this.userInfo.schoolUser.oneDddress),list1.indexOf(val))
      let threeDddress = this.getItem('userInfo').schoolUser.threeDddress;
      this.userInfo.schoolUser.threeDddress = threeDddress;
    },
    //机构全称
    'userInfo.schoolUser.organizationName':function(){
      // if(!infoVerify.removeBlank(val)){
      //   this.oratCorrect = false;
      // }else{
      //   this.oratCorrect = true;
      // }
    },
    //学校固话
    'userInfo.schoolUser.schoolPhone':function(){
      // infoVerify.fixedPhone.call(this,val);
    },
    //学校网址
    'userInfo.schoolUser.schoolUrl':function(){
      // infoVerify.url.call(this,val);
    },
    'userInfo.schoolUser.schoolAddress':function(val){
      if(!val.replace(/\s*/g,"")) this.addressCorrect = false;
      else this.addressCorrect = true;
    },
    //主营行业
    "schoolTrade":function(val){
      this.userInfo.schoolUser.schoolTrade = JSON.stringify(val);
      if(val.length!==0)this.industryCorrect = true;
      else this.industryCorrect = false;
    }
  },
}