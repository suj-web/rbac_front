<template>
  <div>
    <el-table
        :data="tables"
        border
        stripe
        style="width: 80%"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称">
      </el-table-column>
      <el-table-column
          prop="tableName"
          label="表名">
      </el-table-column>
    </el-table>
    <el-button style="padding-right: 8px;padding-left: 8px;margin-top: 10px" type="danger" icon="fa fa-trash-o" :disabled="this.multipleSelection.length===0" @click="init">&nbsp;清除数据</el-button>
  </div>
</template>

<script>
export default {
  name: "SysInit",
  data() {
    return {
      tables: [],
      multipleSelection: []
    }
  },
  mounted() {
    this.initTables();
  },
  methods: {
    init() {
      this.$confirm('此操作将彻底清除【' + this.multipleSelection.length + '】个数据表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item=>{
          ids += 'ids=' + item.id + '&';
        });
        this.$deleteRequest('/system/init/' + ids).then(res => {
          if (res) {
            console.log(res.message);
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    initTables() {
      this.$getRequest('/system/init/list').then(res=>{
        if(res) {
          this.tables = res;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
