<template>
  <div class="hp-app" ref="hp_app">
    <div class="hp_d1 fx">
      <div class="hp_d1_left">
        <div class="hp_d1_top fx">
          <span>网站设置</span>
          <!-- <router-link to="/">完善公司简介</router-link> -->
        </div>
        <div class="hp_d1_zxt fx">
          <div class="hp_circle" id="circle1"></div>
          <ul class="hp_d1_ul">
            <li class="hp_d1_li fx">
              <div></div>
              <span>基本设置</span>
            </li>
            <li class="hp_d1_li fx">
              <div class="hp_bg_color"></div>
              <span>学校简介</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 分割块 -->
      <div style="width: 20px;"></div>
      <div class="hp_d1_right">
        <div class="hp_d1_top fx">
          <span>发布中心</span>
          <!-- <router-link to="/">发布课程</router-link> -->
        </div>
        <div class="hp_d1_zxt" ref="histogram"></div>
      </div>
    </div>

    <div class="hp_d2">
      <div class="hp_d2_top">
          <span>统计浏览量</span>
      </div>
      <div class="hp_d2_zxt" ref="lineChart" v-show="lineChartData.length>1"></div>
      <div class="hp_d2_zxt"  v-show="lineChartData.length<=1">
        <p class="hp_d2_p1">单位（人）</p>
        <p class="hp_d2_p2">暂无数据</p>
      </div>
    </div>

  </div>
</template>

<script>
import homePage from './homePage.js'
export default {
 ...homePage
};
</script>

<style lang='less' scoped>
.hp-app {
  overflow-y: auto;
  position: relative;
  flex: 1;
  background-color: #f2f2f2;
  .hp_d1 {
    height: 400px;
    justify-content: space-between;
    align-items: center;
    .hp_d1_left,
    .hp_d1_right {
      flex: 1;
      padding: 20px;
      height: 400px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 20px 0px rgba(18, 24, 30, 0.1);
      opacity: 0.9;
      border-radius: 5px;
      .hp_d1_top {
        padding-bottom: 20px;
        border-bottom: 1px solid rgba(230, 230, 230, 1);
        justify-content: space-between;
        align-items: center;
        span {
          font-size: 18px;
          color: rgba(51, 51, 51, 1);
        }
        a {
          text-decoration: none;
          font-size: 14px;
          color: rgba(42, 176, 234, 1);
        }
      }


      .hp_d1_zxt{
        margin-top: 1%;
        width: 100%;
        height: 300px;
        justify-content: center;
        align-items: center;
        .hp_circle{
          width: 200px;
          height: 200px;
          border-radius: 100px;
          overflow: hidden;
        }
        .hp_d1_ul{
          margin-left: 100px;
          width: 130px;
          height: 70px;
          li+li{
            margin-top: 10px;
          }
          .hp_d1_li{
            justify-content: center;
            align-items: center;
            div{
              width:20px;
              height:20px;
              background:rgba(255,114,37,1);
              border-radius:50%;
            }
            span{
              margin-left: 20px;
              font-size: 18px;
              color:rgba(153,153,153,1);
            }
            .hp_bg_color{
              background-color: #2AB0EA;
            }
          }
        }
      }
    }
  }
  .hp_d2{
    margin-top: 20px;
    padding: 20px;
    height: 510px;
    background: #FFF;
    border-radius: 5px;
    .hp_d2_top {
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(230, 230, 230, 1);
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 18px;
        color: rgba(51, 51, 51, 1);
      }
    }
    .hp_d2_zxt{
      margin-top: 10px;
      height: calc(100% - 65px);
      // .hp_d2_p1{
      //   margin-top:10px;
      //   text-align: right;
      //   font-size: 14px;
      //   color:rgba(51,51,51,1);
      // }
      .hp_d2_p2{
        margin-top: 100px;
        text-align: center;
        font-size: 18px;
        color:rgba(51,51,51,1);
      }
    }
    .hp_d2_zxt>div{
      width: 100% !important;
      height: 100% !important;
    }

  }
}
</style>