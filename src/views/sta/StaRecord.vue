<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="员工调薪" name="AdjustSalary">
        <AdjustSalary :allDeps="allDeps"></AdjustSalary>
      </el-tab-pane>
      <el-tab-pane label="员工调动" name="EmpRemove">
        <EmpRemove :allDeps="allDeps" :positions="positions"></EmpRemove>
      </el-tab-pane>
      <el-tab-pane label="人员流动" name="TurnOver">
        <TurnOver :allDeps="allDeps"></TurnOver>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AdjustSalary from "@/components/record/AdjustSalary";
import EmpRemove from "@/components/record/EmpRemove";
import TurnOver from "@/components/record/TurnOver";
export default {
  name: "StaRecord",
  components: {
    AdjustSalary,
    EmpRemove,
    TurnOver
  },
  data() {
    return {
      activeName: 'AdjustSalary',
      allDeps: [],
      positions: []
    }
  },
  mounted() {
    this.initAddDeps();
    this.initPositions();
  },
  methods: {
    initAddDeps() {
      this.$getRequest('/statistics/record/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    },
    initPositions() {
      this.$getRequest('/statistics/record/position/list').then(res=>{
        if(res) {
          this.positions = res;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
