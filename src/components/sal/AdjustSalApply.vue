<template>
  <div>
    <div style="width: 98%;margin: 1% 1%">
      <transition name="slide-fade">
        <el-card v-show="showSearchView">
          <el-row>
            <el-col :span="6">
              所属部门:
              <el-select v-model="searchValue.depId" clearable placeholder="选择部门">
                <el-option v-for="item in allDeps"
                           :label="item.name"
                           :value="item.id"
                           :key="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              时间:
              <el-date-picker
                  v-model="searchValue.localDate"
                  type="month"
                  placeholder="选择月份">
              </el-date-picker>
            </el-col>
            <el-col :span="6">
              <el-button size="mini" type="primary" icon="el-icon-search" round @click="initAdjustSalarys">搜索</el-button>
              <el-button size="mini" type="warning" icon="el-icon-refresh" round @click="resetSearchValue">重置</el-button>
            </el-col>
          </el-row>
        </el-card>
      </transition>
    </div>
    <div style="width: 98%;margin: 1% 1%;">
      <el-card style="margin-top: 10px">
        <div style="display: flex;justify-content: flex-end;">
          <el-button-group>
            <el-tooltip effect="dark" content="隐藏/显示搜索" placement="top" popper-class="my-popper">
              <el-button class="group_button" icon="fa fa-search" @click="showSearchView = !showSearchView"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top" popper-class="my-popper">
              <el-button class="group_button" icon="el-icon-refresh" @click="initAdjustSalarys"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="列" placement="top" popper-class="my-popper">
              <el-popover
                  placement="bottom"
                  trigger="click"
                  popper-class="my-popover"
                  width="100">
                <div>
                  <el-checkbox v-model="showField.name">员工姓名</el-checkbox>
                  <el-checkbox v-model="showField.workId">工号</el-checkbox>
                  <el-checkbox v-model="showField.depName">所属部门</el-checkbox>
                  <el-checkbox v-model="showField.beforeSalary">调前工资账套</el-checkbox>
                  <el-checkbox v-model="showField.beforeComputeSalary">调前工资</el-checkbox>
                  <el-checkbox v-model="showField.afterSalary">申请工资账套</el-checkbox>
                  <el-checkbox v-model="showField.afterComputeSalary">申请工资</el-checkbox>
                  <el-checkbox v-model="showField.asDate">调薪日期</el-checkbox>
                  <el-checkbox v-model="showField.reason">原因</el-checkbox>
                  <el-checkbox v-model="showField.remark">备注</el-checkbox>
                  <el-checkbox v-model="showField.isAdjust">状态</el-checkbox>
                  <el-checkbox v-model="showField.showOperation">操作</el-checkbox>
                </div>
                <el-button slot="reference" class="group_button" style="border-top-left-radius: 0;border-bottom-left-radius: 0;" icon="fa fa-th">
                  <i class="fa fa-caret-down" aria-hidden="true" style="margin-left: 5px"></i>
                </el-button>
              </el-popover>
            </el-tooltip>
          </el-button-group>
        </div>
        <el-table
            :data="adjustSalarys"
            stripe
            style="width: 100%;margin-top: 10px"
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              property="employee.workId"
              label="工号"
              v-if="showField.workId"
              fixed
              width="100">
          </el-table-column>
          <el-table-column
              property="employee.name"
              label="姓名"
              v-if="showField.name"
              width="80">
          </el-table-column>
          <el-table-column
              property="employee.department.name"
              label="部门"
              v-if="showField.depName"
              width="100">
          </el-table-column>
          <el-table-column
              property="beforeSalary"
              label="调前工资账套"
              v-if="showField.beforeSalary"
              width="140">
            <template slot-scope="scope">
              <el-tooltip placement="right">
                <div slot="content">
                  <table>
                    <tr>
                      <td>基本工资</td>
                      <td>{{scope.row.beforeSalary.basicSalary}}
                      </td>
                    </tr>
                    <tr>
                      <td>交通补助</td>
                      <td>{{scope.row.beforeSalary.trafficSalary}}
                      </td>
                    </tr>
                    <tr>
                      <td>午餐补助</td>
                      <td>{{scope.row.beforeSalary.lunchSalary}}
                      </td>
                    </tr>
                    <tr>
                      <td>养老金比率</td>
                      <td>{{scope.row.beforeSalary.pensionPer}}</td>
                    </tr>
                    <tr>
                      <td>养老金基数</td>
                      <td>{{scope.row.beforeSalary.pensionBase}}
                      </td>
                    </tr>
                    <tr>
                      <td>医疗保险比率</td>
                      <td>{{scope.row.beforeSalary.medicalPer}}</td>
                    </tr>
                    <tr>
                      <td>医疗保险基数</td>
                      <td>{{scope.row.beforeSalary.medicalBase}}
                      </td>
                    </tr>
                    <tr>
                      <td>公积金比率</td>
                      <td>
                        {{scope.row.beforeSalary.accumulationFundPer}}
                      </td>
                    </tr>
                    <tr>
                      <td>公积金基数</td>
                      <td>
                        {{scope.row.beforeSalary.accumulationFundBase}}
                      </td>
                    </tr>
                  </table>
                </div>
                <el-tag>{{scope.row.beforeSalary.name}}</el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
              label="调前薪资"
              v-if="showField.beforeComputeSalary"
              width="100">
            <template slot-scope="scope">
              <span>{{scope.row.beforeSalary | computeSalary}}</span>
            </template>
          </el-table-column>
          <el-table-column
              property="afterSalary"
              label="申请工资账套"
              v-if="showField.afterSalary"
              width="140">
            <template slot-scope="scope">
              <el-tooltip placement="right">
                <div slot="content">
                  <table>
                    <tr>
                      <td>基本工资</td>
                      <td>{{scope.row.afterSalary.basicSalary}}
                      </td>
                    </tr>
                    <tr>
                      <td>交通补助</td>
                      <td>{{scope.row.afterSalary.trafficSalary}}
                      </td>
                    </tr>
                    <tr>
                      <td>午餐补助</td>
                      <td>{{scope.row.afterSalary.lunchSalary}}
                      </td>
                    </tr>
                    <tr>
                      <td>养老金比率</td>
                      <td>{{scope.row.afterSalary.pensionPer}}</td>
                    </tr>
                    <tr>
                      <td>养老金基数</td>
                      <td>{{scope.row.afterSalary.pensionBase}}
                      </td>
                    </tr>
                    <tr>
                      <td>医疗保险比率</td>
                      <td>{{scope.row.afterSalary.medicalPer}}</td>
                    </tr>
                    <tr>
                      <td>医疗保险基数</td>
                      <td>{{scope.row.afterSalary.medicalBase}}
                      </td>
                    </tr>
                    <tr>
                      <td>公积金比率</td>
                      <td>
                        {{scope.row.afterSalary.accumulationFundPer}}
                      </td>
                    </tr>
                    <tr>
                      <td>公积金基数</td>
                      <td>
                        {{scope.row.afterSalary.accumulationFundBase}}
                      </td>
                    </tr>
                  </table>
                </div>
                <el-tag>{{scope.row.afterSalary.name}}</el-tag>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
              label="申请薪资"
              v-if="showField.afterComputeSalary"
              width="100">
            <template slot-scope="scope">
              <span>{{scope.row.afterSalary | computeSalary}}</span>
            </template>
          </el-table-column>
          <el-table-column
              property="asDate"
              width="100"
              v-if="showField.asDate"
              label="调薪日期">
          </el-table-column>
          <el-table-column
              property="reason"
              label="调薪原因"
              v-if="showField.reason"
              show-overflow-tooltip
              width="100">
          </el-table-column>
          <el-table-column
              property="remark"
              label="备注"
              v-if="showField.remark"
              show-overflow-tooltip
              width="100">
            <template slot-scope="scope">
              <span v-if="''!==scope.row.remark && null !==scope.row.remark">{{scope.row.remark}}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="isAdjust"
              label="状态"
              width="100">
            <template slot-scope="scope">
              <el-tag v-if="!scope.row.isAdjust" size="mini" type="warning">待调薪</el-tag>
              <el-tag v-else size="mini" type="primary">已调薪</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              v-if="showField.showOperation"
              width="120"
              fixed="right"
              label="操作">
            <template slot-scope="scope">
              <!--              <el-link :underline="false" type="danger" @click="deleteAdjustSalary(scope.row.id)" icon="fa fa-remove" style="padding: 4px 5px">&nbsp;删除</el-link>-->
              <!--              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAdjustSalary(scope.row.id)">删除</el-button>-->
              <div v-if="scope.row.status===0">
                <el-button type="text" size="mini" @click="updateAdjustSal(scope.row, 1)">
                  <i class="el-icon-edit">批准</i>
                </el-button>
                <el-button type="text" size="mini" @click="updateAdjustSal(scope.row, 2)">
                  <i class="el-icon-delete">驳回</i>
                </el-button>
              </div>
              <div v-else>
                <el-tag size="mini" type="success" v-if="scope.row.status===1">已通过</el-tag>
                <el-tag size="mini" type="danger" v-else-if="scope.row.status===2">未通过</el-tag>
              </div>
            </template>
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
export default {
  name: "AdjustSalApply",
  data() {
    return {
      allDeps: [],
      allSals: [],
      searchValue: {
        depId: null,
        localDate: null
      },
      currentPage: 1,
      size: 10,
      total: 0,
      adjustSalarys: [],
      showSearchView: true,
      showField: {
        name: true,
        workId: true,
        depName: true,
        beforeSalary: true,
        beforeComputeSalary: true,
        afterSalary: true,
        afterComputeSalary: true,
        asDate: true,
        reason: true,
        remark: true,
        isAdjust: true,
        showOperation: true
      }
    }
  },
  mounted() {
    this.initAllDeps();
    this.initAdjustSalarys();
    this.initAllSals();
  },
  methods: {
    updateAdjustSal(data, status) {
      data.status = status;
      this.$putRequest('/personnel/salary/',data).then(res=>{
        if(res) {
          this.initAdjustSalarys();
        }
      })
    },
    currentChange(val) {
      this.currentPage = val;
      this.initAdjustSalarys();
    },
    sizeChange(val){
      this.size = val;
      this.initAdjustSalarys();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    resetSearchValue() {
      this.searchValue = {
        depId: null,
        localDate: null
      };
      this.initAdjustSalarys();
    },
    initAdjustSalarys() {
      let url = '/personnel/salary/?currentPage='+this.currentPage+"&size="+this.size;
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
          this.adjustSalarys = res.data;
          this.total = res.total;
        }
      })
    },
    initAllDeps() {
      this.$getRequest('/personnel/salary/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    },
    initAllSals() {
      this.$getRequest('/personnel/salary/salary/list').then(res=>{
        if(res) {
          this.allSals = res;
        }
      })
    }
  },
  filters: {
    computeSalary(data) {
      let salary = data.basicSalary + data.lunchSalary + data.trafficSalary
          + data.pensionBase * data.pensionPer
          + data.medicalBase * data.medicalPer
          + data.accumulationFundBase * data.accumulationFundPer;
      return salary.toFixed(2);
    }
  }
}
</script>

<style scoped>
/*.el-col .el-input,.el-select{*/
/*  margin-left: 10px;*/
/*}*/
.el-card__body .el-row {
  margin-top: 10px;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.group_button {
  padding: 6px 12px;
  height: 34px;
  width: 46px;
}
.el-select {
  margin-left: -1px;
}
</style>
