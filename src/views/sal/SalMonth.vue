<template>
  <div>
    <div style="display: flex;justify-content: space-between;align-items: center">
      <div>
        <el-button type="success" icon="fa fa-lock" :icon="lockIcon" :disabled="multipleSelection.length===0"  @click="doLock">&nbsp;锁定账单</el-button>
        <el-button type="warning" icon="fa fa-unlock" :icon="unLockIcon" :disabled="multipleSelection.length===0" @click="doUnLock">&nbsp;解锁账单</el-button>
        <el-button type="primary" @click="exportSalaryTable" icon="fa fa-download">&nbsp;导出账单</el-button>
      </div>
      <div>
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
    </div>
    <div>
      <el-table
          :data="salaryTables"
          stripe
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          @selection-change="handleSelectionChange"
          style="width: 100%;margin-top: 10px;">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            sortable
            fixed
            width="80">
        </el-table-column>
        <el-table-column
            prop="employee.workId"
            label="工号"
            fixed
            width="100">
        </el-table-column>
        <el-table-column
            prop="employee.name"
            label="姓名"
            fixed
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
            width="120">
        </el-table-column>
        <el-table-column
            prop="bonus"
            label="奖金"
            width="120">
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
            prop="enabled"
            label="状态"
            fixed="right"
            width="120">
          <template slot-scope="scope">
            <el-tag size="mini" type="success" v-if="scope.row.enabled">未锁定</el-tag>
            <el-tag size="mini" type="danger" v-else>已锁定</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="是否发放">
          <template slot-scope="scope">
            <div v-if="!scope.row.status">
              <el-button type="text" size="mini" @click="updateSalTable(scope.row)">
                <i class="el-icon-edit">发放工资</i>
              </el-button>
            </div>
            <span v-else>
              <el-tag type="warning" size="mini">已发放</el-tag>
            </span>
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
  name: "SalMonth",
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
      settleAccount: false,
      multipleSelection: [],
      lockIcon: '',
      unLockIcon: '',
      loading: false
    }
  },
  mounted() {
    this.initAllDeps();
    this.initSalaryTables();
  },
  methods: {
    updateSalTable(data) {
      if(!this.$store.getters.checkPermissionFlag('SalMonthPay')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      if(!data.enabled) {
        let salTab = {};
        Object.assign(salTab, data);
        salTab.date = null;
        this.$putRequest('/salary/month/',salTab).then(res=>{
          if(res) {
            this.initSalaryTables();
          }
        })
      } else {
        this.$message.warning('账单未锁定');
      }
    },
    exportSalaryTable(){
      if(!this.$store.getters.checkPermissionFlag('SalMonthExport')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$downloadRequest('/salary/month/export');
    },
    doUnLock() {
      if(!this.$store.getters.checkPermissionFlag('SalMonthUnLock')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.unLockIcon = 'el-icon-loading';
      let ids = '?';
      this.multipleSelection.forEach(item=>{
        ids += 'ids=' + item.id + '&';
      });
      this.$putRequest('/salary/month/unlock' + ids).then(res => {
        this.unLockIcon = '';
        if (res) {
          this.initSalaryTables();
        }
      })
    },
    doLock() {
      if(!this.$store.getters.checkPermissionFlag('SalMonthLock')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.lockIcon = 'el-icon-loading';
      let ids = '?';
      this.multipleSelection.forEach(item=>{
        ids += 'ids=' + item.id + '&';
      });
      this.$putRequest('/salary/month/lock' + ids).then(res => {
        this.lockIcon = '';
        if (res) {
          this.initSalaryTables();
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.loading = true;
      let url = '/salary/month/?currentPage='+this.currentPage+"&size="+this.size;
      if(this.searchValue.depId) {
        url += "&depId="+this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        this.loading = false;
        if(res) {
          this.salaryTables = res.data;
          this.total = res.total;
        }
      })
    },
    initAllDeps() {
      this.$getRequest('/salary/month/department').then(res=>{
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

</style>
