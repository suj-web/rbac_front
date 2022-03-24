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
              <span style="margin-right: 20px">数据权限:</span>
              <el-checkbox :value="expandAll" @change="onExpand(index)">展开/折叠</el-checkbox>
              <el-checkbox :value="checked" @change="onSelectedAll(index)">全选/全不选</el-checkbox>
              <el-button style="float: right; padding: 3px 0;color: red;" type="text" icon="el-icon-delete" @click="doDeleteRole(r)"></el-button>
            </div>
            <div>
              <el-tree :data="allMenus"
                       :props="defaultProps"
                       show-checkbox
                       :check-strictly="true"
                       :default-checked-keys="selectedMenus"

                       default-expand-all
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
        activeName: -1,
        roles: [],
        allMenus: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        selectedMenus: [],
        expandAll: true,
        checked: false,
        allMenuIds: []
      }
    },
    mounted() {
      this.initRoles();
      this.initAllMenuIds();
    },
    methods: {
      // checkChange(node, checked, children) {
      //   console.log(node, checked, children);
      // },
      onSelectedAll(index){
        this.checked = !this.checked;
        if(this.checked) {
          this.$refs.tree[index].setCheckedKeys(this.allMenuIds);
        } else {
          this.$refs.tree[index].setCheckedKeys([]);
        }
      },
      onExpand(index){
        this.expandAll = !this.expandAll;
        for (let i = 0;i < this.$refs.tree[index].store._getAllNodes().length;i++) {
          this.$refs.tree[index].store._getAllNodes()[i].expanded = this.expandAll;
        }
      },
      doDeleteRole(role) {
        this.$confirm('此操作将永久删除['+role.nameZh+']角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$deleteRequest('/system/basic/permission/role/'+role.id).then(res=>{
            if(res){
              this.initRoles();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      addRole() {
        if(this.role.name && this.role.nameZh) {
          this.$postRequest('/system/basic/permission/role',this.role).then(res=>{
            if(res) {
              this.initRoles();
            }
          })
        }
      },
      cancelUpdate() {
        this.activeName = -1;
      },
      doUpdate(rid, index) {
        let tree = this.$refs.tree[index];
        let selectedKeys = tree.getCheckedKeys(false);
        let url = '/system/basic/permission/?roleId=' + rid;
        selectedKeys.forEach(item=>{
          url += '&ids=' + item;
        })
        this.$putRequest(url).then(res=>{
          if(res) {
            this.initRoles();
            this.activeName = -1;
          }
        })
      },
      initSelectedMenus(rid) {
        this.$getRequest('/system/basic/permission/resId/'+rid).then(res=>{
          if(res) {
            this.selectedMenus = res;
          }
        })
      },
      change(rid){
        this.selectedMenus = [];
        this.checked = false;
        this.expandAll = true;
        if(rid) {
          this.initAllMenus();
          this.initSelectedMenus(rid);
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
      },
      initAllMenuIds() {
        this.$getRequest('/system/basic/permission/resId').then(res=>{
          if(res) {
            this.allMenuIds = res;
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
