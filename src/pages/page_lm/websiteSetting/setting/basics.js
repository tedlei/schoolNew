import {Upload,Input,Button,Select,Option} from 'element-ui';
// import chinaCityList from '../../../../../public/js/chinaCityList.js'
import Vue from 'vue'
Vue.use(Upload);
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
export default {
  data () {
    return {
      basicSettings:{   //图片服务器路劲
        schoolImage:'',   //学校封面
        schoolPublicCode:'',   //二维码图片路劲
        schoolAdvertOne:'',  //广告图1
        schoolAdvertTwo:'',  //广告图2
        schoolAdvertThree:'',  //广告图3
        schoolMapImage:''  //学校位置图
      },

      fileImgName:{   //图片文件名称
        schoolPublicCode:'',   //二维码图片路劲
        schoolAdvertOne:'',  //广告图1
        schoolAdvertTwo:'',  //广告图2
        schoolAdvertThree:'',  //广告图3
        schoolMapImage:''  //学校位置图
      },

      upLoadImgUrl:'/upload.do',   //上传图片路径
    };
  },

  created() {
    let userInfo = this.getItem('userInfo');
    for(let name in this.fileImgName){
      this.fileImgName[name] = userInfo.schoolUser[name];
      this.basicSettings[name] = userInfo.schoolUser[name];
    }
    this.basicSettings.schoolImage = userInfo.schoolUser.schoolImage
  },

  methods: {
    //获取图片路劲
    aptitudeSuccess(res, file,str) {
      if(!res.success) {
        this.$message({message:'上传失败，请重新上传！',type: 'warning'});
        return
      }
      switch (str) {
        case 'siCode':
          this.basicSettings.schoolImage = res.message;
          break;
        case 'qrCode':
          this.basicSettings.schoolPublicCode = res.message;
          this.fileImgName.schoolPublicCode = file.name;
          break;
        case 'onea':
          this.basicSettings.schoolAdvertOne = res.message;
          this.fileImgName.schoolAdvertOne = file.name;
          break;
        case 'twoa':
          this.basicSettings.schoolAdvertTwo = res.message;
          this.fileImgName.schoolAdvertTwo = file.name;
          break;
        case 'threea':
          this.basicSettings.schoolAdvertThree = res.message;
          this.fileImgName.schoolAdvertThree = file.name;
          break;
        case 'map':
          this.basicSettings.schoolMapImage = res.message;
          this.fileImgName.schoolMapImage = file.name;
          break;
      }
    },
    //上传Logo图片
    getSiCodeImg(res,file){
      this.aptitudeSuccess(res, file,'siCode');
    },
    //上传Logo图片
    getqrCodeImg(res,file){
      this.aptitudeSuccess(res, file,'qrCode');
    },
    //上传广告图片1
    getOneAdvertisingImg(res,file){
      this.aptitudeSuccess(res, file,'onea');
    },
    //上传广告图片2
    getTwoAdvertisingImg(res,file){
      this.aptitudeSuccess(res, file,'twoa');
    },
    //上传广告图片3
    getThreeAdvertisingImg(res,file){
      this.aptitudeSuccess(res, file,'threea');
    },
    //上传广告图片3
    getMapImg(res,file){
      this.aptitudeSuccess(res, file,'map');
    },

    //判断图片格式和大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/png'||file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) this.$message({message:'上传头像图片只能是 JPG或png 格式!',type: 'warning'});
      if (!isLt2M) this.$message({message:'上传头像图片大小不能超过 1MB!',type: 'warning'});
      return isJPG && isLt2M;
    },

    //上传时清空列表
    topQk(num){
      this.$refs['img'+num].clearFiles();
    },

    //提交资料
    btnCommit(){
      let url = 'attention/update.do';
      let basicSettings = this.basicSettings;
      let userInfo = this.getItem('userInfo');
      let phone = userInfo.user.phone;
      let id = userInfo.schoolUser.id;
      basicSettings.schoolMapImage += '&&phone&&'+phone+'&&phone&&'+id;
      this.fetch({url,data:basicSettings,method:'post'},4).then(res=>{
        basicSettings.schoolMapImage = basicSettings.schoolMapImage.split('&&phone&&')[0];
        if(res.data.success){
          for(let name in basicSettings){
            userInfo.schoolUser[name] = basicSettings[name];
          }
          this.setItem('userInfo',userInfo);
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'});
      })
    }

  },
  computed:{
    isBtn(){
      let boo = false;
      if(!this.basicSettings.schoolPublicCode)return true
      if(!this.basicSettings.schoolAdvertOne)return true
      if(!this.basicSettings.schoolAdvertTwo)return true
      if(!this.basicSettings.schoolAdvertThree)return true
      if(!this.basicSettings.schoolMapImage)return true
      return boo
    }
  }
}