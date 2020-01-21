<template>
  <div class="setting-app fx" ref="setting_app">
    <div class="base_d1" ref="base_d1">
      <vBasics></vBasics>
    </div>
  </div>
</template>

<script>
import vBasics from './setting/basics.vue'
export default {
  components: {vBasics},
  data () {
    return {
      
    };
  }
}
</script>

<style lang='less' scoped>
.setting-app{
  flex: 1;
  position: relative;
  .base_d1{
    flex: 1;
    padding: 20px;
    background-color: white;
    border-radius:5px;
  }
}
</style>