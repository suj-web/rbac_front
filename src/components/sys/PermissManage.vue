<template>
  <div>
    <div class="permissManaTool">
      <el-input size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input size="small" v-model="role.nameZh" placeholder="请输入角色中文名"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addRole">添加角色</el-button>
    </div>
    <div class="permissManaMain">
      <el-collapse accordion @change="change" v-model="activeName">
        <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r, index) in roles">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问资源</span>
              <el-button style="float: right; padding: 3px 0;color: red;" type="text" icon="el-icon-delete" @click=""></el-button>
            </div>
            <div>
              <el-tree :data="allMenus"
                       :props="defaultProps"
                       show-checkbox
                       :default-checked-keys="selectedMenus"
                       node-key="id"
                       ref="tree"
                       :key="index"></el-tree>
              <div style="display: flex; justify-content: flex-end">
                <el-button type="danger" size="mini" @click="cancelUpdate">取消修改</el-button>
                <el-button type="primary" size="mini" @click="doUpdate(r.id,index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PermissManage",
    data() {
      return {
        role: {
          name: '',
          nameZh: ''
        },
        activeName: '',
        roles: [],
        allMenus: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    mounted() {
      this.initRoles();
    },
    methods: {
      addRole() {
        if(this.role.name && this.role.nameZh) {
          this.$postRequest('/system/basic/permission/',this.role).then(res=>{
            if(res) {

            }
          })
        }
      },
      change(rid){
        if(rid) {
          this.initAllMenus();
        }
      },
      initAllMenus() {
        this.$getRequest('/system/basic/permission/resources').then(res=>{
          if(res) {
            this.allMenus = res;
          }
        })
      },
      initRoles() {
        this.$getRequest('/system/basic/permission/').then(res=>{
          if (res) {
            this.roles = res;
          }
        })
      }
    }
  }
</script>

<style scoped>
  .permissManaTool {
    display: flex;
    justify-content: flex-start;
  }
  .permissManaTool .el-input {
    width: 300px;
    margin-right: 8px;
  }
  .permissManaMain {
    margin-top: 10px;
    width: 800px;
  }
</style>
