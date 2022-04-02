<template>
  <div>
    <el-card style="width: 98%;margin: 1% 1%" class="page-component__scroll">
      <div style="margin-bottom: 20px">
        <div style="display:flex;justify-content: space-between">
          <div>
            时间&nbsp;
            <el-date-picker
                v-model="searchValue.localDate"
                @change="initAdjustSalaryRecords"
                style="margin-right: 20px"
                type="month"
                placeholder="选择月份">
            </el-date-picker>
            部门&nbsp;
            <el-select @change="initAdjustSalaryRecords" v-model="searchValue.depId" clearable placeholder="选择部门">
              <el-option v-for="item in allDeps"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </div>
          <el-button-group>
            <el-tooltip effect="dark" content="显示列表视图" placement="top">
              <el-button size="small" icon="fa fa-list" @click="showListView = !showListView"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-button style="height: 34px" size="small" icon="el-icon-refresh" @click="initAdjustSalaryRecords"></el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
      <div v-if="!showListView">
        <el-table
            :data="adjustSalaryRecords"
            border
            style="width: 100%">
          <el-table-column
              type="index"
              label="序号"
              width="80">
          </el-table-column>
          <el-table-column
              property="employee.workId"
              label="工号"
              width="140">
          </el-table-column>
          <el-table-column
              property="employee.name"
              label="姓名"
              width="140">
          </el-table-column>
          <el-table-column
              property="employee.department.name"
              label="部门"
              width="140">
          </el-table-column>
          <el-table-column
              property="beforeSalary"
              label="调前薪资"
              width="140">
          </el-table-column>
          <el-table-column
              property="afterSalary"
              label="调后薪资"
              width="140">
          </el-table-column>
          <el-table-column
              property="reason"
              label="调薪原因"
              width="250">
          </el-table-column>
          <el-table-column
              property="asDate"
              label="调薪日期">
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
      </div>
      <div v-else>
        <el-scrollbar class="adjust-score-scrollbar">
          <el-descriptions border size="default" class="margin-top" :column="4" v-for="(item, index) in adjustSalaryRecords" :key="index">
            <el-descriptions-item>
              <template slot="label">
                <i class="fa fa-id-card-o"></i>
                工号
              </template>
              {{item.employee.workId}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                姓名
              </template>
              {{item.employee.name}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="fa fa-users"></i>
                部门
              </template>
              {{item.employee.department.name}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="fa fa-jpy"></i>
                调前薪资
              </template>
              {{item.beforeSalary}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="fa fa-jpy"></i>
                调后薪资
              </template>
              {{item.afterSalary}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-tickets"></i>
                备注
              </template>
              {{item.remark}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                调薪日期
              </template>
              {{item.asDate}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                调薪原因
              </template>
              {{item.reason}}
            </el-descriptions-item>
          </el-descriptions>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AdjustSalary",
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
      searchValue: {
        localDate: null,
        depId: null,
      },
      adjustSalaryRecords: [],
      total: 0,
      currentPage: 1,
      size: 10,
      showListView: false
    }
  },
  watch: {
    allDeps(val) {
      if(val) {
        this.initAdjustSalaryRecords();
      }
    }
  },
  mounted() {
    this.initAdjustSalaryRecords();
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.initAdjustSalaryRecords();
    },
    sizeChange(val) {
      this.size = val;
      this.initAdjustSalaryRecords();
    },
    initAdjustSalaryRecords() {
      let url = '/statistics/record/salary/adjust?currentPage='+this.currentPage+"&size="+this.size;
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
          this.adjustSalaryRecords = res.data;
          this.total = res.total;
        }
      })
    }
  }
}
</script>

<style scoped>
  .margin-top {
    margin-top: 20px;
  }
  .adjust-score-scrollbar {
    height: calc(390px);
  }
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .page-component__scroll {
    overflow-y: hidden;
  }
</style>
