<template>
  <div>
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
            <i class="el-icon-s-home" style="margin-right: 5px;"></i>
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
              <el-tooltip class="item" effect="dark" content="全屏" placement="bottom" popper-class="my-popper">
                <span class="el el-icon-full-screen" v-show="!isFull"></span>
              </el-tooltip>
              <!-- 不是全屏 -->
              <el-tooltip class="item" effect="dark" content="退出全屏" placement="bottom" popper-class="my-popper">
                <span class="el el-icon-full-screen" v-show="isFull"></span>
              </el-tooltip>
            </div>
            <div style="margin-right: 20px;">
              <el-tooltip class="item" effect="dark" content="聊天框" placement="bottom" popper-class="my-popper">
                <span class="el-icon-bell" @click="goChat"></span>
              </el-tooltip>
            </div>
            <el-dropdown trigger="hover" @command="commandHandler">
              <span class="el-dropdown-link">
                <span style="display: flex;align-items: center">
                  <i style="margin-right: 5px"><img :src="user.userFace"></i>
                  {{ user.name }}
                  <i class="fa fa-caret-down" style="margin-left: 10px;margin-right: 20px"></i>
                </span>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userinfo">&nbsp;<i class="fa fa-user-o"  aria-hidden="true"></i>个人中心</el-dropdown-item>
                <el-dropdown-item>
                  <el-link :underline="false" :href="apiHref" style="font-size: 12px;" :target="apiTarget">
                    <span @click="apiClick"><i class="fa fa-gg fa-fw" aria-hidden="true"></i>系统接口</span>
                  </el-link>
                </el-dropdown-item>
                <el-dropdown-item command="codeGenerator"><i class="fa fa-code fa-fw"  aria-hidden="true"></i>代码生成</el-dropdown-item>
                <el-dropdown-item command="logout">&nbsp;<i class="fa fa-sign-out" aria-hidden="true"></i>注销登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-scrollbar class="scrollbar">
          <el-main>
            <notice :message="message" style="margin-bottom: 10px;"></notice>
            <div style="margin-top: 10px;">
              <div v-if="this.$route.path==='/home'">
                <HomeMain></HomeMain>
              </div>
              <router-view/>
            </div>
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
import notice from "@/components/notice";
import HomeMain from "../components/home/HomeMain";
  export default {
    name: "Home",
    components: {
      notice,
      HomeMain,
    },
    data() {
      return {
        height: document.documentElement.clientHeight,
        active: this.$route.path,//当前激活菜单
        opened: [],//当前打开的目录
        isFull: false, //是否全屏
        isCollapse: false,//是否折叠菜单
        apiHref: 'http://47.100.78.245:8081/doc.html', //接口文档地址
        apiTarget: '_blank'
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
      this.initCircleSysMsg();
    },
    methods: {
      apiClick() {
        if(!this.$store.getters.checkPermissionFlag('SystemApi')) {
          this.apiTarget = '_self';
          this.apiHref = 'javascript:void(0)';
          this.$message.error('权限不足,请联系管理员');
          return;
        }
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
            //清空按钮权限标识
            this.$store.commit('initActions', []);
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
        if(command === 'codeGenerator') {
          if(!this.$store.getters.checkPermissionFlag('SystemGenerateCode')) {
            this.$message.error('权限不足,请联系管理员');
            return;
          }
          this.$router.push('/codeGenerator')
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
        this.$getRequest("/admin/info").then(res=> {
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
    // watch: {
    //   height(val) {        //在watch中监听height,浏览器窗口大小变动时自适应高度。
    //     this.height = val;
    //   }
    // }
  }
</script>
<style lang="scss" scoped>
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

  ::v-deep .el-menu-item.is-active {
    background: #2d8cf0!important;
    color: #fff!important;
  }

  ::v-deep .el-submenu.is-active > .el-submenu__title i {
    color: #fff !important;
  }

  ::v-deep .el-submenu.is-active > .el-submenu__title {
    color: #fff !important;
  }

  .el-dropdown-link img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
</style>
