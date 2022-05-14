<template>
  <div style="width: 96%;margin: 1% 2%">
    <div style="display: flex;justify-content: space-between;align-items: center">
      <el-button type="primary" @click="exportTurnOverTable" icon="fa fa-download">&nbsp;导出记录</el-button>
      <div>
        时间:
        <el-date-picker
            v-model="searchValue.localDate"
            @change="initEmpTurnOverRecords"
            style="margin-left: 5px; margin-right: 20px"
            type="month"
            placeholder="选择月份">
        </el-date-picker>
        部门:
        <el-select style="margin-left: 5px;width: 220px;" @change="initEmpTurnOverRecords" v-model="searchValue.depId" clearable placeholder="选择部门">
          <el-option v-for="item in allDeps"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-table
      :data="empTurnOverRecords"
      border
      stripe
      style="margin-top: 20px;width: 100%">
      <el-table-column
          property="name"
          label="部门"
          width="150">
      </el-table-column>
      <el-table-column
          property="beginCount"
          label="期初人数"
          width="120">
      </el-table-column>
      <el-table-column
          property="endCount"
          label="期末人数"
          width="120">
      </el-table-column>
      <el-table-column
          property="entryCount"
          label="入职人数"
          width="120">
      </el-table-column>
      <el-table-column
          property="inductionRate"
          label="入职率"
          width="120">
        <template slot-scope="scope">
          <span>{{scope.row.inductionRate | toFixed}}</span>
        </template>
      </el-table-column>
      <el-table-column
          property="conversionCount"
          label="转正人数"
          width="120">
      </el-table-column>
      <el-table-column
          property="dimissionCount"
          label="离职人数"
          width="120">
      </el-table-column>
      <el-table-column
          property="dimissionRate"
          label="离职率"
          width="120">
        <template slot-scope="scope">
          <span>{{scope.row.dimissionRate | toFixed}}</span>
        </template>
      </el-table-column>
      <el-table-column
          property="foldCount"
          label="调入人数"
          width="120">
      </el-table-column>
      <el-table-column
          property="transferCount"
          label="调离人数">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "TurnOver",
  props: {
    allDeps: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      empTurnOverRecords: [],
      searchValue: {
        localDate: null
      },
      filterArr: []
    }
  },
  watch: {
    allDeps(val){
      if(val) {
        this.initEmpTurnOverRecords();
      }
    }
  },
  mounted() {
    this.initEmpTurnOverRecords();
  },
  methods: {
    exportTurnOverTable() {
      this.$downloadRequest('/statistics/record/export');
    },
    initEmpTurnOverRecords() {
      let url = '/statistics/record/?';
      if(this.searchValue.localDate) {
        let year = this.searchValue.localDate.getFullYear();
        let month = this.searchValue.localDate.getMonth() + 1;
        if(month > 0 && month < 10) {
          month = "0" + month;
        }
        url += "localDate=" + year + "-" + month;
      }
      if(this.searchValue.depId) {
        url += "&depId=" + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.empTurnOverRecords = res;
        }
      })
    }
  },
  filters: {
    toFixed(val) {
      return val.toFixed(2)+'%';
    }
  }
}
</script>

<style scoped>

</style>
