<template>
  <div class="teli-app">
    <div class="teli_d1">
      <span>资讯添加</span>
      <button type="button" @click="topGoToAdd(false)" class="teli_btn">添加</button>
    </div>

    <table class="layui-table teli_table">
      <thead>
        <tr>
          <th>序号</th>
          <th>标题</th>
          <th>作者</th>
          <!-- <th>状态</th> -->
          <th>发布时间</th>
          <th>资讯操作</th>
        </tr> 
      </thead>
      <tbody v-if="teacherList.length>0">
        <tr v-for="(item,i) of teacherList" :key="i">
          <td>{{i+1}}</td>
          <td>{{item.schoolTopic}}</td>
          <td>{{item.schoolAuthor}}</td>
          <!-- <td>{{item.schoolStatus*1===1?'已上架':'已下架'}}</td> -->
          <td>{{item.schoolTime}}</td>
          <td>
            <span @click="topGoToAdd(item.id)">编辑</span>
            <span @click="topDelete(item.id)">删除</span>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr><td style="height:100px;" colspan="7">没有数据</td></tr>
      </tbody>
    </table>

    <pagination 
    :currentPage="pageNo" 
    :sum="total" 
    :onePageNumber="pageSize" 
    :currentChange="updetePageNum"></pagination>
    <!-- <div class="infollfy">
      <el-pagination
        background
        layout="prev, pager, next"
        prev-text='上一页'
        next-text='下一页'
        @current-change = "updetePageNum"
        :current-page="pageNo"
        :page-size="pageSize"
        :total="total">
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
import pagination from '../../../components/common/pagination'
export default {
  components:{pagination},
  data () {
    return {
      teacherList:[],
      pageNo:1,  //当前页
      pageSize:10,   //每页条数
      total:0,    //总条数
    };
  },

  created(){
    this.seachInfoList()
  },

  methods: {
    //获取资讯列表
    seachInfoList(){
      let url = '/attention/selectM.do';
      let data = {
        pageNum:''+this.pageNo,
        pageSize:''+this.pageSize
      }
      this.fetch({url,data,method:'post'},4).then(res=>{
        if(res.data){
          this.total = res.data.total;
          this.teacherList = res.data.rows;
        }
      })
    },

    //点击删除时
    topDelete(num){
      let url = '/attention/remveMessage.do'
      let data ={
        id:''+num
      }
      this.fetch({url,data,method:'post'},4).then(res=>{
        let {message,success} = res.data;
        if(success){
          this.seachInfoList();
        }
        this.$message({message,type:success?'success':'warning'});
      })
    },

    //点击跳转
    topGoToAdd(num){
      let src = 'informationPublish/addInformation?id='+this.$route.query.id
      if(num) {
        src += '&num='+num
      }
      this.setItem("schoolInfoObj",'');
      this.push(src)
    },

    updetePageNum(num){
      this.pageNo = num*1;
      this.seachInfoList()
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
  .infollfy{
    padding: 20px 0;
    text-align: center;
  }
}
</style>