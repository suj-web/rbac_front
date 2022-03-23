<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="DepManage">
        <DepManage></DepManage>
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="PosManage">
        <PosManage></PosManage>
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="JoblebelManage">
        <JoblebelManage></JoblebelManage>
      </el-tab-pane>
      <el-tab-pane label="奖惩规则" name="EcRule">
        <EcRule></EcRule>
      </el-tab-pane>
      <el-tab-pane label="权限组" name="PermissManage">
        <PermissManage></PermissManage>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import DepManage from "@/components/sys/DepManage";
  import EcRule from "@/components/sys/EcRule";
  import PosManage from "@/components/sys/PosManage";
  import JoblebelManage from "@/components/sys/JoblebelManage";
  import PermissManage from "@/components/sys/PermissManage";

  export default {
    name: "SysBasic",
    components: {
      DepManage,
      PosManage,
      EcRule,
      JoblebelManage,
      PermissManage
    },
    data() {
      return {
        activeName: 'JoblebelManage'
      }
    }
  }
</script>

<style scoped>

</style>
