<template>
    <div class="schoolService col333 fx" ref="schoolService">
        <h4 class="fx">
            <span>
                <span @click="back" class="pointer">学校简介</span>
                <span v-if="!hidden">
                    <em class="iconfont icondayu" style="position: relative;top: -1.5px;font-size: 13px;"></em>
                    <em>预览</em>
                </span>
            </span>
            <span v-if="hidden">
                <i @click="preview('preview')" class="pointer">预览</i>
                <i @click="updater" class="pointer">保存</i>
            </span>
        </h4>
        <router-view ref="editor" />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                hidden: true
            }
        },
        methods: {
            // 更新学校简介
            updater(){this.$refs.editor.updater()},

            // 预览
            preview(url){
                this.childRouteJump(url);
            },
            // 返回
            back(){
                if (this.hidden) return;
                this.pop();
            },
            // 判断右上角按钮是否显示
            isHidden(route){this.hidden = !/preview/.test(route.fullPath)}
        },
        created(){
            this.isHidden(this.$route);
        },
        watch: {
            $route(route){
                this.isHidden(route)
            }
        }
    }
</script>
<style lang="less" scoped>
    .schoolService{
        flex: 1;
        flex-direction: column;
        padding: 20px;
        background-color: #fff;
        h4{
            justify-content: space-between;
            align-items: center;
            height: 45px;
            padding-bottom: 20px;
            border-bottom: 1px solid #E6E6E6;
            font-size: 18px;
            & span:nth-last-child(1){
                i{
                    display: inline-block;
                    width:75px;
                    height: 30px;
                    background-color: #2AB0EA;
                    color: #fff;
                    font-size: 14px;
                    text-align: center;
                    line-height: 30px;
                    border-radius:5px;
                }
                & i:nth-last-child(1){
                    margin-left: 10px;
                }
            }
        }
    }
</style>