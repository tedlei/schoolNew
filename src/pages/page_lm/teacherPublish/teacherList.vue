<template>
  <div class="teli-app">
    <div class="teli_d1">
      <span>教师添加</span>
      <button type="button" @click="topGoToAdd(false,'0')" class="teli_btn">添加</button>
    </div>

    <table class="layui-table teli_table">
      <thead>
        <tr>
          <th>序号</th>
          <th>教师姓名</th>
          <th>教师年龄</th>
          <th>教师电话</th>
          <th>毕业学校</th>
          <th>擅长教学</th>
          <th>教师操作</th>
        </tr> 
      </thead>
      <tbody>
        <tr v-for="(item,i) of teacherList" :key="i">
          <td>{{i+(page-1)*10+1}}</td>
          <td>{{item.teacherName}}</td>
          <td>{{item.teacherAge}}</td>
          <td>{{item.teacherPhone}}</td>
          <td>{{item.teacherSchool}}</td>
          <td>{{item.teacherAdept}}</td>
          <td>
            <span @click="topGoToAdd(item.id,'1')">编辑</span>
            <span @click="topDelete(item.id)">删除</span>
          </td>
        </tr>
      </tbody>
    </table>

    <pagination 
    :currentPage="page" 
    :sum="total" 
    :onePageNumber="limit" 
    :currentChange="currentChange"></pagination>
  </div>
</template>

<script>
import pagination from '../../../components/common/pagination'
export default {
  components:{pagination},
  data () {
    return {
      teacherList:[],
      page:1,   //当前页
      limit:10,  //页条数
      total:0,  //总数

    };
  },

  created() {
    this.seachTeacherList();
  },

  methods: {
    //点击删除时
    topDelete(id){
      let url = '/teacherPublish/delete.do';
      let data = {id}
      this.fetch({url,data,method:'post'},5).then(res=>{
        if(res.data.success){
          this.seachTeacherList()
        }
        this.$message({message:res.data.message,type:res.data.success?'success':'warning'});
      })
    },

    //点击跳转
    topGoToAdd(num,type){
      let src = 'teacherPublish/addTeacher?id='+this.$route.query.id+"&type="+type;
      if(num) src += '&num='+num
      this.setItem('teacherPublishObj','');
      this.push(src)
    },

    //获取教师列表
    seachTeacherList(){
      let url = '/teacherPublish/list.do';
      let data = {
        page:''+this.page,
        limit:''+this.limit
      }
      this.fetch({url,data,method:'post'},5).then(res=>{
        if(res.data){
          this.total = res.data.total;
          this.teacherList = res.data.rows;
        }
      })
    },

    //点击分页时
    currentChange(num){
      this.page = num;
      this.seachTeacherList();
    }
  }
}
</script>

<style lang='less' scoped>
.teli-app{
  width: 100%;
  .teli_d1{
    padding-top: 30px;
    span{
      font-size: 18px;
      color:rgba(51,51,51,1);
    }
    .teli_btn{
      margin-left: 30px;
      width:120px;
      height:50px;
      background:rgba(42,176,234,1);
      border-radius:5px;
      font-size: 18px;
      color:rgba(255,255,255,1);
      cursor: pointer;
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
        span{
          cursor: pointer;
        }
        span:first-child{
          color:rgba(42,176,234,1);
        }
        span:last-child{
          color:rgba(153,153,153,1);
        }
        span+span{
          margin-left: 20px;
        }
      }
    }
  }
}
</style>