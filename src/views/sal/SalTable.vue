<template>
  <div>
    <div style="display: flex;justify-content: flex-end;align-items: center">
      <el-select @change="initSalaryTables" v-model="searchValue.depId" clearable placeholder="选择部门">
        <el-option v-for="item in allDeps"
                   :label="item.name"
                   :value="item.id"
                   :key="item.id">
        </el-option>
      </el-select>
      <el-button style="margin-left: 10px;" type="success" icon="el-icon-refresh"
                 @click="initSalaryTables"></el-button>
    </div>
    <div>
      <el-table
          :data="salaryTables"
          stripe
          style="width: 100%;margin-top: 10px;">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="employee.workId"
            label="工号"
            fixed
            width="120">
        </el-table-column>
        <el-table-column
            prop="employee.name"
            label="姓名"
            width="100">
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
            prop="salary.basicSalary"
            label="基本工资"
            width="100">
        </el-table-column>
        <el-table-column
            prop="salary.trafficSalary"
            label="交通补助"
            width="100">
        </el-table-column>
        <el-table-column
            prop="salary.lunchSalary"
            label="午餐补助"
            width="100">
        </el-table-column>
        <el-table-column
            align="center"
            label="养老金">
          <el-table-column
              prop="salary.pensionPer"
              label="比率"
              width="70">
            <template slot-scope="scope">
              <span>{{scope.row.salary.pensionPer | toFixed}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="salary.pensionBase"
              label="基数"
              width="70">
          </el-table-column>
        </el-table-column>
        <el-table-column
            align="center"
            label="医疗保险">
          <el-table-column
              prop="salary.medicalPer"
              label="比率"
              width="70">
            <template slot-scope="scope">
              <span>{{scope.row.salary.medicalPer | toFixed}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="salary.medicalBase"
              label="基数"
              width="70">
          </el-table-column>
        </el-table-column>
        <el-table-column
            align="center"
            label="公积金">
          <el-table-column
              prop="salary.accumulationFundPer"
              label="比率"
              width="70">
            <template slot-scope="scope">
              <span>{{scope.row.salary.accumulationFundPer | toFixed}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="salary.accumulationFundBase"
              label="基数"
              width="70">
          </el-table-column>
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
            prop="attendanceDeduction"
            label="考勤扣款"
            width="100">
          <template slot-scope="scope">
            {{scope.row.attendanceDeduction | toFixed}}
          </template>
        </el-table-column>
        <el-table-column
            prop="leaveDeduction"
            label="请假扣款"
            width="100">
          <template slot-scope="scope">
            {{scope.row.leaveDeduction | toFixed}}
          </template>
        </el-table-column>
        <el-table-column
            prop="date"
            label="账单月份"
            width="150">
        </el-table-column>
        <el-table-column
            prop="allSalary"
            label="应发工资"
            width="120">
          <template slot-scope="scope">
            {{scope.row.allSalary | toFixed}}
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
  name: "SalTable",
  data() {
    return {
      allDeps: [],
      salaryTables: [],
      searchValue: {
        depId: null
      },
      currentPage: 1,
      size: 10,
      total: 0,
      currentSalaryTables: [],
      currentSalary: null,
      salaries: []
    }
  },
  mounted() {
    this.initAllDeps();
    this.initSalaryTables();
    this.initSalaries();
  },
  methods: {
    hidePop(data) {
      if (!data.salary || this.currentSalary && this.currentSalary !== data.salary.id)
      {
        this.$putRequest('/salary/table/?employeeId=' + data.employee.id + '&salaryId=' + this.currentSalary).then(res => {
          if (res) {
            this.initSalaryTables();
          }
        })
      }
    },
    showPop(data) {
      if (data) {
        this.currentSalary = data.id;
      } else {
        this.currentSalary = null;
      }
    },
    currentChange(val) {
      this.currentPage = val;
      this.initSalaryTables();
    },
    sizeChange(val) {
      this.size = val;
      this.initSalaryTables();
    },
    initSalaryTables() {
      let url = '/salary/table/?currentPage='+this.currentPage+"&size="+this.size;
      if(this.searchValue.depId) {
        url += "&depId="+this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        this.salaryTables = res.data;
        this.total = res.total;
      })
    },
    initAllDeps() {
      this.$getRequest('/salary/table/department').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    },
    initSalaries() {
      this.$getRequest('/salary/table/salary').then(res=>{
        if(res) {
          this.salaries = res;
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
</style>
