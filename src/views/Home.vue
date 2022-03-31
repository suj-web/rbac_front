<template>
  <div style="font-size: 14px!important;">
    <el-container :style="`height:${height-0.1}px`">
      <el-aside :width="isCollapse ? '66px': '200px'">
        <el-menu
            router
            unique-opened
            :collapse-transition="false"
            :default-active="active"
            :default-openeds="opened"
            :collapse="isCollapse"
            background-color="#001529"
            text-color="hsla(0,0%,100%,.7)">
          <h4 class="title">
            <span v-if="isCollapse">E</span>
            <span v-else>EIMS</span>
          </h4>
          <el-menu-item index="/home" @click="goHome">
            <i class="fa fa-home" style="margin-right: 5px"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu :index="index+''" v-for="(item,index) in routes" :key="index">
            <template slot="title">
              <i :class="item.iconCls" style="margin-right: 5px"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="children.path" v-for="(children, indexj) in item.children" :key="indexj">{{children.name}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="page-component__scroll">
        <el-header class="homeHeader">
          <div style="display: flex;align-items: center;">
            <span @click="changeCollapse" style="margin-right: 30px;font-size: 14px">
              <i class="el el-icon-s-fold" v-if="!isCollapse"></i>
              <i class="el el-icon-s-unfold" v-else></i>
            </span>
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/home' }" @click.native="goHome"><i class="el el-icon-s-home" style="margin-right: 10px"></i>首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="this.$route.path!=='/home'">{{this.$route.matched[0].name}}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="this.$route.path!=='/home'">{{this.$route.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div style="display: flex;align-items: center">
            <div class="full" @click="full" style="margin-right: 20px;font-size: 14px">
              <!-- 全屏 -->
              <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
                <span class="el el-icon-full-screen" v-show="!isFull"></span>
              </el-tooltip>
              <!-- 不是全屏 -->
              <el-tooltip class="item" effect="dark" content="退出全屏" placement="bottom">
                <span class="el el-icon-aim" v-show="isFull"></span>
              </el-tooltip>
            </div>
            <el-tooltip class="item" effect="dark" content="聊天框" placement="bottom">
              <el-button icon="el-icon-bell" type="text" size="normal"
                         style="color: black;margin-right: 20px" @click="goChat">
              </el-button>
            </el-tooltip>
            <el-dropdown trigger="hover" @command="commandHandler">
              <span class="el-dropdown-link">
                <span style="display: flex;align-items: center">
                  <i style="margin-right: 5px"><img :src="user.userFace"></i>
                  {{ user.name }}
                  <i class="fa fa-caret-down" style="margin-left: 10px;margin-right: 20px"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                <el-dropdown-item command="setting">设置</el-dropdown-item>
                <el-dropdown-item command="logout">注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-scrollbar class="scrollbar">
          <el-main>
            <notice :message="message" style="margin-bottom: 10px"></notice>
            <div v-if="this.$route.path==='/home'">
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
                      width="100">
                  </el-table-column>
                  <el-table-column
                      prop="address"
                      label="登录地点"
                      width="100">
                  </el-table-column>
                  <el-table-column
                      prop="browser"
                      label="浏览器"
                      width="180">
                  </el-table-column>
                  <el-table-column
                      prop="os"
                      label="操作系统"
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
                      width="200">
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
            <router-view/>
          </el-main>
        </el-scrollbar>
        <el-backtop
            target=".page-component__scroll .el-scrollbar__wrap"
            :bottom="100"
            :visibility-height="50"></el-backtop>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import screenfull from "screenfull";
import {getRequest} from "@/network/api";
import notice from "@/components/notice";
  export default {
    name: "Home",
    components: {
      notice
    },
    data() {
      return {
        height: document.documentElement.clientHeight,
        active: this.$route.path,//当前激活菜单
        opened: [],//当前打开的目录
        isFull: false, //是否全屏
        isCollapse: false,//是否折叠菜单
        loginLogs: [], //登录日志
        currentPage: 1,
        size: 10,
        total: 0,
        onlineUserCount: 0,
        employeeCount: 0,
        contractExpireCount: 0,
        birthdayCount: 0
      }
    },
    computed: {
      routes() {
        return this.$store.state.routes;
      },
      user() {
        return this.$store.state.currentAdmin;
      },
      message() {
        return this.$store.state.message;
      }
    },
    mounted() {
      this.getUserInfo();
      this.initHeight();
      this.initLoginLogs();
      this.initOnlineUserCount();
      this.initEmployeeCount();
      this.initContractExpireCount();
      this.initBirthdayCount();
      this.initCircleSysMsg();
    },
    methods: {
      goOnline() {
        this.$router.push('/online');
      },
      goEmp() {
        this.$router.push('/emp/basic');
      },
      goContract() {
        this.$router.push('/contract');
      },
      goBirthday() {
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
      sizeChange(size){
        this.size = size;
        this.initLoginLogs();
      },
      currentChange(currentPage){
        this.currentPage = currentPage;
        this.initLoginLogs();
      },
      goChat() {
        this.active = '';
        this.opened = [];
        this.$router.push('/chat');
      },
      commandHandler(command) {
        if (command == 'logout') {
          this.$confirm('此操作将注销登录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //注销登录
            this.$postRequest('/logout');
            //清空用户信息
            window.sessionStorage.removeItem('tokenStr');
            window.sessionStorage.removeItem('user');
            //清空菜单
            this.$store.commit('initRoutes', []);
            //跳转登录页面
            this.$router.replace('/');
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
        if (command === 'userinfo') {
          this.$router.push('/userinfo');
        }
      },
      goHome() {
        this.active = '';
        this.opened = [];
      },
      full() {
        screenfull.toggle();
        if (!screenfull.isEnabled) {
          this.$message({
            message: "该浏览器不支持全屏功能",
            type: "warning",
          });
        }
        this.isFull = !this.isFull;
      },
      changeCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      getUserInfo() {
        getRequest("/admin/info").then(res=> {
          if (res) {
            //存入用户信息
            // this.user = res;
            window.sessionStorage.setItem('user', JSON.stringify(res));
            //存入store中
            this.$store.commit('initAdmin',res);
          }
        })
      },
      initHeight() {
        window.onresize = () => {    //写在mounted中,onresize事件会在页面大小被调整时触发
          return (() => {
            window.screenHeight = document.documentElement.clientHeight;
            this.height = window.screenHeight;
          })();
        };
      },
      initLoginLogs() {
        this.$getRequest('/home/remind/login/log?currentPage='+this.currentPage+"&size="+this.size).then(res=>{
          if(res) {
            this.loginLogs = res.data;
            this.total = res.total;
          }
        })
      },
      initCircleSysMsg() {
        this.$getRequest('/system/cfg/system/message').then(res=>{
          if(res) {
            let message = "";
            res.forEach(item=>{
              if(!item.type) {
                message += "&nbsp;&nbsp;&nbsp;<span style='color: red'>系统公告:</span>" + "&nbsp;&nbsp;" + item.title + "&nbsp;&nbsp;" + item.content + "&nbsp;&nbsp;&nbsp;";
              } else {
                message += "&nbsp;&nbsp;&nbsp;<span style='color: #E6A23C'>系统通知:</span>" + "&nbsp;&nbsp;" + item.title + "&nbsp;&nbsp;" + item.content + "&nbsp;&nbsp;&nbsp;";
              }
            })
            this.$store.commit('initCircleSysMsgs', message === "" ? "<span style='color:black'>暂无公告</span>": message);
          }
        })
      }
    },
    watch: {
      height(val) {        //在watch中监听height,浏览器窗口大小变动时自适应高度。
        this.height = val;
      }
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

  .page-component__scroll {
    overflow-y: hidden;
  }
  .scrollbar {
    height: calc(100vh - 60px);
  }
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-aside {
    display: block;
    position: relative;
    overflow-y: hidden;
    background-color: #001529;
  }
  .el-menu {
    border-right: #001529;
  }
  .homeHeader {
    display: flex;
    align-items: center;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 15px;
  }
  .title {
    font-size: 30px;
    font-family: 华文行楷;
    color: #1B63AD;
    height: 50px;
    margin: 5px 20px 0;
    display: flex;
    align-items: center;
  }

  .el-menu-item:hover {
    color: #fff!important;
  }

  ::v-deep .el-menu-item:hover > i{
    color: #fff!important;

  }

  ::v-deep .el-submenu:hover > .el-submenu__title i {
    color: #fff!important;
  }

  ::v-deep .el-submenu:hover > .el-submenu__title{
    color: #fff!important;
  }

  .el-menu-item.is-active {
    background: #2d8cf0!important;
    color: #fff!important;
  }

  ::v-deep .el-submenu.is-active > .el-submenu__title i {
    color: #fff !important;
  }

  .el-dropdown-link img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }

</style>
