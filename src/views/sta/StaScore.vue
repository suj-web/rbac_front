<template>
  <div>
    <div style="display: flex;justify-content:flex-end;flex-wrap:wrap;align-items: center">
      <div>
        时间&nbsp;
        <el-date-picker
            v-model="searchValue.localDate"
            @change="change"
            type="month"
            style="margin-right: 20px"
            placeholder="选择月份">
        </el-date-picker>
      </div>
      <div>
        部门&nbsp;
        <el-select @change="change" v-model="searchValue.depId" clearable placeholder="选择部门">
          <el-option v-for="item in allDeps"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
      </div>
    </div>
    <div style="display: flex;flex-wrap: wrap;margin-top: 20px">
      <el-card>
        <div slot="header">
          <span>积分占比</span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-more"></el-button>
        </div>
        <pie :data="empScore" :key="1" :name="name" :radius="radius" :width="500" :height="300"></pie>
      </el-card>
      <el-card style="width: 700px">
        <div slot="header">
          <span>积分排名</span>
          <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-more"></el-button>
        </div>
        <el-table
            :data="empScoreRank"
            style="width: 100%">
          <el-table-column
              type="index"
              width="80"
              label="序号">
          </el-table-column>
          <el-table-column
              property="employee.workId"
              width="120"
              label="工号">
          </el-table-column>
          <el-table-column
              property="employee.name"
              width="100"
              label="姓名">
          </el-table-column>
          <el-table-column
              property="employee.department.name"
              width="150"
              label="部门">
          </el-table-column>
          <el-table-column
              property="score"
              width="100"
              sortable
              label="积分">
          </el-table-column>
          <el-table-column
              property="ecDate"
              width="100"
              :formatter="dateFormat"
              label="月份">
          </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: flex-end;margin-top: 10px">
          <el-pagination
              background
              @current-change="currentChange"
              @size-change="sizeChange"
              layout="sizes, prev, pager, next, jumper, ->, total"
              :total="total">
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import pie from "../../components/chart/pie";
export default {
  name: "StaScore",
  components: {pie},
  data() {
    return {
      empScore: [],
      name: '积分',
      radius: ['44%','60%'],
      empScoreRank: [],
      total: 0,
      currentPage: 1,
      size: 10,
      searchValue: {
        localDate: null,
        depId: null
      },
      allDeps: []
    }
  },
  mounted() {
    this.initEmpScore();
    this.initEmpScoreRank();
    this.initAllDeps();
  },
  methods: {
    dateFormat(row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM");
    },
    change() {
      this.initEmpScore();
      this.initEmpScoreRank();
    },
    initAllDeps() {
      this.$getRequest('/statistics/score/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    },
    sizeChange(val) {
      this.size = val;
      this.initEmpScoreRank();
    },
    currentChange(val) {
      this.currentPage = val;
      this.initEmpScoreRank();
    },
    initEmpScoreRank() {
      let url = '/statistics/score/score/rank?currentPage='+this.currentPage+"&size="+this.size;
      if(this.searchValue.localDate) {
        let year = this.searchValue.localDate.getFullYear();
        let month = this.searchValue.localDate.getMonth() + 1;
        if(month > 0 && month < 10) {
          month = "0" + month;
        }
        url += "&localDate=" + year + "-" + month;
      }
      if(this.searchValue.depId) {
        url += "&depId=" + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.empScoreRank = res.data;
          this.total = res.total;
        }
      })
    },
    initEmpScore() {
      let url = '/statistics/score/score/statistic?currentPage='+this.currentPage+"&size="+this.size;
      if(this.searchValue.localDate) {
        let year = this.searchValue.localDate.getFullYear();
        let month = this.searchValue.localDate.getMonth() + 1;
        if(month > 0 && month < 10) {
          month = "0" + month;
        }
        url += "&localDate=" + year + "-" + month;
      }
      if(this.searchValue.depId) {
        url += "&depId=" + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.empScore = res;
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-card {
    margin-left: 20px;
    height: 100%;
  }
</style>
