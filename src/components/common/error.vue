<template>
    <div class="fx">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#iconicon-test"></use>
        </svg>
        <span>很抱歉，你要查找的网页找不到</span>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
    .fx{
        width: 100%;
        align-items: center;
        flex-direction: column;
        .icon{
            font-size: 400px;
        }
        span{
            color: #ccc;
        }
    }
</style>