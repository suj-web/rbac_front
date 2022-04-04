<template>
  <div>
    <div style="display: flex;justify-content: space-between;align-items: center">
      <div>
        <el-upload action="/salary/attendance/import"
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
            @change="initAttendanceRecords"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
        <el-button style="margin-left: 10px;" icon="fa fa-plus" type="primary">&nbsp;新增</el-button>
      </div>
    </div>
    <div>
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
            property="employee.workId"
            label="工号"
            width="120">
        </el-table-column>
        <el-table-column
            property="employee.name"
            label="姓名"
            width="120">
        </el-table-column>
        <el-table-column
            property="employee.department.name"
            label="所属部门"
            width="120">
        </el-table-column>
        <el-table-column
            property="employee.position.name"
            label="职位"
            width="120">
        </el-table-column>
        <el-table-column
            property="punchInTime"
            label="上班打卡时间"
            width="180">
        </el-table-column>
        <el-table-column
            property="punchOutTime"
            label="下班打卡时间"
            width="180">
        </el-table-column>
        <el-table-column
            property="personalLeave"
            label="事假(天)"
            width="100">
        </el-table-column>
        <el-table-column
            property="sickLeave"
            label="病假(天)"
            width="100">
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
      </el-table>
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
      multipleSelection: []
    }
  },
  mounted() {
    this.initAllDeps();
    this.initAttendanceRecords();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onSuccess(){
      this.importDataBtnIcon = 'fa fa-upload';
      this.importDataBtnText = '导入数据';
      this.importDataDisabled = false;
      this.initAttendanceRecords();
    },
    onError(){
      this.importDataBtnIcon = 'fa fa-upload';
      this.importDataBtnText = '导入数据';
      this.importDataDisabled = false;
    },
    beforeUpload(){
      this.importDataBtnIcon = 'el-icon-loading';
      this.importDataBtnText = '正在导入';
      this.importDataDisabled = true;
    },
    exportAttendanceRecord(){
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
        let day = (dateScope[1].getTime() - dateScope[0].getTime()) / 24 / 60 / 60 /1000;
        if(day > 31) {
          this.$message.error("请搜索31天内的数据");
          return;
        }
        if(dateScope[1].getTime() > new Date().getTime()){
          this.$message.error("结束日期不能超过今天");
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
