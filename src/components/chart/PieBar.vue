<template>
  <div>
    <div id="myChart" ref="myChart" style="height: 300px;width: 600px"></div>
  </div>
</template>

<script>
export default {
  name: "PieBar",
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    name: {
      type: String,
      default: "数量"
    },
    radius: {
      type: Array,
      default() {
        return ['0%','60%'];
      }
    },
    width: {
      type: String,
      default: '600'
    },
    height: {
      type: String,
      default: '300'
    }
  },
  data() {
    return {
      chart: '',
      barData: {},//{"name":[a,b,c],"count":[1,2,3]}
      options: {}
    }
  },
  watch: {
    data(val) {
      if(val) {
        this.change();
        this.initPie();
        this.init();
      }
    }
  },
  mounted() {
    this.change();
    this.initPie();
    this.init()
  },
  methods: {
    change() {
      let name = [];
      let value = [];
      this.data.forEach(item=>{
        name.push(item.name);
        value.push(item.value);
      })
      this.barData = {
      "name":name,
      "value":value
      };
    },
    init() {
      this.chart = this.$echarts.init(this.$refs.myChart);
      this.chart.resize();
      this.chart.clear();
      this.chart.setOption(this.options);
    },
    initBar() {
      let that = this;
      let options = {
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
            myTool: {
              show: true,
              title: '切换为扇形图',
              icon: 'path://M163.84 880.64h122.88v-737.28h-122.88v737.28z m-40.96-778.24h204.8v819.2h-204.8v-819.2z m286.72 204.8h204.8v614.4h-204.8v-614.4z m40.96 573.44h122.88v-532.48h-122.88v532.48z m245.76-368.64h204.8v409.6h-204.8v-409.6z m40.96 368.64h122.88v-327.68h-122.88v327.68z',
              onclick: function () {
                that.initPie();
                that.init();
              }
            },
            saveAsImage : {show: true},
          }
        },
        tooltip: {
          //触发类型
          trigger: "axis",//图形触发 axis 坐标轴触发
          //坐标轴指示器
          axisPointer: {
            type: "cross"//line 显示一个实线 shadow阴影效果 cross十字准星
          }
        },
        xAxis: {
          type:"category",//value数据轴, category类目轴
          data: this.barData.name,
          axisLabel: {
            rotate: 60,
          }
        },
        yAxis: {
          type:"value"
        },
        series: [
          {
            name: this.name,
            type: "bar",
            data: this.barData.value,
            barWidth: 30,
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
        ]
      };
      this.options = options;
    },
    initPie() {
      let that = this;
      let options = {
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
            myTool: {
              show: true,
              title: '切换为柱状图',
              icon: 'path://M163.84 880.64h122.88v-737.28h-122.88v737.28z m-40.96-778.24h204.8v819.2h-204.8v-819.2z m286.72 204.8h204.8v614.4h-204.8v-614.4z m40.96 573.44h122.88v-532.48h-122.88v532.48z m245.76-368.64h204.8v409.6h-204.8v-409.6z m40.96 368.64h122.88v-327.68h-122.88v327.68z',
              onclick: function () {
                that.initBar();
                that.init();
              }
            },
            saveAsImage : {show: true},
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}:{c}({d}%)",
          fontSize: 13
        },
        series: [
          {
            name: this.name,
            type:"pie",
            data: this.data,
            radius: this.radius,
            center: ['35%', '50%']
          }
        ]
      };
      this.options = options;
    }
  }
}
</script>

<style scoped>

</style>
