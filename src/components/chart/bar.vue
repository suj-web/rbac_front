<template>
  <div>
    <div id="myChartBar" ref="myChartBar" :style="{height: height+'px',width: width+'px'}"></div>
  </div>
</template>

<script>
export default {
  name: "bar",
  props: {
    data: {
      type: Object,
      default() {
        return '';
      }
    },
    name: {
      type: String,
      default: "平均工资"
    },
    width: {
      type: String,
      default: '600'
    },
    height: {
      type: String,
      default: '300'
    },
    change: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: ''
    }
  },
  watch: {
    data(val) {
      if(val) {
        if(this.change) {
          this.changeData();
        }
        this.initBar();
      }
    }
  },
  mounted() {
    if(this.change) {
      this.changeData();
    }
    this.initBar();
  },
  methods: {
    changeData() {
      let name = [];
      let value = [];
      this.data.forEach(item=>{
        name.push(item.name);
        value.push(item.average);
      })
      this.data = {
        "name":name,
        "value":value
      };
    },
    initBar() {
      this.chart = this.$echarts.init(this.$refs.myChartBar);
      let options = {
        tooltip: {
          //触发类型
          trigger: "axis",//图形触发 axis 坐标轴触发
          //坐标轴指示器
          axisPointer: {
            type: "cross"//line 显示一个实线 shadow阴影效果 cross十字准星
          }
        },
        legend: {
          type: 'scroll',
          right: 50,
          top: 28,
          orient: "vertical"
        },
        toolbox: {
          show : true,
          top: -5,
          right: 50,
          feature : {
            mark : {show: true},
            dataView : {show: true},
            dataZoom: { //数据缩放视图
              show: true
            },
            saveAsImage : {show: true},
          }
        },
        xAxis: {
          type:"category",//value数据轴, category类目轴
          data: this.data.name,
          axisLabel: {
            rotate: 60,
          }
        },
        yAxis: {
          type:"value"
        },
        series: {
          name: this.name,
          barWidth: 30,
          type: "bar",
          data: this.data.value,
          markPoint: {
            data: [
              {
                type:"max",
                name:"最大值"
              },
              {
                type:"min",
                name: "最小值"
              }
            ]
          }
        }
      }
      this.chart.setOption(options);
    }
  }
}
</script>

<style scoped>

</style>
