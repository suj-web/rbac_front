<template>
  <div>
    <div>
      <transition name="slide-fade">
        <el-card v-show="showSearchView">
          <el-row>
            <el-col :span="6">
              员工姓名:
              <el-input clearable v-model="searchValue.name" size="small" placeholder="员工姓名" style="width: 200px"></el-input>
            </el-col>
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
              奖惩月份:
              <el-date-picker
                  v-model="searchValue.localDate"
                  type="month"
                  placeholder="选择月">
              </el-date-picker>
            </el-col>
            <el-col :span="6">
              <el-button size="mini" type="primary" icon="el-icon-search" round @click="initEmpAppraises">搜索</el-button>
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
            <el-button style="padding: 6px 8px" type="primary" icon="el-icon-plus" @click="showAddView">添加</el-button>
            <el-button style="padding: 6px 8px" type="danger" icon="el-icon-delete" :disabled="this.multipleSelection.length===0" @click="deleteMany">批量删除</el-button>
          </div>
          <el-button-group>
            <el-tooltip effect="dark" content="隐藏/显示搜索" placement="top" popper-class="apprPopper">
              <el-button class="group_button" icon="fa fa-search" @click="showSearchView = !showSearchView"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top" popper-class="apprPopper">
              <el-button class="group_button" icon="el-icon-refresh" @click="initEmpAppraises"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="列" placement="top" popper-class="apprPopper">
              <el-popover
                  placement="bottom"
                  trigger="click"
                  popper-class="appr-popover"
                  :width="100">
                <div>
                  <el-checkbox v-model="showField.workId">工号</el-checkbox>
                  <el-checkbox v-model="showField.name">员工姓名</el-checkbox>
                  <el-checkbox v-model="showField.depName">所属部门</el-checkbox>
                  <el-checkbox v-model="showField.appContent">考评内容</el-checkbox>
                  <el-checkbox v-model="showField.appDate">考评时间</el-checkbox>
                  <el-checkbox v-model="showField.appResult">考评得分</el-checkbox>
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
            :data="empAppraises"
            stripe
            style="width: 100%;margin-top: 10px"
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="employee.name"
              label="姓名"
              v-if="showField.name"
              width="100">
          </el-table-column>
          <el-table-column
              prop="employee.workId"
              label="工号"
              v-if="showField.workId"
              width="120">
          </el-table-column>
          <el-table-column
              prop="employee.department.name"
              label="所属部门"
              v-if="showField.depName"
              width="120">
          </el-table-column>
          <el-table-column
              prop="appContent"
              label="考评内容"
              v-if="showField.appContent"
              width="200">
          </el-table-column>
          <el-table-column
              prop="appResult"
              label="考评得分"
              v-if="showField.appResult"
              width="100">
          </el-table-column>
          <el-table-column
              prop="appDate"
              label="考评日期"
              v-if="showField.appDate"
              width="100">
          </el-table-column>
          <el-table-column
              property="remark"
              label="备注"
              v-if="showField.remark"
              :show-overflow-tooltip="true"
              width="200">
            <template slot-scope="scope">
              <span v-if="''!==scope.row.remark && null !==scope.row.remark">{{scope.row.remark}}</span>
              <span v-else>暂无</span>
            </template>
          </el-table-column>
          <el-table-column
              v-if="showField.showOperation"
              label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="showEditView(scope.row)">
                <i class="el-icon-edit">编辑</i>
              </el-button>
              <el-button type="text" size="mini" @click="deleteAppraise(scope.row.id)">
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
        <el-form :rules="rules" ref="appraiseForm" :model="appraiseForm" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工姓名" prop="employee.name">
                <el-input clearable style="width: 240px;" v-model="appraiseForm.employee.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工号" prop="employee.workId">
                <el-input clearable style="width: 240px;" v-model="appraiseForm.employee.workId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="考评日期" prop="appDate">
                <el-date-picker
                    style="width: 240px"
                    v-model="appraiseForm.appDate"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="考评内容" prop="appContent">
                <el-input clearable style="width: 240px;" v-model="appraiseForm.appContent"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="考评得分" prop="appResult">
                <el-input clearable min="0" max="100" style="width: 240px;" v-model="appraiseForm.appResult"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <mavon-editor v-if="appraiseForm.id" :key="appraiseForm.id" v-model="appraiseForm.remark"/>
                <mavon-editor v-else v-model="appraiseForm.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doAddOrUpdate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "PerAppr",
  data() {
    return {
      showSearchView: true,
      searchValue: {
        name: '',
        localDate: null,
        depId: null
      },
      allDeps: [],
      empAppraises: [],
      size: 10,
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      showField: {
        name: true,
        workId: true,
        depName: true,
        appContent: true,
        appResult: true,
        appDate: true,
        remark: true,
        showOperation: true
      },
      title: '',
      appraiseForm: {
        id: null,
        employee: {
          name: '',
          workId: '',
        },
        appDate: null,
        appContent: '',
        appResult: null,
        remark: ''
      },
      dialogVisible: false,
      rules: {
        'employee.name': [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
        'employee.workId': [{required: true, message: '请输入工号', trigger: 'blur'}],
        appDate: [{required: true, message: '请输入考评日期', trigger: 'blur'}],
        appContent: [{required: true, message: '请输入考评内容', trigger: 'blur'}],
        appResult: [{required: true, message: '请输入考评得分', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.initAllDeps();
    this.initEmpAppraises();
  },
  methods: {
    doAddOrUpdate() {
      if(this.appraiseForm.id) {
        this.$refs['appraiseForm'].validate(valid=>{
          if(valid) {
            this.$putRequest('/personnel/appraise/',this.appraiseForm).then(res=>{
              if(res) {
                this.initEmpAppraises();
                this.dialogVisible = false;
              }
            })
          }
        })
      } else {
        this.$refs['appraiseForm'].validate(valid=>{
          if(valid) {
            this.$postRequest('/personnel/appraise/',this.appraiseForm).then(res=>{
              if(res) {
                this.initEmpAppraises();
                this.dialogVisible = false;
              }
            })
          }
        })
      }
    },
    showEditView(data) {
      if(!this.$store.getters.checkPermissionFlag('PerApprEdit')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.title = '编辑员工考评信息';
      Object.assign(this.appraiseForm,data);
      this.appraiseForm.employee.name = data.employee.name;
      this.appraiseForm.employee.workId = data.employee.workId;
      this.dialogVisible = true;
    },
    showAddView() {
      if(!this.$store.getters.checkPermissionFlag('PerApprAdd')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.title = '添加员工考评信息';
      this.appraiseForm = {
        id: null,
        employee: {
          name: '',
          workId: '',
        },
        appDate: null,
        appContent: '',
        appResult: null,
        remark: ''
      };
      this.dialogVisible = true;
    },
    deleteMany() {
      if(!this.$store.getters.checkPermissionFlag('PerApprDeleteMany')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条奖惩记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item=>{
          ids += 'ids=' + item.id + '&';
        });
        this.$deleteRequest('/personnel/appraise/' + ids).then(res => {
          if (res) {
            this.initEmpAppraises();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteAppraise(id) {
      if(!this.$store.getters.checkPermissionFlag('PerApprDelete')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$confirm('此操作将永久删除【' + id + '】奖惩记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteRequest('/personnel/appraise/' + id).then(res => {
          if (res) {
            this.initEmpAppraises();
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
    sizeChange(val) {
      this.size = val;
      this.initEmpEcs();
    },
    currentChange(val) {
      this.currentPage = val;
      this.initEmpEcs();
    },
    resetSearchValue() {
      this.searchValue = {
        name: '',
        localDate: null,
        depId: null
      }
    },
    initEmpAppraises(){
      let url = '/personnel/appraise/?currentPage=' + this.currentPage + '&size=' + this.size;
      if(this.searchValue.name) {
        url += '&name=' + this.searchValue.name;
      }
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
          this.empAppraises = res.data;
          this.total = res.total;
        }
      })
    },
    initAllDeps() {
      this.$getRequest('/personnel/appraise/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    }
  }
}
</script>
<style>
.apprPopper.el-tooltip__popper {
  background: #6c6c6c;
  padding: 3px 6px;
  height: 15px;
  line-height: 15px;
}
.apprPopper.el-tooltip__popper.is-dark {
  background: #6c6c6c;
}
.apprPopper.el-tooltip__popper[x-placement^="top"] .popper__arrow:after, .apprPopper.el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #6c6c6c;
  opacity: 1;
}
.el-popover.appr-popover{
  min-width: 100px;
}
</style>
<style scoped>
.el-col .el-input,.el-select{
  margin-left: 10px;
}
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

::v-deep .el-button-group .el-button {
  padding: 6px 12px;
  height: 30px;
  width: 46px;
}
.group_button {
  padding: 6px 12px;
  height: 34px;
  width: 46px;
}
</style>
