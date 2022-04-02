<template>
  <div>
    <div id="myChartPie" ref="myChartPie" :style="{height: height+'px',width: width+'px'}"></div>
  </div>
</template>

<script>
export default {
  name: "pie",
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
      chart: ''
    }
  },
  watch: {
    data(val) {
      if(val) {
        this.initPie();
      }
    }
  },
  mounted() {
    this.initPie()
  },
  methods: {
    initPie() {
      this.chart = this.$echarts.init(this.$refs.myChartPie);
      let options = {
        legend: {
          type: 'scroll',
          right: 50,
          top: 28,
          orient: "vertical"
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
      this.chart.setOption(options);
    }
  }
}
</script>

<style scoped>

</style>
