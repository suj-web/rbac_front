<template>
  <div>
    <div style="display: flex;justify-content: space-between;align-items: center">
      <div>
        <el-upload action="/api/salary/attendance/import"
                   :headers="headers"
                   :show-file-list="false"
                   :before-upload="beforeUpload"
                   :on-success="onSuccess"
                   :on-error="onError"
                   :disabled="importDataDisabled"
                   style="display: inline-flex;margin-right: 10px">
          <el-button type="success" :icon="importDataBtnIcon" :disabled="importDataDisabled">
            {{importDataBtnText}}
          </el-button>
        </el-upload>
        <el-button type="primary" @click="exportAttendanceRecord" icon="fa fa-download">&nbsp;导出数据</el-button>
        <el-button size="small" type="danger" :disabled="this.multipleSelection.length===0" icon="fa fa-trash" @click="deleteMany">&nbsp;批量删除</el-button>
      </div>
      <div>
        <el-select @change="initAttendanceRecords" v-model="searchValue.depId" clearable placeholder="选择部门">
          <el-option v-for="item in allDeps"
                     :label="item.name"
                     :value="item.id"
                     :key="item.id">
          </el-option>
        </el-select>
        <el-date-picker
            style="margin-left: 10px;"
            v-model="searchValue.beginDateScope"
            type="daterange"
            value-format="yyyy-MM-dd"
            @change="initAttendanceRecords"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
        <el-button style="margin-left: 10px;" icon="fa fa-plus" type="primary" @click="showAddView">&nbsp;新增</el-button>
      </div>
    </div>
    <div style="margin-top: 10px;">
      <el-table
          :data="attendanceRecords"
          border
          @selection-change="handleSelectionChange"
          style="width: 100%">
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
            property="employee.workId"
            label="工号"
            width="120">
        </el-table-column>
        <el-table-column
            property="employee.name"
            label="姓名"
            width="100">
        </el-table-column>
        <el-table-column
            property="employee.department.name"
            label="所属部门"
            width="100">
        </el-table-column>
        <el-table-column
            property="employee.position.name"
            label="职位"
            width="120">
        </el-table-column>
        <el-table-column
            property="punchInTime"
            label="上班打卡时间"
            width="150">
        </el-table-column>
        <el-table-column
            property="punchOutTime"
            label="下班打卡时间"
            width="150">
        </el-table-column>
        <el-table-column
            property="personalLeave"
            label="事假"
            width="100">
          <template slot-scope="scope">
            <el-tag type="primary" size="mini" v-if="!scope.row.personalLeave">未请假</el-tag>
            <el-tag type="danger" size="mini" v-else>请假</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            property="sickLeave"
            label="病假"
            width="100">
          <template slot-scope="scope">
            <el-tag type="primary" size="mini" v-if="!scope.row.sickLeave">未请假</el-tag>
            <el-tag type="danger" size="mini" v-else>请假</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            property="absenteeism"
            label="状态"
            width="100">
          <template slot-scope="scope">
            <el-tag type="success" size="mini" v-if="!scope.row.absenteeism">正常</el-tag>
            <el-tag type="danger" size="mini" v-else>缺勤</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary" @click="showEditView(scope.row)">编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="deleteAttendance(scope.row)">删除</el-button>
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
    </div>
    <div>
      <el-dialog
          :title="title"
          :visible.sync="dialogVisible"
          width="40%">
        <div>
          <el-form ref="attendanceForm" :model="attendance">
            <el-row>
              <el-col :span="12">
                <el-form-item label="姓名:">
                  <el-input clearable v-model="attendance.employee.name" prefix-icon="el-icon-edit" placeholder="请输入员工姓名" style="width: 200px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工号:">
                  <el-input clearable v-model="attendance.employee.workId" prefix-icon="el-icon-edit" placeholder="请输入工号" style="width: 200px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="签到打卡时间">
                  <el-date-picker
                      v-model="attendance.punchInTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      size="mini"
                      style="width: 150px"
                      placeholder="签到打卡时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签退打卡时间:">
                  <el-date-picker
                      v-model="attendance.punchOutTime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      size="mini"
                      style="width: 150px"
                      placeholder="签退打卡时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否事假:">
                  <el-switch
                      v-model="attendance.personalLeave"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否病假:">
                  <el-switch
                      v-model="attendance.sickLeave"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="是否缺勤:">
                  <el-switch
                      v-model="attendance.absenteeism"
                      active-color="#13ce66"
                      inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addAttendance">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalAtt",
  data() {
    return {
      allDeps: [],
      searchValue: {
        depId: null,
        beginDateScope: null
      },
      attendanceRecords: [],
      currentPage: 1,
      size: 10,
      total: 0,
      headers:{
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      importDataDisabled: false,
      importDataBtnText: '导入数据',
      importDataBtnIcon: 'fa fa-upload',
      multipleSelection: [],
      dialogVisible: false,
      title: '',
      attendance: {
        id: null,
        employee: {
          workId: '',
          name: '',
        },
        punchInTime: null,
        punchOutTime: null,
        personalLeave: false,
        sickLeave: false,
        absenteeism: false
      }
    }
  },
  mounted() {
    this.initAllDeps();
    this.initAttendanceRecords();
  },
  methods: {
    showEditView(data) {
      if(!this.$store.getters.checkPermissionFlag('SalAttEdit')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.title = '编辑打卡信息';
      Object.assign(this.attendance, data);
      this.attendance.employee.workId = data.employee.workId;
      this.attendance.employee.name = data.employee.name;
      this.dialogVisible = !this.dialogVisible;
    },
    addAttendance() {
      if(this.attendance.id) {
        if (this.attendance.employee.workId && this.attendance.employee.name) {
          this.$putRequest('/salary/attendance/', this.attendance).then(res => {
            if (res) {
              this.initAttendanceRecords();
              this.dialogVisible = !this.dialogVisible;
            }
          })
        } else {
          this.$message.error("姓名和工号不能为空");
        }
      } else {
        if (this.attendance.employee.workId && this.attendance.employee.name) {
          this.$postRequest('/salary/attendance/', this.attendance).then(res => {
            if (res) {
              this.initAttendanceRecords();
              this.dialogVisible = !this.dialogVisible;
            }
          })
        } else {
          this.$message.error("姓名和工号不能为空");
        }
      }
    },
    showAddView() {
      if(!this.$store.getters.checkPermissionFlag('SalAttAdd')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.title = "添加打卡信息";
      this.attendance = {
        id: null,
        employee: {
          workId: '',
          name: '',
        },
        punchInTime: null,
        punchOutTime: null,
        personalLeave: false,
        sickLeave: false,
        absenteeism: false
      };
      this.dialogVisible = !this.dialogVisible;
    },
    deleteAttendance(data) {
      if(!this.$store.getters.checkPermissionFlag('SalAttDelete')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$confirm('此操作将彻底删除该条打卡记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteRequest('/salary/attendance/' + data.id).then(res => {
          if (res) {
            this.initAttendanceRecords();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteMany() {
      if(!this.$store.getters.checkPermissionFlag('SalAttDeleteMany')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条打卡记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item=>{
          ids += 'ids=' + item.id + '&';
        });
        this.$deleteRequest('/salary/attendance/' + ids).then(res => {
          if (res) {
            this.initAttendanceRecords();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    sizeChange(size){
      this.size = size;
      this.initAttendanceRecords();
    },
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.initAttendanceRecords();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onSuccess(){
      this.$notify({
        message: '导入成功',
        type: 'success'
      });
      this.importDataBtnIcon = 'fa fa-upload';
      this.importDataBtnText = '导入数据';
      this.importDataDisabled = false;
      this.initAttendanceRecords();
    },
    onError(){
      this.$notify({
        message: '导入失败',
        type: 'error'
      });
      this.importDataBtnIcon = 'fa fa-upload';
      this.importDataBtnText = '导入数据';
      this.importDataDisabled = false;
    },
    beforeUpload(){
      if(!this.$store.getters.checkPermissionFlag('SalAttUpload')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.importDataBtnIcon = 'el-icon-loading';
      this.importDataBtnText = '正在导入';
      this.importDataDisabled = true;
    },
    exportAttendanceRecord(){
      if(!this.$store.getters.checkPermissionFlag('SalAttExport')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      let url = '/salary/attendance/export';
      if(this.searchValue.beginDateScope) {
        url += '?dateScope=' + this.searchValue.beginDateScope;
      }
      this.$downloadRequest(url);
    },
    initAttendanceRecords() {
      let url = '/salary/attendance/list?currentPage='+this.currentPage+'&size='+this.size;
      if(this.searchValue.depId) {
        url += '&depId=' + this.searchValue.depId;
      }
      if(this.searchValue.beginDateScope) {
        let dateScope = this.searchValue.beginDateScope;
        let day = (new Date(dateScope[1]).getTime() - new Date(dateScope[0]).getTime()) / 24 / 60 / 60 /1000;
        if(day > 31) {
          this.$message.error("请搜索31天内的数据");
          return;
        }
        url += '&beginDateScope=' + this.searchValue.beginDateScope;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.attendanceRecords = res.data;
          this.total = res.total;
        }
      })
    },
    initAllDeps() {
      this.$getRequest('/salary/attendance/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
