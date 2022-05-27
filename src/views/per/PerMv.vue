<template>
  <div>
    <div>
      <transition name="slide-fade">
        <el-card v-show="showSearchView">
          <el-row>
            <el-col :span="6">
              调前部门:
              <el-select v-model="searchValue.beforeDepartmentId" clearable placeholder="选择部门">
                <el-option v-for="item in allDeps"
                           :label="item.name"
                           :value="item.id"
                           :key="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              调后部门:
              <el-select v-model="searchValue.afterDepartmentId" clearable placeholder="选择部门">
                <el-option v-for="item in allDeps"
                           :label="item.name"
                           :value="item.id"
                           :key="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              调前职位:
              <el-select v-model="searchValue.beforePositionId" clearable placeholder="选择职位">
                <el-option v-for="item in allPositions"
                           :label="item.name"
                           :value="item.id"
                           :key="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              调后职位:
              <el-select v-model="searchValue.afterPositionId" clearable placeholder="选择职位">
                <el-option v-for="item in allPositions"
                           :label="item.name"
                           :value="item.id"
                           :key="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-col :span="6">
              时间:
              <el-date-picker
                  v-model="searchValue.localDate"
                  type="month"
                  placeholder="选择月份">
              </el-date-picker>
            </el-col>
            <el-col :span="6">
              <el-button size="mini" type="primary" icon="el-icon-search" round @click="initEmpRemoves">搜索</el-button>
              <el-button size="mini" type="warning" icon="el-icon-refresh" round @click="resetSearchValue">重置</el-button>
            </el-col>
          </el-row>
        </el-card>
      </transition>
    </div>
    <div>
      <el-card style="margin-top: 10px">
        <div style="display: flex;justify-content: space-between;">
          <div>
            <el-button style="padding: 6px 8px" type="primary" icon="el-icon-plus" @click="showAddView">员工调动</el-button>
            <el-button style="padding: 6px 8px" type="danger" icon="el-icon-delete" :disabled="this.multipleSelection.length===0" @click="deleteMany">批量删除</el-button>
          </div>
          <el-button-group>
            <el-tooltip effect="dark" content="隐藏/显示搜索" placement="top" popper-class="my-popper">
              <el-button class="group_button" icon="fa fa-search" @click="showSearchView = !showSearchView"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top" popper-class="my-popper">
              <el-button class="group_button" icon="el-icon-refresh" @click="initEmpRemoves"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="列" placement="top" popper-class="my-popper">
              <el-popover
                  placement="bottom"
                  trigger="click"
                  popper-class="my-popover"
                  :width="100">
                <div>
                  <el-checkbox v-model="showField.name">员工姓名</el-checkbox>
                  <el-checkbox v-model="showField.workId">工号</el-checkbox>
                  <el-checkbox v-model="showField.beforeDepartment">调前部门</el-checkbox>
                  <el-checkbox v-model="showField.afterDepartment">调后部门</el-checkbox>
                  <el-checkbox v-model="showField.beforePosition">调前职位</el-checkbox>
                  <el-checkbox v-model="showField.afterPosition">调后职位</el-checkbox>
                  <el-checkbox v-model="showField.removeDate">调动日期</el-checkbox>
                  <el-checkbox v-model="showField.reason">原因</el-checkbox>
                  <el-checkbox v-model="showField.remark">备注</el-checkbox>
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
            :data="empRemoves"
            stripe
            style="width: 100%;margin-top: 10px"
            @selection-change="handleSelectionChange">
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
              property="employee.workId"
              label="工号"
              v-if="showField.workId"
              width="100">
          </el-table-column>
          <el-table-column
              property="employee.name"
              label="姓名"
              v-if="showField.name"
              width="80">
          </el-table-column>
          <el-table-column
              property="beforeDepartment.name"
              label="调前部门"
              v-if="showField.beforeDepartment"
              width="120">
          </el-table-column>
          <el-table-column
              property="afterDepartment.name"
              label="调后部门"
              v-if="showField.afterDepartment"
              width="120">
          </el-table-column>
          <el-table-column
              property="beforePosition.name"
              label="调前职位"
              v-if="showField.beforePosition"
              width="120">
          </el-table-column>
          <el-table-column
              property="afterPosition.name"
              label="调后职位"
              v-if="showField.afterPosition"
              width="120">
          </el-table-column>
          <el-table-column
              property="removeDate"
              width="100"
              v-if="showField.removeDate"
              label="调薪日期">
          </el-table-column>
          <el-table-column
              property="reason"
              label="调动原因"
              v-if="showField.reason"
              show-overflow-tooltip
              width="150">
          </el-table-column>
          <el-table-column
              property="remark"
              label="备注"
              v-if="showField.remark"
              show-overflow-tooltip
              width="150">
            <template slot-scope="scope">
              <span v-if="''!==scope.row.remark && null !==scope.row.remark">{{scope.row.remark}}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column
              v-if="showField.showOperation"
              label="操作">
            <template slot-scope="scope">
              <!--              <el-link :underline="false" type="danger" @click="deleteAdjustSalary(scope.row.id)" icon="fa fa-remove" style="padding: 4px 5px">&nbsp;删除</el-link>-->
              <el-button type="text" size="mini" @click="deleteEmpRemove(scope.row.id)">
                <i class="el-icon-delete">删除</i>
              </el-button>
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
      <el-dialog
          style="border-radius: 15%"
          :title="title"
          width="60%"
          :visible.sync="dialogVisible">
        <el-form :rules="rules" ref="empRemoveForm" :model="empRemoveForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="employee.workId">
                <el-input clearable @blur="getEmpByWorkId" @keydown.enter.native="getEmpByWorkId" placeholder="请输入员工工号" style="width: 240px;" v-model="empRemoveForm.employee.workId">
                  <el-button slot="append" icon="el-icon-search" @click="getEmpByWorkId"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="员工姓名" prop="employee.name">
                <el-input clearable style="width: 240px;" v-model="empRemoveForm.employee.name" placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="调动部门" prop="afterDepartmentId">
                <el-select style="width: 240px;" v-model="empRemoveForm.afterDepartmentId" clearable placeholder="选择部门">
                  <el-option v-for="item in allDeps"
                             :label="item.name"
                             :value="item.id"
                             :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调动职位">
                <el-select style="width: 240px;" v-model="empRemoveForm.afterPositionId" clearable placeholder="选择职位">
                  <el-option v-for="item in allPositions"
                             :label="item.name"
                             :value="item.id"
                             :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="调动日期" prop="removeDate">
                <el-date-picker
                    style="width: 240px;"
                    v-model="empRemoveForm.removeDate"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调动原因">
                <el-input clearable style="width: 240px;" v-model="empRemoveForm.reason" placeholder="请输入调动原因"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <!--                <mavon-editor v-if="trainForm.id" :key="trainForm.id" v-model="trainForm.remark"/>-->
                <mavon-editor v-model="empRemoveForm.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doAdd">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "PerMv",
  data() {
    return {
      allDeps: [],
      allPositions: [],
      empRemoves: [],
      showSearchView: true,
      searchValue: {
        beforeDepartmentId: null,
        afterDepartmentId: null,
        beforePositionId: null,
        afterPositionId: null,
        localDate: null
      },
      empRemoveRecords: [],
      total: 0,
      currentPage: 1,
      size: 10,
      multipleSelection: [],
      showField: {
        name: true,
        workId: true,
        beforeDepartment: true,
        afterDepartment: true,
        beforePosition: true,
        afterPosition: true,
        removeDate: true,
        reason: true,
        remark: true,
        showOperation: true
      },
      title: '',
      dialogVisible: false,
      empRemoveForm: {
        employee: {
          name: '',
          workId: ''
        },
        afterDepartmentId: null,
        afterPositionId: null,
        removeDate: null,
        reason: '',
        remark: ''
      },
      beforeRemoveDepId: null,
      beforeRemovePosId: null,
      rules: {
        'employee.name': [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
        'employee.workId': [{required: true, message: '请输入工号', trigger: 'blur'}],
        afterDepartmentId: [{required: true, message: '请选择调动部门', trigger: 'blur'}],
        removeDate: [{required: true, message: '请输入调动日期', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.initEmpRemoves();
    this.initAllDeps();
    this.initAllPositions();
  },
  methods: {
    doAdd() {
      this.$refs['empRemoveForm'].validate(valid=>{
        if(valid) {
          if(this.beforeRemoveDepId != this.empRemoveForm.afterDepartmentId) {
            this.empRemoveForm.beforeDepartmentId = this.beforeRemoveDepId;
            this.empRemoveForm.beforePositionId = this.beforeRemovePosId;
            this.$postRequest('/personnel/remove/', this.empRemoveForm).then(res => {
              if (res) {
                this.initEmpRemoves();
                this.dialogVisible = false;
                this.beforeRemovePosId = null;
                this.beforeRemoveDepId = null;
              }
            })
          } else {
            this.$message.warning('调动部门未修改');
          }
        }
      })
    },
    showAddView() {
      if(!this.$store.getters.checkPermissionFlag('PerMvRemove')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.title = '员工调动';
      this.adjustSalaryForm = {
        employee: {
          name: '',
          workId: ''
        },
        afterSalaryId: null,
        asDate: null,
        reason: '',
        remark: ''
      }
      this.dialogVisible = true;
    },
    getEmpByWorkId() {
      if(this.empRemoveForm.employee.workId) {
        this.$getRequest('/personnel/remove/employee?workId='+this.empRemoveForm.employee.workId).then(res => {
          if (res) {
            this.empRemoveForm.employee.name = res.name;
            this.empRemoveForm.afterDepartmentId = res.departmentId;
            this.empRemoveForm.afterPositionId = res.positionId;
            this.beforeRemoveDepId = res.departmentId;
            this.beforeRemovePosId = res.positionId;
          } else {
            this.empRemoveForm.employee.name = '';
            this.empRemoveForm.afterDepartmentId = null;
            this.empRemoveForm.afterPositionId = null;
          }
        })
      }
    },
    deleteMany() {
      if(!this.$store.getters.checkPermissionFlag('PerMvDeleteMany')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条调薪记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item=>{
          ids += 'ids=' + item.id + '&';
        });
        this.$deleteRequest('/personnel/remove/' + ids).then(res => {
          if (res) {
            this.initEmpRemoves();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteEmpRemove(id) {
      if(!this.$store.getters.checkPermissionFlag('PerMvDelete')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$confirm('此操作将永久删除【' + id + '】调薪记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteRequest('/personnel/remove/' + id).then(res => {
          if (res) {
            this.initEmpRemoves();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
      this.searchValue =  {
        beforeDepartmentId: null,
            afterDepartmentId: null,
            beforePositionId: null,
            afterPositionId: null,
            localDate: null
      };
      this.initEmpRemoves();
    },
    initEmpRemoves() {
      let url = '/personnel/remove/?currentPage='+this.currentPage+"&size="+this.size;
      if(this.searchValue.localDate) {
        let year = this.searchValue.localDate.getFullYear();
        let month = this.searchValue.localDate.getMonth() + 1;
        if(month > 0 && month < 10) {
          month = "0" + month;
        }
        url += "&localDate=" + year + "-" + month;
      }
      if(this.searchValue.beforeDepartmentId) {
        url += "&beforeDepartmentId=" + this.searchValue.beforeDepartmentId;
      }
      if(this.searchValue.afterDepartmentId) {
        url += "&afterDepartmentId=" + this.searchValue.afterDepartmentId;
      }
      if(this.searchValue.beforePositionId) {
        url += "&beforePositionId=" + this.searchValue.beforePositionId;
      }
      if(this.searchValue.afterPositionId) {
        url += "&afterPositionId=" + this.searchValue.afterPositionId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.empRemoves = res.data;
          this.total = res.total;
        }
      })
    },
    initAllDeps() {
      this.$getRequest('/personnel/remove/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    },
    initAllPositions() {
      this.$getRequest('/personnel/remove/position/list').then(res=>{
        if(res) {
          this.allPositions = res;
        }
      })
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
</style>
