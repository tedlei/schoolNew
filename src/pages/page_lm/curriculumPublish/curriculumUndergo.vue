<template>
  <div class="teacUnd-app fx" style="overflow: hidden;">
    <div class="teac_d_editor fx" ref='teac_feom'>
      <div class="teac_d_header" ref="teac_d_header"></div>
      <div class="teac_d_body" ref="teac_d_body"></div>
    </div>

    <div class="addt_button">
      <el-button type="primary" @click="topCommit">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {  
  data () {
    return {
      editorObj:null,  //富文本对象
      schoolIntroStr: '', // 编辑内容
    };
  },

  created(){
    let curriculumObj = this.getItem("curriculumObj");
    if(curriculumObj) this.schoolIntroStr = curriculumObj.courseContent;
  },

  mounted(){
    this.createEditorObj();
    this.showScroll('teac_d_body', true, 160);
  },

  methods: {

    //初始化富文本
    createEditorObj(){
      let {teac_feom,teac_d_header, teac_d_body} = this.$refs;
      this.editor("editorObj", teac_d_header, teac_d_body, 'schoolIntroStr',teac_feom);
    },


    //保存富文本类容
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
      this.$router.go(-1);
    },

    //保存文本内容
    saveText(){
      let curriculumObj = this.getItem("curriculumObj");
      curriculumObj.courseContent = this.editorObj.txt.html();
      curriculumObj.courseText = this.editorObj.txt.text();
      this.setItem('curriculumObj',curriculumObj);
    }
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
    // .teac_d_body{
      // flex: 1;
        // background: #EEE;
      // overflow-y: auto;
      // .w-e-text{
      //   overflow-y: auto;
      // }
    // }
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