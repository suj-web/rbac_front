<template>
  <div>
    <div style="display: flex;justify-content: flex-end;align-items: center">
      部门:
      <el-select style="margin-left: 10px;margin-right: 10px" @change="initSalaryTables" v-model="searchValue.depId" clearable placeholder="选择部门">
        <el-option v-for="item in allDeps"
                   :label="item.name"
                   :value="item.id"
                   :key="item.id">
        </el-option>
      </el-select>
      月份:
      <el-date-picker
          style="margin-left: 10px"
          v-model="searchValue.localDate"
          @change="initSalaryTables"
          type="month"
          placeholder="选择月">
      </el-date-picker>
      <el-button style="margin-left: 10px" type="success" icon="el-icon-refresh"
                 @click="initSalaryTables"></el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="salaryTables"
          stripe
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="employee.name"
            label="姓名"
            width="100">
        </el-table-column>
        <el-table-column
            prop="employee.workId"
            label="工号"
            width="120">
        </el-table-column>
        <el-table-column
            prop="employee.department.name"
            label="所属部门"
            width="120">
        </el-table-column>
        <el-table-column
            prop="employee.position.name"
            label="职位"
            width="120">
        </el-table-column>
        <el-table-column
            prop="salary"
            label="工资账套"
            width="200">
          <template slot-scope="scope">
            <el-tooltip placement="right" v-if="scope.row.salary">
              <div slot="content">
                <table>
                  <tr>
                    <td>基本工资</td>
                    <td>{{scope.row.salary.basicSalary}}
                    </td>
                  </tr>
                  <tr>
                    <td>交通补助</td>
                    <td>{{scope.row.salary.trafficSalary}}
                    </td>
                  </tr>
                  <tr>
                    <td>午餐补助</td>
                    <td>{{scope.row.salary.lunchSalary}}
                    </td>
                  </tr>
                  <tr>
                    <td>养老金比率</td>
                    <td>{{scope.row.salary.pensionPer}}</td>
                  </tr>
                  <tr>
                    <td>养老金基数</td>
                    <td>{{scope.row.salary.pensionBase}}
                    </td>
                  </tr>
                  <tr>
                    <td>医疗保险比率</td>
                    <td>{{scope.row.salary.medicalPer}}</td>
                  </tr>
                  <tr>
                    <td>医疗保险基数</td>
                    <td>{{scope.row.salary.medicalBase}}
                    </td>
                  </tr>
                  <tr>
                    <td>公积金比率</td>
                    <td>
                      {{scope.row.salary.accumulationFundPer}}
                    </td>
                  </tr>
                  <tr>
                    <td>公积金基数</td>
                    <td>
                      {{scope.row.salary.accumulationFundBase}}
                    </td>
                  </tr>
                </table>
              </div>
              <el-tag>{{scope.row.salary.name}}</el-tag>
            </el-tooltip>
            <el-tag v-else>暂未设置</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="date"
            label="账单月份"
            width="150">
        </el-table-column>
        <el-table-column
            prop="bonus"
            label="奖金"
            width="100">
          <template slot-scope="scope">
            {{scope.row.bonus | toFixed}}
          </template>
        </el-table-column>
        <el-table-column
            prop="allSalary"
            label="应发工资"
            width="150">
          <template slot-scope="scope">
            {{scope.row.allSalary | toFixed}}
          </template>
        </el-table-column>
        <el-table-column
            prop="allSalary"
            label="实发工资"
            width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.enabled">{{scope.row.allSalary | toFixed}}</span>
            <span v-else>暂未发放</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end;margin-top: 10px">
        <el-pagination
            background
            layout="sizes, prev, pager, next, jumper, ->, slot, total"
            @size-change="sizeChange"
            @current-change="currentChange"
            :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalSearch",
  data() {
    return {
      allDeps: [],
      salaryTables: [],
      searchValue: {
        depId: null,
        localDate: null
      },
      currentPage: 1,
      size: 10,
      total: 0,
      currentSalaryTables: []
    }
  },
  mounted() {
    this.initAllDeps();
    this.initSalaryTables();
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.initSalaryTables();
    },
    sizeChange(val) {
      this.size = val;
      this.initSalaryTables();
    },
    initSalaryTables() {
      let url = '/salary/search/list?currentPage='+this.currentPage+"&size="+this.size;
      if(this.searchValue.depId) {
        url += "&depId="+this.searchValue.depId;
      }
      if(this.searchValue.localDate) {
        let year = this.searchValue.localDate.getFullYear();
        let month = this.searchValue.localDate.getMonth() + 1;
        if(month > 0 && month < 10) {
          month = "0" + month;
        }
        url += "&localDate=" + year + "-" + month;
      }
      this.$getRequest(url).then(res=>{
        this.salaryTables = res.data;
        this.total = res.total;
      })
    },
    initAllDeps() {
      this.$getRequest('/salary/search/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    }
  },
  filters: {
    toFixed (value) {
      return value.toFixed(2)
    }
  }
}
</script>

<style scoped>
::v-deep .el-descriptions {
  margin-left: 2%;
  width: 96%;
  margin-top: 5px;
}
</style>
