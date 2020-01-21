<template>
    <div class="wrapper fx">
        <div style="flex: 1;">
            <headerNav></headerNav>
            <div class="rightContent fx" ref="rightContent">
                <leftNav></leftNav>
                <div class="main fx main_select">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import headerNav from "../components/components_lzj/header/header";
    import leftNav from "../components/components_lzj/leftNav/leftNav";

    export default {
        components: {headerNav, leftNav},
        mounted() {
            this.showScroll('rightContent');
        }
    }
</script>
<style lang="less" scoped>
    .wrapper{
        width: 100vw;
        min-width: 1400px;
        height: 100vh;
        .rightContent{
            .main{
                flex: 1;
                padding: 20px;
                background-color: #f2f2f2;
            }
        }
    }
</style>
