<template>
  <div>
    <el-form ref="dbForm" :model="dbForm" :rules="dbRules">
      <el-form-item label="数据库用户名" prop="username" label-width="130px">
        <el-input v-model="dbForm.username" style="width: 800px;"></el-input>
      </el-form-item>
      <el-form-item label="数据库密码" prop="password" label-width="130px">
        <el-input v-model="dbForm.password" style="width: 800px;"></el-input>
      </el-form-item>
      <el-form-item label="数据库连接地址" prop="url" label-width="130px">
        <el-input v-model="dbForm.url" style="width: 800px;">
          <template slot="prepend">jdbc:mysql://</template>
          <template slot="append">?useUnicode=true&characterEncoding=utf8&useSSL=false</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="4" :offset="2">
            <el-button size="mini" type="primary" @click="onConnect">连接数据库</el-button>
            <span style="margin-left:10px;color: #ff0114;font-weight: bold" v-if="code===500">*{{msg}}*</span>
            <span style="margin-left:10px;color: #00e65a;font-weight: bold" v-else-if="code===200">*{{msg}}*</span>
            <span style="margin-left:10px;font-weight: bold" v-else>*{{msg}}*</span>
          </el-col>
          <el-col :span="3">
            <el-button size="mini" type="danger" style="margin-left: 10px;margin-right: 20px" @click="onDisconnect">断开连接</el-button>
          </el-col>
          <el-col :span="15">
            表前缀:
            <el-input size="mini" style="width: 240px;margin-right: 8px;" v-model="configData.tablePrefix"></el-input>
            包路径:
            <el-input size="mini" style="width: 240px;margin-right: 8px;" v-model="configData.packageName"></el-input>
            <el-button type="primary" size="mini" @click="config">配置</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <el-table
        :data="tableData"
        stripe
        size="mini"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
      <el-table-column
          type="selection"
          fixed
          width="55">
      </el-table-column>
      <el-table-column
          prop="tableName"
          label="表名称"
          width="140">
      </el-table-column>
      <el-table-column
          prop="pojoName"
          label="实体类名称"
          width="150">
        <template slot-scope="scope">
          <el-input v-model="scope.row.pojoName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="serviceName"
          label="Service名称"
          width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.serviceName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="serviceImplName"
          label="serviceImpl名称"
          width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.serviceImplName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="mapperName"
          label="mapper名称"
          width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.mapperName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="controllerName"
          label="controller名称"
          width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.controllerName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
          prop="vueName"
          label="vue名称">
        <template slot-scope="scope">
          <el-input v-model="scope.row.vueName"></el-input>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 5px;">
      <el-button :disabled="multipleSelection.length===0" @click="generateCode" type="success">生成代码</el-button>
      <div>{{codePath}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CodeGenerator",
  data() {
    return {
      msg: '数据库未连接',
      code: '',
      dbForm: {
        username: 'root',
        password: '12345678',
        url: 'localhost:3306/rbac'
      },
      dbRules: {
        username: [{required: true, message:'请输入数据库用户名', trigger: 'blur'}],
        password: [{required: true, message:'请输入数据库密码', trigger: 'blur'}],
        url: [{required: true, message:'请输入数据库连接地址', trigger: 'blur'}]
      },
      configData: {
        packageName: 'com.example.rbac',
        tablePrefix: 't_',
      },
      tableData: [],
      codePath: '',
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    generateCode() {
      this.$postRequest2('/generateCode',this.multipleSelection).then(res=>{
        if(res) {
          this.codePath = res.obj;
        }
      })
    },
    config() {
      if(this.configData.packageName && this.configData.tablePrefix) {
        this.$postRequest2('/config',this.configData).then(res=>{
          if(res) {
            this.tableData = res.obj;
            this.$notify({
              message: res.message,
              type: res.code==200 ? 'success':'error'
            });
          }
        })
      } else {
        this.$notify({
          message: '字段不能为空',
          type: 'warning'
        });
      }
    },
    onDisconnect() {
      if(this.code===200) {
        this.$postRequest2('/disconnect').then(res => {
          if (res) {
            this.$notify({
              message: res.message,
              type: res.code===200 ? 'success':'error'
            });
            this.code = '';
            this.msg = '数据库未连接';
          }
        })
      }
    },
    onConnect() {
      this.$refs['dbForm'].validate(valid=>{
        if(valid) {
          let form = {};
          Object.assign(form, this.dbForm);
          form.url = 'jdbc:mysql://'+this.dbForm.url+'?useUnicode=true&characterEncoding=utf8&useSSL=false';
          this.$postRequest2('/connect', form).then(res=>{
            if(res) {
              this.msg = res.message;
              this.code = res.code;
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
