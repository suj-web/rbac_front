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
          <el-select style="width: 200px;" v-model="searchValue.depId" clearable placeholder="选择部门">
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
              style="width: 200px;"
              placeholder="选择月">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button size="mini" type="primary" icon="el-icon-search" round @click="initEmpEcs">搜索</el-button>
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
            <el-button style="padding: 6px 8px" type="primary" icon="el-icon-plus" @click="showAddView">新增</el-button>
            <el-button style="padding: 6px 8px" type="danger" icon="el-icon-delete" :disabled="this.multipleSelection.length===0" @click="deleteMany">批量删除</el-button>
          </div>
          <el-button-group>
            <el-tooltip effect="dark" content="隐藏/显示搜索" placement="top" popper-class="my-popper">
              <el-button class="group_button" icon="fa fa-search" @click="showSearchView = !showSearchView"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top" popper-class="my-popper">
              <el-button class="group_button" icon="el-icon-refresh" @click="initEmpEcs"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="列" placement="top" popper-class="my-popper">
              <el-popover
                  placement="bottom"
                  trigger="click"
                  popper-class="my-popover"
                  :width="100">
                <div>
                  <el-checkbox v-model="showField.empName">员工姓名</el-checkbox>
                  <el-checkbox v-model="showField.workId">工号</el-checkbox>
                  <el-checkbox v-model="showField.depName">所属部门</el-checkbox>
                  <el-checkbox v-model="showField.ecScore">奖惩得分</el-checkbox>
                  <el-checkbox v-model="showField.ecReason">奖惩原因</el-checkbox>
                  <el-checkbox v-model="showField.ecDate">奖惩时间</el-checkbox>
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
            :data="empEcs"
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
              width="80">
          </el-table-column>
          <el-table-column
              prop="employee.name"
              label="姓名"
              v-if="showField.empName"
              width="100"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="employee.workId"
              label="工号"
              v-if="showField.workId"
              width="100">
          </el-table-column>
          <el-table-column
              prop="employee.department.name"
              label="所属部门"
              v-if="showField.depName"
              width="120">
          </el-table-column>
          <el-table-column
              prop="ecRule.score"
              label="奖罚得分"
              v-if="showField.ecScore"
              width="80">
            <template slot-scope="scope">
              <el-tag type="success" size="mini" v-if="scope.row.ecRule.score>0">加{{scope.row.ecRule.score}}分</el-tag>
              <el-tag type="danger" size="mini" v-else>扣{{scope.row.ecRule.score | toInt}}分</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="ecDate"
              label="奖惩日期"
              v-if="showField.ecDate"
              width="100">
          </el-table-column>
          <el-table-column
              prop="ecRule.ecReason"
              label="奖罚原因"
              show-overflow-tooltip
              v-if="showField.ecReason"
              width="200">
          </el-table-column>
          <el-table-column
              prop="remark"
              label="备注"
              v-if="showField.remark"
              show-overflow-tooltip
              width="200">
          </el-table-column>
          <el-table-column
              v-if="showField.showOperation"
              label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="showEditView(scope.row)">
                <i class="el-icon-edit">编辑</i>
              </el-button>
              <el-button type="text" size="mini" @click="deleteEc(scope.row.id)">
                <i class="el-icon-delete">删除</i>
              </el-button>
<!--              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditView(scope.row)">编辑</el-button>-->
<!--              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteEc(scope.row.id)">删除</el-button>-->
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
        <el-form :rules="rules" ref="ecForm" :model="ec" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工姓名" prop="employee.name">
                <el-input clearable style="width: 240px;" v-model="ec.employee.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工号" prop="employee.workId">
                <el-input clearable style="width: 240px;" v-model="ec.employee.workId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="奖惩日期" prop="ecDate">
                <el-date-picker
                    style="width: 240px"
                    v-model="ec.ecDate"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="奖惩原因" prop="ecId">
                <el-select v-model="ec.ecId" style="width: 240px;" clearable placeholder="选择奖惩原因">
                  <el-option v-for="item in ecRules"
                             :label="item.ecReason"
                             :value="item.id"
                             :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <mavon-editor v-if="ec.id" :key="ec.id" v-model="ec.remark"/>
                <mavon-editor v-else v-model="ec.remark" />
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
  name: "PerEc",
  data() {
    return {
      showSearchView: true,
      searchValue: {
        name: '',
        localDate: null,
        depId: null
      },
      allDeps: [],
      ecRules: [],
      empEcs: [],
      size: 10,
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      showField: {
        empName: true,
        workId: true,
        depName: true,
        ecScore: true,
        ecReason: true,
        ecDate: true,
        remark: true,
        showOperation: true
      },
      title: '',
      ec: {
        id: null,
        employee: {
          name: '',
          workId: '',
        },
        ecDate: null,
        ecId: null,
        remark: ''
      },
      dialogVisible: false,
      rules: {
        'employee.name': [{required: true, message: '请输入员工姓名', trigger: 'blur'}],
        'employee.workId': [{required: true, message: '请输入工号', trigger: 'blur'}],
        ecDate: [{required: true, message: '请输入奖惩日期', trigger: 'blur'}],
        ecId: [{required: true, message: '请输入奖惩原因', trigger: 'blur'}]
      }
    }
  },
  mounted() {
    this.initDeps();
    this.initEmpEcs();
    this.initEcRules();
  },
  methods: {
    doAddOrUpdate() {
      if(this.ec.id) {
        this.$refs['ecForm'].validate(valid=>{
          if(valid) {
            this.$putRequest('/personnel/ec/',this.ec).then(res=>{
              if(res) {
                this.initEmpEcs();
                this.dialogVisible = false;
              }
            })
          }
        })
      } else {
        this.$refs['ecForm'].validate(valid=>{
          if(valid) {
            this.$postRequest('/personnel/ec/',this.ec).then(res=>{
              if(res) {
                this.initEmpEcs();
                this.dialogVisible = false;
              }
            })
          }
        })
      }
    },
    showEditView(data) {
      if(!this.$store.getters.checkPermissionFlag('PerEcEdit')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.title = '编辑员工奖惩信息';
      Object.assign(this.ec,data);
      this.ec.employee.name = data.employee.name;
      this.ec.employee.workId = data.employee.workId;
      this.dialogVisible = true;
    },
    showAddView() {
      if(!this.$store.getters.checkPermissionFlag('PerEcAdd')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.title = '添加员工奖惩信息';
      this.ec = {
        id: null,
        employee: {
          name: '',
          workId: '',
        },
        ecDate: null,
        ecId: null,
        remark: ''
      };
      this.dialogVisible = true;
    },
    deleteMany() {
      if(!this.$store.getters.checkPermissionFlag('PerEcDeleteMany')) {
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
        this.$deleteRequest('/personnel/ec/' + ids).then(res => {
          if (res) {
            this.initEmpEcs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteEc(id) {
      if(!this.$store.getters.checkPermissionFlag('PerEcDelete')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$confirm('此操作将永久删除【' + id + '】奖惩记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteRequest('/personnel/ec/' + id).then(res => {
          if (res) {
            this.initEmpEcs();
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
    normalizer(node) {
      return {
        label: node.name
      }
    },
    initEmpEcs() {
      let url = '/personnel/ec/?currentPage=' + this.currentPage + '&size=' + this.size;
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
          this.empEcs = res.data;
          this.total = res.total;
        }
      })
    },
    initEcRules() {
      this.$getRequest('/personnel/ec/ecRule/list').then(res=>{
        if(res) {
          this.ecRules = res;
        }
      })
    },
    initDeps() {
      this.$getRequest('/personnel/ec/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    }
  },
  filters: {
    toInt(data) {
      return Math.abs(data);
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
/*.el-select {*/
/*  margin-left: -1px;*/
/*}*/


</style>
