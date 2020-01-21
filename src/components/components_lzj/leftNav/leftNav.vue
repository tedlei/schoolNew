<template>
    <div class="nav fx" ref="nav">
        <sideBar :listData="listData"></sideBar>
    </div>
</template>

<script>
    import sideBar  from './sideBar'
    export default {
        components: {sideBar},
        data(){
          return {
              listData: [
                  {
                      iconfont: 'iconshouyex',
                      context: '首页',
                      url: ''
                  },
                  {
                      iconfont: 'iconshezhi-tianchong',
                      context: '学校设置',
                      optionData: [
                          {
                              text: '基础设置',
                              optionUrl: 'setting'
                          },
                          {
                              text: '学校资料',
                              optionUrl: 'schoolInfoData'
                          },
                          {
                              text: '学校简介',
                              optionUrl: 'schoolIntro'
                          }
                          ],
                      url: 'current'
                  },
                  {
                      iconfont: 'iconkecheng',
                      context: '课程发布',
                      url: 'curriculumPublish'
                  },
                  {
                      iconfont: 'iconwo',
                      context: '教师发布',
                      url: 'teacherPublish'
                  },
                  {
                      iconfont: 'iconzixuntianchong',
                      context: '资讯发布',
                      url: 'informationPublish'
                  },
                  {
                      iconfont: 'iconxiangce',
                      context: '学校相册',
                      url: 'schoolPhoto'
                  },
                  {
                      iconfont: 'iconliuyan-fill',
                      context: '预约中心',
                      url: 'messageManagement'
                  },
                  {
                      iconfont: 'iconcustom-service',
                      context: '学校客服',
                      url: 'addService'
                  },
                  // {
                  //     iconfont: 'iconyouhuiquan',
                  //     context: '优惠劵',
                  //     url: 'coupon'
                  // }
              ]
          }
        },
        methods: {
            /**
             * 处理listData数据
             */
            handleData(){
                let role = this.getItem('userInfo').user.roleList,
                    result = role[role.length-1].roleName,
                    listData = JSON.parse(JSON.stringify(this.listData));
                switch (result) {
                    case 'school_pip':
                        // 保证金用户
                        listData.splice(7, 1); // 删除客服权限
                        break;
                    // not default

                    // case 'vip':
                    //     // vip用户
                    //     // this.listData.splice(1, 1);
                    //     break;
                    // case 'svip':
                    //     // svip 用户
                    //     break;
                    // case 'specially_invited':
                    //     // 特邀用户
                    //     break;
                }
                this.listData = listData;
            }
        },
        created(){
            this.handleData();
        },
        mounted() {
            let htm = document.querySelector('html'),
                w = htm.getBoundingClientRect().width;
            w = Math.max(1440, w);

            this.$refs.nav.style.width = 300 / 1920 * w + 'px';
        }
    }
</script>

<style lang="less" scoped>
</style>
