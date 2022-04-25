<template>
  <div>
    <el-tabs>
      <el-tab-pane label="员工账套设置">
        <SobCfg></SobCfg>
      </el-tab-pane>
      <el-tab-pane label="调薪申请">
        <AdjustSalApply></AdjustSalApply>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import SobCfg from "../../components/sal/SobCfg";
import AdjustSalApply from "../../components/sal/AdjustSalApply";
export default {
  name: "SalSobCfg",
  components: {
    SobCfg,
    AdjustSalApply
  }
}
</script>

<style scoped>

</style>
