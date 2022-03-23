<template>
  <div class="background">
    <el-form :model="loginForm"
             :rules="rules"
             ref="form"
             class="loginContainer"
             v-loading="loading"
             element-loading-text="正在登录"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
      <h3 class="loginTitle">系统登录</h3>
      <el-form-item prop="username">
        <el-input type="text" auto-complete="false" v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user-solid"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" auto-complete="false" v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码" prefix-icon="el-icon-circle-check" style="width: 250px;margin-right: 5px"></el-input>
        <img :src="captchaUrl" @click="updateCaptcha"/>
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">记住我</el-checkbox>
      <el-form-item style="margin-bottom: 0">
        <el-button type="primary" @click="submitLogin" style="width: 100%">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import {postRequest} from "../network/api";

export default {
  name: "Login",
  data(){
    return {
      captchaUrl: '/captcha?time='+new Date(),
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      checked: true,
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      },
      loading: false
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    submitLogin(){
      if(this.checked){
        let userInfo = this.loginForm.username+'#'+this.loginForm.password;
        window.localStorage.setItem('userInfo',userInfo);
      } else {
        if(window.localStorage.getItem('userInfo')){
          window.localStorage.removeItem('userInfo');
        }
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$postRequest('/login',this.loginForm)
              .then(res=>{
                this.loading = false;
                if(res){
                  //存储用户token
                  const tokenStr = res.obj.tokenHead + ' ' + res.obj.token;

                  window.sessionStorage.setItem("tokenStr",tokenStr);
                  // console.log(window.sessionStorage.getItem("tokenStr"));
                  //跳转首页
                  // this.$router.replace('/home');
                  //页面跳转
                  let path = this.$route.query.redirect;
                  this.$router.replace((path === '/' || path === undefined)?'/home':path);
                } else {
                  this.updateCaptcha();
                }
              })
        } else {
          this.$message.error('请输入所有字段');
          return false;
        }
      });
    },
    updateCaptcha(){
      this.captchaUrl = '/captcha?time=' + new Date();
    },
    init(){
      if(window.localStorage.getItem('userInfo')){
        let userInfo = window.localStorage.getItem('userInfo').split('#');
        this.loginForm.username = userInfo[0];
        this.loginForm.password = userInfo[1];
        this.checked = true;
      } else {
        this.checked = false;
      }
    }
  }
}
</script>

<style>
  .background {
    width: 100%;
    height: 100%;
    background-image: url("~@/assets/login-background.jpg");
    background-size: cover;
    background-position: center;
    position: absolute;
  }
  .loginContainer{
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 15px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .loginTitle{
    margin: 0 auto 30px auto;
    text-align: center;
  }

  .loginRemember{
    text-align: right;
    margin: 0 0 15px 0;
  }

  .el-form-item__content {
    display: flex;
    align-items: center;
  }
</style>
