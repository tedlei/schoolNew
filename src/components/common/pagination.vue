<template>
    <el-pagination
            class="paging fx fxCenter"
        background
        layout="prev,pager,next"
        :prev-text="currentPage === 1 ? '' : '上一页'"
        :next-text="currentPage >= sum/onePageNumber ? '' : '下一页'"
        :page-size="onePageNumber"
        :total="sum"
        :hide-on-single-page="true"
        :current-page="currentPage"
        @current-change="currentChange">
    </el-pagination>
</template>

<script>
    export default {
        data() {
            return {}
        },
        // 当前页   总数     点击页触发的事件    单页显示数量
        props: ['currentPage', 'sum', 'currentChange', 'onePageNumber']
    }
</script>

<style lang="less" scoped>

</style>