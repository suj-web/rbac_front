<template>
  <div>
    <div style="display: flex;justify-content: space-around">
      <el-card class="homeCard" shadow="always">
                  <span class="info-box-icon"
                        style="background-color: #00c0ef !important; color: white;">
						            <i class="fa fa-child" ></i>
                  </span>
        <div class="info-box-content" @click="goOnline">
          <span class="info-box-text"><el-link :underline="false" style="font-weight: bolder;font-size: 16px">在线人数</el-link></span>
          <span class="info-box-number">{{this.onlineUserCount}}</span>
        </div>
      </el-card>
      <el-card class="homeCard" shadow="always">
                  <span class="info-box-icon"
                        style="background-color: #00a65a !important; color: white;">
                    <i class="fa fa-users" aria-hidden="true"></i>
                  </span>
        <div class="info-box-content" @click="goEmp">
          <span class="info-box-text"><el-link :underline="false" style="font-weight: bolder;font-size: 16px">员工人数</el-link></span>
          <span class="info-box-number">{{this.employeeCount}}</span>
        </div>
      </el-card>
      <el-card class="homeCard" shadow="always">
                  <span class="info-box-icon" style="background-color: #f39c12 !important; color: white;">
                    <i class="fa fa-users" aria-hidden="true"></i></span>
        <div class="info-box-content" @click="goContract">
          <span class="info-box-text"><el-link :underline="false" style="font-weight: bolder;font-size: 16px">合同到期</el-link></span>
          <span class="info-box-number">{{this.contractExpireCount}}</span>
        </div>
      </el-card>
      <el-card class="homeCard" shadow="always">
                  <span class="info-box-icon"
                        style="background-color: darkmagenta !important; color: white;">
						            <i class="fa fa-volume-control-phone" ></i>
                  </span>
        <div class="info-box-content" @click="goConversion()">
          <span class="info-box-text"><el-link :underline="false" style="font-weight: bolder;font-size: 16px">转正提醒</el-link></span>
          <span class="info-box-number">{{this.conversionCount}}</span>
        </div>
      </el-card>
      <el-card class="homeCard" shadow="always">
                  <span class="info-box-icon" style="background-color: #dd4b39 !important; color: white;">
                    <i class="fa fa-birthday-cake" aria-hidden="true"></i>
                  </span>
        <div class="info-box-content" @click="goBirthday">
          <span class="info-box-text"><el-link :underline="false" style="font-weight: bolder;font-size: 16px">生日提醒</el-link></span>
          <span class="info-box-number">{{this.birthdayCount}}</span>
        </div>
      </el-card>
    </div>
    <div class="loginLog">
      <span>登录日志</span>
    </div>
    <div class="loginLogContainer">
      <el-table
          :data="loginLogs"
          stripe
          border>
        <el-table-column
            prop="sessionId"
            label="会话编号"
            show-overflow-tooltip
            width="280">
        </el-table-column>
        <el-table-column
            prop="name"
            label="登录名称"
            width="80">
        </el-table-column>
        <el-table-column
            prop="ip"
            label="登录地址"
            width="120">
        </el-table-column>
        <el-table-column
            prop="address"
            label="登录地点"
            show-overflow-tooltip
            width="120">
        </el-table-column>
        <el-table-column
            prop="browser"
            label="浏览器"
            show-overflow-tooltip
            width="180">
        </el-table-column>
        <el-table-column
            prop="os"
            label="操作系统"
            show-overflow-tooltip
            width="120">
        </el-table-column>
        <el-table-column
            label="登录状态"
            width="70">
          <template slot-scope="scope">
            <el-tag type="success" size="mini" v-if="scope.row.type">成功</el-tag>
            <el-tag type="danger" size="mini" v-else>失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="operInfo"
            label="操作信息"
            width="170">
        </el-table-column>
        <el-table-column
            prop="gmtCreate"
            label="登录时间">
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
  </div>
</template>

<script>
export default {
  name: "HomeMain",
  data() {
    return {
      loginLogs: [], //登录日志
      currentPage: 1,
      size: 10,
      total: 0,
      onlineUserCount: 0,
      employeeCount: 0,
      contractExpireCount: 0,
      birthdayCount: 0,
      conversionCount: 0
    }
  },
  // computed: {
  //   message() {
  //     return this.$store.state.message;
  //   }
  // },
  mounted() {
    this.initLoginLogs();
    this.initOnlineUserCount();
    this.initEmployeeCount();
    this.initContractExpireCount();
    this.initBirthdayCount();
    this.initConversionCount();
    // this.initCircleSysMsg();
  },
  methods: {
    goConversion() {
      if(!this.$store.getters.checkPermissionFlag('HomeConversion')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$router.push('/conversion');
    },
    goOnline() {
      if(!this.$store.getters.checkPermissionFlag('HomeOnlineUser')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$router.push('/online');
    },
    goEmp() {
      if(!this.$store.getters.checkPermissionFlag('HomeEmpCount')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$router.push('/emp/basic');
    },
    goContract() {
      if(!this.$store.getters.checkPermissionFlag('HomeContractExpired')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$router.push('/contract');
    },
    goBirthday() {
      if(!this.$store.getters.checkPermissionFlag('HomeBirthday')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      this.$router.push('/birthday');
    },
    initBirthdayCount() {
      this.$getRequest('/home/remind/birthday/remind/count').then(res=>{
        if(res) {
          this.birthdayCount = res;
        }
      })
    },
    initContractExpireCount() {
      this.$getRequest('/home/remind/contract/expire/count').then(res=>{
        if(res) {
          this.contractExpireCount = res;
        }
      })
    },
    initEmployeeCount(){
      this.$getRequest('/home/remind/employee/count').then(res=>{
        if(res) {
          this.employeeCount = res;
        }
      })
    },
    initOnlineUserCount() {
      this.$getRequest('/home/remind/online/count').then(res=>{
        if(res) {
          this.onlineUserCount = res;
        }
      })
    },
    initConversionCount() {
      this.$getRequest('/home/remind/conversion/remind/count').then(res=>{
        if(res) {
          this.conversionCount = res;
        }
      })
    },
    sizeChange(size){
      this.size = size;
      this.initLoginLogs();
    },
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.initLoginLogs();
    },
    initLoginLogs() {
      this.$getRequest('/home/remind/login/log?currentPage='+this.currentPage+"&size="+this.size).then(res=>{
        if(res) {
          this.loginLogs = res.data;
          this.total = res.total;
        }
      })
    },
    // initCircleSysMsg() {
    //   this.$getRequest('/home/remind/system/message').then(res=>{
    //     if(res) {
    //       let message = "";
    //       res.forEach(item=>{
    //         if(!item.type) {
    //           message += "&nbsp;&nbsp;&nbsp;<span style='color: red'>系统公告:</span>" + "&nbsp;&nbsp;" + item.title + "&nbsp;&nbsp;" + item.content + "&nbsp;&nbsp;&nbsp;";
    //         } else {
    //           message += "&nbsp;&nbsp;&nbsp;<span style='color: #E6A23C'>系统通知:</span>" + "&nbsp;&nbsp;" + item.title + "&nbsp;&nbsp;" + item.content + "&nbsp;&nbsp;&nbsp;";
    //         }
    //       })
    //       this.$store.commit('initCircleSysMsgs', message === "" ? "<span style='color:black'>暂无公告</span>": message);
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
.loginLog {
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px
}
.info-box-number {
  display: block;
}
.info-box-text {
  display: block;
}
.info-box-content {
  display: block;
  margin-left: 10px;
  font-weight: bold;
}
::v-deep .homeCard > .el-card__body {
  display: flex;
  align-items: center;
  padding: 0!important;
}
::v-deep .homeCard {
  margin-left: 10px;
  margin-right: 10px;
}
.info-box-icon {
  display: block;
  float: left;
  height: 80px;
  width: 80px;
  text-align: center;
  font-size: 40px;
  line-height: 80px;
  background: rgba(0, 0, 0, 0.2);
}
.homeCard {
  width: 300px;
  height: 80px;
}
</style>
