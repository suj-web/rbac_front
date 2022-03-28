<template>
  <div>
    <el-table
        :data="admins"
        stripe
        border
        style="width: 100%;margin-top:10px">
      <el-table-column
          prop="sessionId"
          label="会话编号"
          align="left"
          width="260">
      </el-table-column>
      <el-table-column
          prop="loginName"
          label="登录名称"
          align="left"
          width="90">
      </el-table-column>
      <el-table-column
          prop="ip"
          label="主机"
          align="left"
          width="80">
      </el-table-column>
      <el-table-column
          prop="address"
          label="登录地点"
          width="120">
      </el-table-column>
      <el-table-column
          prop="browser"
          label="浏览器"
          align="left"
          width="160">
      </el-table-column>
      <el-table-column
          prop="os"
          label="操作系统"
          align="left"
          width="150">
      </el-table-column>
      <el-table-column
          label="登录时间"
          prop="loginTime"
          :formatter="dateFormat"
          align="left"
          width="160">
      </el-table-column>
      <el-table-column
          label="最后访问时间"
          prop="lastRequestTime"
          :formatter="dateFormat"
          align="left"
          width="160">
      </el-table-column>
      <el-table-column
          label="操作"
          align="left">
        <template slot-scope="scope">
          <el-button type="danger" icon="fa fa-sign-out" size="mini" @click="forceQuit(scope.row)">强退</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "OnlineUser",
  data() {
    return {
      admins: []
    }
  },
  mounted() {
    this.initAdmins();
  },
  methods: {
    forceQuit(data) {
      this.$confirm('此操作将强制退出['+data.loginName+']用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$putRequest('/system/cfg/online/quit?username='+data.loginName).then(res=>{
          if(res){
            this.initAdmins();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    dateFormat: function(row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    initAdmins() {
      this.$getRequest('/system/cfg/online/user').then(res=>{
        if(res) {
          this.admins = res;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
