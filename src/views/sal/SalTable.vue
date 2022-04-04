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
            label="操作">
          <template slot-scope="scope">
            <el-popover
                placement="left"
                @show="showPop(scope.row.salary)"
                @hide="hidePop(scope.row)"
                title="编辑工资账套"
                width="200"
                trigger="click">
              <div>
                <el-select v-model="currentSalary" placeholder="请选择" size="mini">
                  <el-option
                      v-for="item in salaries"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-edit">修改工资账套</el-button>
            </el-popover>
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
