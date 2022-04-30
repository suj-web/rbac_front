<template>
  <div>
    <el-card class="box-card" style="width: 400px;">
      <div slot="header" class="clearfix">
        <span>{{admin.name}}</span>
      </div>
      <div>
        <div style="display: flex;justify-content: center">
          <el-upload action="/api/admin/userface"
                     :show-file-list="false"
                     :headers="headers"
                     :data="admin"
                     :on-success="onSuccess">
            <img :src="admin.userFace" title="点击修改用户头像" alt="" style="width: 100px;height: 100px;border-radius: 50%">
          </el-upload>
        </div>
        <div>电话号码: <el-tag>{{admin.telephone}}</el-tag></div>
        <div>手机号码: <el-tag>{{admin.phone}}</el-tag></div>
        <div>居住地址: <el-tag>{{admin.address}}</el-tag></div>
        <div>用户标签:
          <el-tag v-for="(r, index) in admin.roles" :key="index" type="success">{{r.nameZh}}</el-tag>
        </div>
        <div style="display: flex;justify-content: space-around;margin-top: 10px">
          <el-button type="primary" @click="showUpdateAdminInfoView">修改信息</el-button>
          <el-button type="danger" @click="showupdatePasswordView">修改密码</el-button>
        </div>
      </div>
    </el-card>
    <el-dialog
        title="编辑用户信息"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <table>
          <tr>
            <td>用户昵称:</td>
            <td><el-input v-model="admin2.name"></el-input></td>
          </tr>
          <tr>
            <td>电话号码:</td>
            <td><el-input v-model="admin2.telephone"></el-input></td>
          </tr>
          <tr>
            <td>手机号码:</td>
            <td><el-input v-model="admin2.phone"></el-input></td>
          </tr>
          <tr>
            <td>用户地址:</td>
            <td><el-input v-model="admin2.address"></el-input></td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAdminInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="更新密码"
        :visible.sync="passwordDialogVisible"
        width="30%">
      <div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="旧密码" prop="oldPass">
            <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input v-model.number="ruleForm.checkPass"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "AdminInfo",
    data(){
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.pass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.checkPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        headers:{
          Authorization: window.sessionStorage.getItem('tokenStr')
        },
        admin: {},
        admin2: {},
        dialogVisible: false,
        passwordDialogVisible: false,
        ruleForm: {
          oldPass: '',
          pass: '',
          checkPass: ''
        },
        rules: {
          oldPass: [
            { required: true,message: '旧密码不能为空', trigger: 'blur' }
          ],
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' },
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' },
          ]
        }
      }
    },
    mounted() {
      this.initAdmin();
    },
    methods: {
      onSuccess(){
        this.initAdmin();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.ruleForm.adminId = this.admin.id;
            this.$putRequest('/admin/pass',this.ruleForm).then(res=>{
              if(res){
                //更新密码成功后退出登录
                this.$postRequest('/logout');
                window.sessionStorage.removeItem('user');
                window.sessionStorage.removeItem('tokenStr');
                this.$store.commit('initRoutes',[]);
                this.$store.commit('initActions', []);
                this.$router.replace('/');
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      showupdatePasswordView(){
        this.passwordDialogVisible = true;
      },
      updateAdminInfo(){
        this.$putRequest('/admin/info',this.admin2).then(res=>{
          if(res){
            this.dialogVisible = false;
            this.initAdmin();
          }
        })
      },
      showUpdateAdminInfoView(){
        this.dialogVisible = true;
      },
      initAdmin(){
        this.$getRequest('/admin/info').then(res=>{
          if(res){
            this.admin = res;
            this.admin2 = Object.assign({},this.admin);
            window.sessionStorage.setItem('user',JSON.stringify(res));
            this.$store.commit('initAdmin',res);
          }
        })
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin-bottom: 5px;
  }
</style>
