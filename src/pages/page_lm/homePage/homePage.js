import echarts from "../../../../public/js/echarts.js";
export default {
  data() {
    return {
      lineChartData:[],  //折线图数据
      zhuCharData:[],   //柱形图数据
      schoolIntroduction:'',   //学校简介
      jbSetting:0,   //基本设置
    };
  },

  mounted() {
    if(this.getItem('userInfo')){
      this.getLineData();
    }
  },

  methods: {
    /**
     * 获取折线图数据
     */
    getLineData(){
      let schoolUser = this.getItem('userInfo').schoolUser;
      let num = 0;
      this.schoolIntroduction = schoolUser.schoolIntroduction;
      if(schoolUser.schoolPublicCode) num++;
      if(schoolUser.schoolAdvertOne) num++;
      if(schoolUser.schoolAdvertTwo) num++;
      if(schoolUser.schoolAdvertThree) num++;
      if(schoolUser.schoolMapImage) num++;
      this.jbSetting = num / 5;
      let url = '/attention/getSystem.do';
      this.fetch({url,data:{},method:'get'},4).then(res=>{
        let obj = res.data;
        this.lineChartData = obj.monthCount;
        this.zhuCharData = [obj.courseReleaseCount,obj.teacherReleaseCount,obj.informationReleaseCount];
        this.$nextTick(()=>{   //dome树更新后在调用
          this.createCircle()
          this.histogram(this.$refs.histogram);
          this.lineChart(this.$refs.lineChart);
        })
      })
    },
    lineChart(dome){    //折线图
      let lcChart = echarts.init(dome)
      // 基于准备好的dom，初始化echarts实例
      
      let option = {
        title: {   //提示文字设置
          text: '单位（人）',
          left:'94%',
          fontWeight:100,
          textStyle:{
            fontSize:14         
          }
        },
        tooltip : {   //鼠标在图形中坐标
          trigger: 'axis',
          axisPointer: {  
            type: 'cross',
            label: {backgroundColor: 'rgba(42,176,234,0.4)'}
          }
        },
        grid: {  //整体图形的位置
          top: '10%',
          left: '1%',
          right: '1%',
          bottom: '0%',
          containLabel: true
        },
        xAxis : [   //折线图底部
          {
            type : 'category',
            boundaryGap : false,
            data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
          }
        ],
        yAxis : [   //y轴
          {
            type : 'value',
            splitLine:{show:false},//隐藏网格线
          }
        ],
        series : [    //折线样式
          {
            name:'浏览量',
            type:'line',
            stack: '总量',
            symbol: "none",
            smooth: true,
            lineStyle:{    //线条样式
              color:'#2AB0EA'
            },
            areaStyle: {   //填充区域样式
              color:'#2AB0EA'
            },
            data:this.lineChartData
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      lcChart.setOption(option);
    },
    histogram(dome){    //柱形图
      // 基于准备好的dom，初始化echarts实例
      let hgChart = echarts.init(dome);
      let option = {
        title: {   //提示文字设置
          text: '单位（个）',
          top:'1%',
          left:'87.5%',
          fontWeight:100,
          textStyle:{
            fontSize:14         
          }
        },
        grid: {  //整体图形的位置
          top: '15%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: {  //x轴
          type: 'category',
          data: ['课程发布', '教师发布', '资讯发布']
        },
        yAxis: {  //
            type: 'value',
            show:false,
				    splitLine:{show:false},//隐藏网格线

        },
        series: [   //
          {
            data: this.zhuCharData,
            type: 'bar',
            barMaxWidth:'40px',
            label:{
              // value:[1,2,3],
              show:true,  
              fontSize:'18px',
              position: 'top',
              textStyle: {        //数值样式
                color: 'black',
                fontSize: 16
              }
            },
            itemStyle: {
              normal: {
                  // 随机显示
                  // color:function(d){return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);},
                  // 定制显示（按顺序）
                  color: function(params) { 
                      var colorList = ['#FF7225','#2AB0EA','#CC0808']; 
                      return colorList[params.dataIndex] 
                  }
              },
            },
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      hgChart.setOption(option);
    },

    createCircle(){
      // 基于准备好的dom，初始化echarts实例
      let circle1 = echarts.init(document.getElementById('circle1'));
      let option = {
        series: [
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['80%', '95%'],
            silent :false,
            startAngle:70,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                    fontSize: '16',
                    fontWeight: 'bold'
                }
              }
            },
            data: [
              {
                value:0.9*this.jbSetting ,
                name:'基本设置',
                itemStyle: {
                  color: '#FF7225'
                }
              },
              {
                value:0.9*(1-this.jbSetting),
                name:'基本设置',
                itemStyle: {
                  color: '#d2d2d2'
                }
              },
              {
                value: 0.1,
                itemStyle: {
                  color: 'none'
                }
              },
            ]
          },
          {
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['50%', '65%'],
            silent :false,
            startAngle:70,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                    fontSize: '16',
                    fontWeight: 'bold'
                }
              }
            },
            data: [
              {
                value: 0.9*(this.schoolIntroduction?1:0),
                name:'学校简介',
                itemStyle: {
                  color: '#2AB0EA'
                }
              },
              {
                value: 0.9*(this.schoolIntroduction?0:1),
                name:'学校简介',
                itemStyle: {
                  color: '#d2d2d2'
                },
              },
              {
                value: 0.1,
                itemStyle: {
                  color: 'none'
                }
              },
            ]
          }
        ]
       };
      // 使用刚指定的配置项和数据显示图表。
      circle1.setOption(option)
    }
  }
};