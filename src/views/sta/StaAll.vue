<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本数据统计" name="first">
        <div class="data-container">
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
        </div>
      </el-tab-pane>
      <el-tab-pane label="考评得分统计" name="second">
        <div class="data-container">
          <bar :data="averageScore" :change="true" :name="'平均得分'"></bar>
          <el-row style="width: 50%;">
            <el-col :span="24">
              <div>
                <div style="display: flex;justify-content: flex-end;align-items: center">
                  <div style="margin-right: 20px;">
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
                    style="width: 100%;margin-top: 10px">
                  <el-table-column
                      type="index"
                      width="60"
                      label="序号">
                  </el-table-column>
                  <el-table-column
                      property="employee.workId"
                      label="工号"
                      width="100">
                  </el-table-column>
                  <el-table-column
                      property="employee.name"
                      label="姓名"
                      width="100">
                  </el-table-column>
                  <el-table-column
                      property="employee.department.name"
                      label="部门"
                      width="120">
                  </el-table-column>
                  <el-table-column
                      property="appDate"
                      label="考评月份"
                      :formatter="dateFormat"
                      width="120">
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
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="考勤信息统计" name="third">
        <div class="data-container">
          <el-row style="width: 94%">
            <div>
              <div style="display: flex;justify-content: flex-end;align-items: center;flex-wrap: wrap">
                <div>
                  时间&nbsp;
                  <el-date-picker
                      style="margin-right: 20px"
                      value-format="yyyy-MM-dd"
                      v-model="attendanceSearchValue.localDate"
                      @change="initAttendanceData"
                      type="month"
                      placeholder="选择月份">
                  </el-date-picker>
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
                  style="width: 100%;margin-top: 10px">
                <el-table-column
                    property="workId"
                    label="工号"
                    fixed
                    width="120">
                </el-table-column>
                <el-table-column
                    property="name"
                    label="姓名"
                    width="120">
                </el-table-column>
                <el-table-column
                    property="depName"
                    label="所属部门"
                    width="120">
                </el-table-column>
                <el-table-column
                    property="posName"
                    label="职位"
                    width="150">
                </el-table-column>
                <el-table-column
                    property="workAttendanceTime"
                    label="签到打卡时间"
                    :formatter="dateTimeFormat"
                    width="180">
                </el-table-column>
                <el-table-column
                    property="offDutyAttendanceTime"
                    label="签退打卡时间"
                    :formatter="dateTimeFormat"
                    width="180">
                </el-table-column>
                <el-table-column
                    property="personalLeave"
                    label="事假(天)"
                    width="100">
                  <template></template>
                </el-table-column>
                <el-table-column
                    property="sickLeave"
                    label="病假(天)"
                    width="100">
                </el-table-column>
                <el-table-column
                    property="requiredAttendanceHours"
                    label="应出勤小时数"
                    width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.requiredAttendanceHours | toFixed}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                    property="actualAttendanceHours"
                    label="实出勤小时数"
                    width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.actualAttendanceHours | toFixed}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                    property="lateTimes"
                    label="迟到次数"
                    width="100">
                </el-table-column>
                <el-table-column
                    property="lateMinutes"
                    label="迟到分钟数"
                    width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.lateMinutes | toFixed}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                    property="leaveEarlyTimes"
                    label="早退次数"
                    width="100">
                </el-table-column>
                <el-table-column
                    property="leaveEarlyMinutes"
                    label="早退分钟数"
                    width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.leaveEarlyMinutes | toFixed}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                    property="absenteeismTimes"
                    label="缺勤次数"
                    width="100">
                </el-table-column>
                <el-table-column
                    property="absenteeismHours"
                    label="缺勤小时数"
                    width="100">
                  <template slot-scope="scope">
                    <span>{{scope.row.absenteeismHours | toFixed}}</span>
                  </template>
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
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
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
      depSalary: [],
      posSalary: [],
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
        depId: null
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
      ],
      activeName: 'first',
      averageScore: []
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
    this.initAverageScore();
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
    initAverageScore() {
      this.$getRequest('/statistics/all/appraise/average/score').then(res=>{
        if(res) {
          this.averageScore = res;
        }
      })
    },
    initAttendanceData() {
      let url = '/statistics/all/attendance/list?currentPage='+this.attendanceCurrentPage+"&size="+this.attendanceSize;
      if(this.attendanceSearchValue.localDate) {
        url += "&localDate=" + this.attendanceSearchValue.localDate;
      }
      if(this.attendanceSearchValue.depId) {
        url += "&depId=" + this.attendanceSearchValue.depId;
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
    dateTimeFormat(row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
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
  },
  filters: {
    toFixed(value) {
      return value.toFixed(1);
    }
  }
}
</script>

<style scoped>
  .data-container {
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
