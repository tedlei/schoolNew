<template>
    <div class="preview" ref="preview" v-html="previewContent"></div>
</template>

<script>
    export default {
        data() {
            return {
                previewContent: ``
            }
        },
        mounted() {
            let timer = setTimeout(()=>{
                let result = this.getItem('schoolIntroStr');
                if (result) {
                    this.previewContent = result
                }

                clearTimeout(timer);
            }, 200);

            this.showScroll('preview', true, 58);
        }
    }
</script>

<style lang="less" scoped>
.preview{
    overflow-y: auto;
    white-space: pre-line;
    line-height: 1.5;
}
</style>
