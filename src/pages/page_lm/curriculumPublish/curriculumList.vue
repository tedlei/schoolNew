<template>
  <div class="teli-app">
    <div class="teli_d1">
      <span>课程添加</span>
      <span class="">（自主编写，最多可以添加8个分类，每个分类不要超过10个字符）</span>
    </div>
    <ul class="addt_u1">
      <li class="addt_l1 fx">
        <div class="addt_d_span">
          <span>自定义分类</span>
        </div>
        <div class="addt_d_input">
          <input type="text" v-model="className" placeholder="请输入分类">
        </div>
        <button type="button" 
        class="curr_btn" 
        @click="topAddClass" 
        :class="classifyList.length>=8?'isDisable':''" 
        :disabled="classifyList.length>=8">添加</button>
      </li>
      <li class="addt_l1 fx" v-show="classifyList.length>0">
        <div class="addt_d_span"></div>
        <div class="curr_List">
          <table class="layui-table teli_table">
            <thead>
              <tr>
                <th>课程分类</th>
                <th>分类操作</th>
              </tr> 
            </thead>
            <tbody>
              <tr v-for="(item,i) of classifyList" :key="i">
                <td>{{item.categoryName}}</td>
                <td>
                  <span class="color_l pointer" @click="topGoToAddClass(item.categoryName,i)">编辑</span>
                  <span class="color_h pointer" @click="topDeleteClass(i,item.categoryName)">删除</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="curr_tc fx" v-show="isShowTc" @click.stop="topClose">
            <div class="curr_tc_d1">
              <p class="curr_tc_d1_p"><i @click="topClose" class="el-icon-close"></i></p>
              <el-input v-model="updateClass" placeholder="请输入内容"></el-input>
              <div class="curr_tc_d1_btn">
                <el-button type="primary" @click="topUpdateClass">确定</el-button>
              </div>
            </div>
          </div>
        </div>
      </li>
      <li class="addt_l1 fx">
        <div class="addt_d_span"></div>
        <div class="curr_span">
          <span>注：此处是添加雏鸟教育网站没有的课程分类，如：小学地理。本网站有的课程分类不用添加，直接课程添加即可。</span>
        </div>
      </li>
    </ul>
    <div class="teli_d1">
      <span>课程添加</span>
      <button type="button" :disabled='isDis' @click="topGoToAdd(false)" class="teli_btn" :class="isDis?'teli_dis':''">添加</button>
      <span class="" v-if="JSON.stringify(jurisdiction) !== '{}'">
        （注：{{jurisdiction.title}}）
        <!-- <span v-if="jurisdiction.isUpgrade">是否<span>升级</span></span> -->
        <!-- ) -->
      </span>
    </div>
    <table class="layui-table teli_table">
      <thead>
        <tr>
          <th>序号</th>
          <th>课程名称</th>
          <th>课程价格</th>
          <th>学习周期</th>
          <!-- <th>状态</th> -->
          <th>课程等级</th>
          <th>课程操作</th>
          <th v-if="isShowMain">主推</th>
        </tr> 
      </thead>
      <tbody v-if="curriculumList.length>0">
        <tr v-for="(item,i) of curriculumList" :key="i">
          <td>{{i+1}}</td>
          <td>{{item.courseName}}</td>
          <td>{{item.coursePrice}}</td>
          <td>{{item.coursePeriod}}</td>
          <!-- <td>{{item.courseStatus*1===0?'以上架':'已下架'}}</td> -->
          <td>{{item.courseGrade}}</td>
          <td>
            <span class="color_l pointer" @click="topGoToAdd(item.id)">编辑</span>
            <span class="color_h pointer" @click="topDelete(item.id,item)">删除</span>
          </td>
          <td v-if="isShowMain">
            <span @click="topCurrMain(item.id,item.courseCategory)"
            :class="item.courseCategory*1===0?'color_l pointer':item.courseCategory*1===2?'color_red':'color_red pointer'">
              {{item.courseCategory*1===0?'设为主推课程':item.courseCategory*1===1?'取消主推课程':'已设置广告课程'}}
            </span>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr><td style="height:100px;" :colspan="isShowMain?8:7">没有数据</td></tr>
      </tbody>
    </table>
    <pagination 
    :currentPage="pageNo" 
    :sum="total" 
    :onePageNumber="pageSize" 
    :currentChange="updetePageNum"></pagination>
  </div>
</template>

<script>
import pagination from '../../../components/common/pagination'
export default {
  components:{pagination},
  data () {
    return {
      classifyList:[],    //自定义分类列表

      className:'',     //自定义分类
      classNum:0,    //自定义分类下标
      updateClass:'',    //要修改的分类

      isShowTc:false,    //是否显示分类
      isShowMain:false,   //是否显示主推课程

      jurisdiction:{},   //权限  

      userInfo:{},   //用户数据

      input:'',  

      curriculumList:[],   //课程列表

      pageNo:1,   //当前页
      pageSize:10,   //每页条数
      total:0,   //总条数
    };
  },
  created() {
    let userInfo = this.getItem('userInfo')
    this.userInfo = userInfo;
    this.featuredCurrNum();
    this.seachCurrClass();
    this.seachCurrList()
  },

  methods: {
    //查询权限
    featuredCurrNum(){
      let roleList = this.userInfo.user.roleList;
      let mainCurrNum = this.userInfo.schoolUser.courseCategory;
      let roleName = roleList[roleList.length-1].roleName;
      let jurisdiction ={};
      let title = '';
      let isUpgrade = false;
      this.isShowMain = true;
      switch (roleName) { 
        case 'specially_invited':  
              title='您目前为特邀用户，上传课程数量无限制。还可设置'+mainCurrNum+'个主推课程',
              isUpgrade=true 
          break;
        case 'svip':  
              title='您目前为SVIP用户，上传课程数量无限制。还可设置'+mainCurrNum+'个主推课程',
              isUpgrade=false 
          break;
        case 'vip':  
              title='您目前为VIP用户，上传课程数量无限制。还可设置'+mainCurrNum+'个主推课程',
              isUpgrade=false 
          break;
        case 'school_pip':  
              title='您目前为诚信合作用户，上传课程数量无限制。还可设置'+mainCurrNum+'个主推课程',
              isUpgrade=true
          break;
        case 'school':  
              title='您目前为普通用户，上传课程数量为3个。不可设置主推课程',
              isUpgrade=true;
              this.isShowMain = false;
          break;
      }
      jurisdiction.title = title;
      jurisdiction.isUpgrade = isUpgrade;
      this.jurisdiction = jurisdiction;
    },

    //点击删除时
    topDelete(courseId,item){
      let url = '/course/deleteCourse.do'
      let data = {courseId}
      this.fetch({url,data,method:'get'},3).then(res=>{
        if(res.data.success){
          if(item.courseCategory==='1'){
            this.userInfo.schoolUser.courseCategory ++;
          }
          this.setItem('userInfo',this.userInfo)
          this.seachCurrList();
          this.featuredCurrNum();
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'})
      })
    },

    //点击跳转
    topGoToAdd(num){
      let src = 'curriculumPublish/addCurriculum?id='+this.$route.query.id
      if(num) {
        src += '&num='+num
      }
      this.setItem('curriculumObj','')
      this.push(src)
    },

    //点击添加新分类
    topAddClass(){
      let categoryName = this.verifyClassify(this.className);
      if(!categoryName)return;
      let url = '/cate/save.do'
      let data = {
        categoryName
      };
      this.fetch({url,data,method:'post'},4).then(res=>{
        if(res.data.success){
          this.seachCurrClass();
          this.className ='';
          this.$message({message:res.data.message,type:'success'});
        }else{
          this.$message({message:res.data.message,type:'warning'});
        }
      })
    },

    //验证分类
    verifyClassify(str){
      str = str.replace(/\s*/g,"");
      if(!str){
        this.$message({message:'请输入要添加的分类！',type:'warning'});
        return false
      }
      if(str.length>10){
        this.$message({message:'输入类容不要超过10个字符',type:'warning'});
        return false
      }
      for(let obj of this.classifyList){
        if(obj.categoryName===str){
          this.$message({message:'已有该分类！',type:'warning'});
          return
        }
      }
      if(this.classifyList.length>=8){
        this.$message({message:'最多添加8个分类！',type:'warning'});
        return false
      }
      return str
    },

    //点击分类编辑时
    topGoToAddClass(item,i){
      this.isShowTc = true;
      this.classNum = i;
      this.updateClass = item;
    },

    //点击关闭弹窗
    topClose(event){
      if(event.currentTarget===event.target){
        this.isShowTc = false;
      }
    },

    //点击修改分类
    topUpdateClass(){
      let updateClass = this.verifyClassify(this.updateClass);
      if(!updateClass)return
      let url = '/cate/update.do';
      let data = {
        usedName:this.classifyList[this.classNum].categoryName,
        categoryName:updateClass,
      }
      this.fetch({url,data,method:'post'},4).then(res=>{
        if(res.data.success){
          this.classifyList[this.classNum].categoryName = updateClass;
          this.isShowTc = false;
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'})
      })

    },

    //点击删除分类
    topDeleteClass(num,categoryName){
      let url = '/cate/delete.do';
      let data = {
        categoryName,
      };
      this.fetch({url,data,method:'post'},4).then(res=>{
        if(res.data.success){
          this.classifyList.splice(num,1);
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'})
      })
    },

    //查询学校自定义分类
    seachCurrClass(){
      let url = '/cate/cate.do';
      this.fetch({url,data:{},method:'get'},4).then(res=>{
        if(res.data){
          this.classifyList = res.data;
          this.setItem('classifyList',this.classifyList);
        }
      })
    },

    //查询学校课程
    seachCurrList(){
      let url = '/course/findPage.do';
      let data = {
        pageNo   : ''+this.pageNo,
        pageSize : ''+this.pageSize
      }
      this.fetch({url,data,method:'post'},3).then(res=>{
        if(res.data){
          this.total = res.data.total*1;
          this.curriculumList = res.data.rows;
        }
      })
    },

    //分页切换
    updetePageNum(num){
      this.pageNo = num*1;
      this.seachCurrList()
    },

    //设置主推课程或取消主推课程
    topCurrMain(courseId,category){
      let url = '/course/updateCategory.do';
      if(category*1===0){
        category = '1';
      }else if(category*1===1){
        category = '0';
      }else{
        return 
      }
      let data = {
        courseId,
        category
      }
      this.fetch({url,data,method:'post'},3).then(res=>{
        if(res.data.success){
          if(category === '1'){
            this.userInfo.schoolUser.courseCategory --;
          }else{
            this.userInfo.schoolUser.courseCategory ++;
          }
          this.setItem('userInfo',this.userInfo)
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'});
        this.featuredCurrNum();
        this.seachCurrList();
      })
    }
  },
  computed: {
    //是否禁用添加按钮
    isDis(){
      let userInfo = this.userInfo;
      if(userInfo.user.roleList.length<=2){
        if(this.curriculumList.length>=3){
          return true
        }
      }
      return false;
    }
  },
}

</script>

<style lang='less' scoped>
.teli-app{
  width: 100%;
  .teli_d1{
    padding-top: 30px;
    span{
      font-size: 16px;
      color:rgba(51,51,51,1);
    }
    span:last-child{
      margin-left: 30px;
      font-size: 14px;
      color:rgba(153,153,153,1);
      span{
        margin-left: 0;
        color: #2AB0EA;
      }
    }
    .teli_btn{
      margin-left: 30px;
      width:120px;
      height:50px;
      background:rgba(42,176,234,1);
      border-radius:5px;
      font-size: 16px;
      color:rgba(255,255,255,1);
      cursor: pointer;
    }
    .teli_dis{
      background: #ccc;
      cursor: no-drop;
    }
  }

  .addt_u1{
    width: 100%;
    .addt_l1{
      margin-top: 20px;
      width: 100%;
      .addt_d_span{
        padding-top: 12px;
        width:80px;
        font-size: 16px;
        color:rgba(102,102,102,1);
      }
      .addt_d_input{
        margin-left: 20px;
        width:400px;
        height:50px;
        border:1px solid rgba(230,230,230,1);
        border-radius:5px;
        overflow: hidden;
        input{
          padding-left: 10px;
          width: 100%;
          height: 100%;
          font-size: 16px;
          color:rgba(51,51,51,1);
        }
      }
      .curr_btn{
        margin-left: 20px;
        width:120px;
        height:50px;
        background:rgba(42,176,234,1);
        border-radius:5px;
        font-size: 16px;
        color:rgba(255,255,255,1);
        cursor: pointer;
      }
      .isDisable{
        background:rgba(204,204,204,1);
        color:rgba(255,255,255,1);
        cursor:no-drop;
      }
      .curr_List{
        margin-left: 20px;
        width: 540px;
        .curr_tc{
          position:absolute;
          z-index: 100;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.1);
          justify-content: center;
          align-items: center;
          top: 0;
          left: 0;
          .curr_tc_d1{
            width:600px;
            height:210px;
            background:rgba(255,255,255,1);
            box-shadow:0px 0px 20px 0px rgba(18,24,30,0.2);
            border-radius:5px;
            .curr_tc_d1_p{
              padding:10px 0; 
              padding-right: 10px;
              font-size: 20px;
              text-align: right;
              i{
                cursor: pointer;
              }
            }
            .el-input{
              margin:20px 15%;
              width: 70%;
            }
            .curr_tc_d1_btn{
              padding-top: 10px;
              text-align: center;
              .el-button{
                width:120px;
                height:50px;
                background:rgba(42,176,234,1);
                border-radius:5px;
              }
            }
          }
        }
      }
      .curr_span{
        margin-left: 20px;
        font-size: 14px;
        color:rgba(204,204,204,1);
      }
    }
  }
  .teli_table{
    margin-top: 30px;
    thead>tr{
      background:rgba(250,250,250,1);
      th{
        text-align: center;
        color:rgba(51,51,51,1);
      }
    }
    tbody>tr{
      td{
        text-align: center;
        color:rgba(102,102,102,1);
        .pointer{
          cursor: pointer;
        }
        .color_l{
          color:rgba(42,176,234,1);
        }
        .color_h{
          color:rgba(153,153,153,1);
          // color: red;
        }
        .color_red{
          color:#ff2d2d;
        }
        span+span{
          margin-left: 20px;
        }
      }
    }
  }
  .currllfy{
    padding: 20px 0;
    text-align: center;
  }
}
</style>