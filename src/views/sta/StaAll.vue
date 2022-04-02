<template>
  <div class="all-container">
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <span>部门人员占比</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-more"></el-button>
          </div>
<!--          <pie v-bind:data="depNumber" :key="1"></pie>-->
          <PieBar :data="depNumber" :key="1"></PieBar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <span>职位人员占比</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-more"></el-button>
          </div>
<!--          <pie :data="posNumber" :key="2"></pie>-->
          <PieBar :data="posNumber" :key="2"></PieBar>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <span>部门平均薪资统计</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-more"></el-button>
          </div>
          <bar :data="depSalary" :key="3"></bar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <span>职位平均薪资统计</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-more"></el-button>
          </div>
          <bar :data="posSalary" :key="4"></bar>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card" style="height: 700px">
          <div slot="header">
            <span>考评得分排名</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-more"></el-button>
          </div>
          <div>
            <div style="display: flex;justify-content: space-between;align-items: center">
              <div>
                时间&nbsp;
                <el-date-picker
                    v-model="scoreSearchValue.localDate"
                    @change="initScoreData"
                    type="month"
                    placeholder="选择月份">
                </el-date-picker>
              </div>
              <div>
                部门&nbsp;
                <el-select @change="initScoreData" v-model="scoreSearchValue.depId" clearable placeholder="选择部门">
                  <el-option v-for="item in allDeps"
                             :label="item.name"
                             :value="item.id"
                             :key="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <el-table
                :data="scoreData"
                size="mini"
                style="width: 100%;margin-top: 10px">
              <el-table-column
                  type="index"
                  width="50"
                  label="序号">
              </el-table-column>
              <el-table-column
                  property="employee.workId"
                  label="工号"
                  width="120">
              </el-table-column>
              <el-table-column
                  property="employee.name"
                  label="姓名"
                  width="80">
              </el-table-column>
              <el-table-column
                  property="employee.department.name"
                  label="部门"
                  width="100">
              </el-table-column>
              <el-table-column
                  property="appDate"
                  label="考评月份"
                  :formatter="dateFormat"
                  width="80">
              </el-table-column>
              <el-table-column
                  property="appResult"
                  label="考评得分"
                  sortable>
              </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end;margin-top: 10px">
              <el-pagination
                  background
                  @current-change="scoreCurrentChange"
                  @size-change="scoreSizeChange"
                  layout="sizes, prev, pager, next, jumper, ->, total"
                  :total="scoreTotal">
              </el-pagination>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" style="height: 700px">
          <div slot="header">
            <span>考勤信息统计</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-more"></el-button>
          </div>
          <div>
            <div style="display: flex;justify-content: space-between;align-items: center;flex-wrap: wrap">
              <div>
                时间&nbsp;
                <el-date-picker
                    v-model="attendanceSearchValue.localDate"
                    @change="initAttendanceData"
                    type="month"
                    placeholder="选择月份">
                </el-date-picker>
              </div>
              <div>
                出勤状况
                <el-select @change="initAttendanceData" v-model="attendanceSearchValue.absenteeism" clearable placeholder="请选择">
                  <el-option v-for="item in absenteeismStatus"
                             :label="item.name"
                             :value="item.value"
                             :key="item.value">
                  </el-option>
                </el-select>
              </div>
              <div style="margin-top: 10px">
                部门&nbsp;
                <el-select style="width: 220px" @change="initAttendanceData" v-model="attendanceSearchValue.depId" clearable placeholder="选择部门">
                  <el-option v-for="item in allDeps"
                             :label="item.name"
                             :value="item.id"
                             :key="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
            <el-table
                :data="attendanceData"
                size="mini"
                style="width: 100%;margin-top: 10px">
              <el-table-column
                  property="employee.workId"
                  label="工号"
                  fixed
                  width="120">
              </el-table-column>
              <el-table-column
                  property="employee.name"
                  label="姓名"
                  width="80">
              </el-table-column>
              <el-table-column
                  property="employee.department.name"
                  label="部门"
                  width="100">
              </el-table-column>
              <el-table-column
                  property="employee.position.name"
                  label="职位"
                  width="100">
              </el-table-column>
              <el-table-column
                  property="absenteeism"
                  label="是否出勤"
                  width="100">
                <template slot-scope="scope">
                  <el-tag size="mini" type="success" v-if="!scope.row.absenteeism">出勤</el-tag>
                  <el-tag size="mini" type="danger" v-else>缺勤</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                  property="attendanceTime"
                  label="上班时间"
                  width="200">
              </el-table-column>
              <el-table-column
                  property="closingTime"
                  label="下班时间"
                  width="200">
              </el-table-column>
            </el-table>
            <div style="display: flex;justify-content: flex-end;margin-top: 10px">
              <el-pagination
                  background
                  @current-change="attendanceCurrentChange"
                  @size-change="attendanceSizeChange"
                  layout="sizes, prev, pager, next, jumper, ->, total"
                  :total="attendanceTotal">
              </el-pagination>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import pie from "../../components/chart/pie";
import bar from "../../components/chart/bar";
import PieBar from "../../components/chart/PieBar";
export default {
  name: "StaAll",
  components: {pie, bar, PieBar},
  data() {
    return {
      depNumber: [],
      posNumber: [],
      depSalary: {},
      posSalary: {},
      allDeps: {},
      scoreSearchValue: {
        localDate: null,
        depId: null
      },
      scoreCurrentPage: 1,
      scoreSize: 10,
      scoreTotal: 0,
      scoreData: [],
      attendanceSearchValue: {
        localDate: null,
        depId: null,
        absenteeism: null
      },
      attendanceCurrentPage: 1,
      attendanceSize: 10,
      attendanceTotal: 0,
      attendanceData: [],
      absenteeismStatus: [
        {
          name: '出勤',
          value: false
        },
        {
          name: '缺勤',
          value: true
        }
      ]
    }
  },
  mounted() {
    this.initDepNumber();
    this.initPosNumber();
    this.initDepSalary();
    this.initPosSalary();
    this.initAllDeps();
    this.initScoreData();
    this.initAttendanceData();
  },
  methods: {
    attendanceCurrentChange(val) {
      this.attendanceCurrentPage = val;
      this.initAttendanceData();
    },
    attendanceSizeChange(val) {
      this.attendanceSize = val;
      this.initAttendanceData();
    },
    scoreSizeChange(val) {
      this.scoreSize = val;
      this.initScoreData();
    },
    scoreCurrentChange(val) {
      this.scoreCurrentPage = val;
      this.initScoreData();
    },
    initAttendanceData() {
      let url = '/statistics/all/attendance/list?currentPage='+this.attendanceCurrentPage+"&size="+this.attendanceSize;
      if(this.attendanceSearchValue.localDate) {
        let year = this.attendanceSearchValue.localDate.getFullYear();
        let month = this.attendanceSearchValue.localDate.getMonth() + 1;
        if(month > 0 && month < 10) {
          month = "0" + month;
        }
        url += "&localDate=" + year + "-" + month;
      }
      if(this.attendanceSearchValue.depId) {
        url += "&depId=" + this.attendanceSearchValue.depId;
      }
      if(this.attendanceSearchValue.absenteeism) {
        url += "&absenteeism=" + this.attendanceSearchValue.absenteeism;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.attendanceTotal = res.total;
          this.attendanceData = res.data;
        }
      })
    },
    initScoreData() {
      let url = '/statistics/all/appraise/rank?currentPage='+this.scoreCurrentPage+"&size="+this.scoreSize;
      if(this.scoreSearchValue.localDate) {
        let year = this.scoreSearchValue.localDate.getFullYear();
        let month = this.scoreSearchValue.localDate.getMonth() + 1;
        if(month > 0 && month < 10) {
          month = "0" + month;
        }
        url += "&localDate=" + year + "-" + month;
      }
      if(this.scoreSearchValue.depId) {
        url += "&depId=" + this.scoreSearchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.scoreTotal = res.total;
          this.scoreData = res.data;
        }
      })
    },
    dateFormat(row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM");
    },
    initAllDeps() {
      this.$getRequest('/statistics/all/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    },
    initPosSalary() {
      this.$getRequest("/statistics/all/salary/position").then(res=>{
        if(res) {
          this.posSalary = res;
        }
      })
    },
    initDepSalary() {
      this.$getRequest('/statistics/all/salary/department').then(res=>{
        if(res) {
          this.depSalary = res;
        }
      })
    },
    initPosNumber() {
      this.$getRequest('/statistics/all/position/number').then(res=>{
        if(res) {
          this.posNumber = res;
        }
      })
    },
    initDepNumber() {
      this.$getRequest('/statistics/all/department/number').then(res=>{
        if(res) {
          this.depNumber = res;
        }
      })
    }
  }
}
</script>

<style scoped>
  .all-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    overflow-y: hidden;
  }
  .box-card {
    width: 600px;
    height: 400px;
    margin: 10px;
  }
</style>
