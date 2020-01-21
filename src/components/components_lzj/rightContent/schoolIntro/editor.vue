<template>
    <div class="editor fx" ref="editor">
        <!-- 富文本 -->
        <div class="toolbar" ref="toolbar"></div>
        
        <div class="text" ref="text"> <!--可使用 min-height 实现编辑区域自动增加高度-->
            <p>请输入内容</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                schoolIntroStr: '', // 编辑内容
                editorObj: null, // 富文本对象
                currentPic: ''  // 本地图片数据
            }
        },
        methods: {
            /**
             * 初始显示编辑内容
             */
            initEditorContent(){
                let data = this.getItem('schoolIntroStr');

                if (data) { // 本地存在则用本地的
                    this.schoolIntroStr = data;
                } else {
                    // 请求接口 获取后台保存数据
                    this.fetch({
                        url: 'attention/findSchool.do',
                        method: 'post',
                        data: {}
                    }, 4).then((res)=>{
                        let content = res.data.schoolIntroduction;
                        if (content) this.editorObj.txt.html(content);
                    });
                }
            },
            /**
             * 上传保存学校简介内容
             */
            updater(){
                // 请求接口  更新学校简介
                let userInfo = this.getItem('userInfo');
                let htm = this.editorObj.txt.html();
                if (!this.editorObj.txt.text()) { // 无内容时 值为空字符串
                    let message = '学校简介内容不能为空';
                    if (htm.match(/(<img src)([^>])+>/g)) {
                        message = '学校简介内容不能只存在图片'
                    }
                    this.$message({message, type: 'warning'});
                    return ;
                }
                this.fetch({
                    url: 'attention/update.do',
                    method: 'post',
                    data: {
                        schoolIntroduction: htm +
                            "&&phone&&" + userInfo.user.phone
                            + "&&phone&&" + userInfo.schoolUser.id,
                        schoolText:this.editorObj.txt.text()
                    }
                }, 4).then((res)=>{
                    this.$message({message: '保存成功', type: 'success'});
                    this.saveData();
                });
            },
            // 创建富文本对象
            createEditor(){
                let {toolbar, text, editor} = this.$refs;
                this.editor("editorObj", toolbar, text, 'schoolIntroStr', editor);
            },
            /**
             * 保存到本地
             */
            saveData(){
                this.setItem('schoolIntroStr', this.editorObj.txt.html());
                let userInfo = this.getItem('userInfo');
                if(!userInfo) return;
                userInfo.schoolUser.schoolIntroduction = this.editorObj.txt.html();
                this.setItem('userInfo',userInfo)
            }
        },
        created(){
            this.initEditorContent();
        },
        mounted() {
            this.createEditor();

            // 设置元素最大高度

            this.showScroll('text', true, 94);
        },
        watch: {
            $route(){this.saveData()}
        },
        destroyed() {
            this.saveData()
        }
    }
</script>
<style lang="less">
    .text .w-e-text{
        p{margin: 0}
    }
</style>
<style lang="less" scoped>
    .editor{
        flex-direction: column;
        flex: 1;
        z-index: 10;
        margin-top: 10px;
        .text{
            flex: 1;
        }
    }
</style>
