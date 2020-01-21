<template>
  <div class="teacUnd-app fx" style="overflow: hidden;">
    <div class="teac_d_editor fx" ref="teac_from">
      <div class="teac_d_header" ref="teac_d_header"></div>
      <div class="teac_d_body" ref="teac_d_body">
      </div>
    </div>

    <div class="addt_button">
      <el-button type="primary" @click="topCommit()">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      editorObj:null,  //富文本对象
      schoolIntroStr: '', // 编辑内容
      schoolInfoObj:{},
    };
  },

  created() {
    let schoolInfoObj = this.getItem('schoolInfoObj');
    if(schoolInfoObj) {
      this.schoolInfoObj = schoolInfoObj;
      this.schoolIntroStr = schoolInfoObj.schoolContent;
    }
  },

  mounted(){
    this.createEditorObj();
    this.showScroll('teac_d_body', true, 160);
  },

  methods: {
    //初始化富文本
    createEditorObj(){
      let {teac_from,teac_d_header, teac_d_body} = this.$refs;
      this.editor("editorObj", teac_d_header, teac_d_body, 'schoolIntroStr',teac_from);
    },

    //点击保存时
    topCommit(){
      let htm = this.editorObj.txt.html();
      if (!this.editorObj.txt.text()) { // 无内容时 值为空字符串
          let message = '学校简介内容不能为空';
          if (htm.match(/(<img src)([^>])+>/g)) {
              message = '学校简介内容不能只存在图片'
          }
          this.$message({message, type: 'warning'});
          return ;
      }
      this.saveText();
      this.$router.go(-1)
    },

    //保存富文本类容
    saveText(){
      let schoolInfoObj = this.schoolInfoObj;
      schoolInfoObj.schoolContent = this.editorObj.txt.html();
      this.setItem('schoolInfoObj',schoolInfoObj);
    },
  },
  beforeDestroy(){
    this.saveText();
  },
  
}

</script>

<style lang='less'>
.teacUnd-app{
  width: 100%;
  flex-direction: column;
  .teac_d_editor{
    flex: 1;
    width: 100%;
    flex-direction: column;
    .teac_d_header{
      margin-top: 10px;
    }
    .teac_d_body{
      flex: 1;
    }
  }
  .addt_button{
    margin-top: 30px;
    text-align: center;
    .el-button{
      width:150px;
      height:40px;
      background:rgba(42,176,234,1);
      border-radius:5px;
    }
  }
}
</style>