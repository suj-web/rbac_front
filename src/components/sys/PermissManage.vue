<template>
  <div>
    <div class="permissManaTool">
      <el-input clearable size="small" placeholder="请输入角色英文名" v-model="role.name">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input clearable size="small" v-model="role.nameZh" placeholder="请输入角色中文名"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addRole">添加角色</el-button>
    </div>
    <div class="permissManaMain">
      <el-collapse accordion @change="doChange" v-model="activeName">
        <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r, index) in roles" :key="index">
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
                       :default-checked-keys="selectedMenus"
                       node-key="id"
                       :default-expand-all="false"
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
import {initMenu} from "../../network/menu";
import {initAction} from "../../network/action";
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
        allRoleSelectedMenus: [],//所有角色对应的资源id
        expandAll: false,//是否展开
        checked: false,//是否全选
        allMenuIds: [],//用于设置全选
        // parentMenus: [],//父级资源
        // currentIndex: -1,//当前展开面板的index
        // tempSelected: []//中间变量
      }
    },
    mounted() {
      this.initRoles();
      this.initAllMenuIds();
      // this.initParentMenus();
      this.initAllMenus();
      this.initSelectedMenus();
    },
    methods: {
      // select(data, check, child){//选中子节点时,父结点全选,最顶层父结点不选时,子节点全都不选
      //   if(check) {
      //     this.tempSelected = [];
      //     Object.assign(this.tempSelected, this.selectedMenus);
      //     this.parentMenus.forEach(item=>{
      //       if(item.id === data.id) {
      //         while (item) {
      //           this.tempSelected.push(item.id);
      //           item = item.parent;
      //         }
      //       }
      //     })
      //     this.$refs.tree[this.currentIndex].setCheckedKeys(Array.from(new Set(this.tempSelected)));
      //     this.selectedMenus = [];
      //     Object.assign(this.selectedMenus, Array.from(new Set(this.tempSelected)));
      //   } else {
      //     if(data.parentId === -1) {
      //       this.tempSelected = [];
      //       this.selectedMenus = [];
      //       this.$refs.tree[this.currentIndex].setCheckedKeys([]);
      //     } else {
      //       this.selectedMenus.splice(this.selectedMenus.indexOf(data.id),1);
      //     }
      //   }
      // },
      onSelectedAll(index){
        this.checked = !this.checked;
        if(this.checked) {
          console.log(this.allMenuIds);
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
              this.role.nameZh='';
              this.role.name='';
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
        let halfSelectedKeys = tree.getHalfCheckedKeys(false);
        console.log(selectedKeys);
        console.log(halfSelectedKeys);
        let url = '/system/basic/permission/?roleId=' + rid;
        selectedKeys.forEach(item=>{
          url += '&ids=' + item;
        })
        halfSelectedKeys.forEach(item=>{
          url += '&ids=' + item;
        })
        this.$putRequest(url).then(res=>{
          if(res) {
            //清空菜单
            this.$store.commit('initRoutes', []);
            //清空按钮权限标识
            this.$store.commit('initActions', []);
            initMenu(this.$router, this.$store);
            initAction(this.$router, this.$store);
            this.initRoles();
            this.activeName = -1;
            this.initSelectedMenus();
          }
        })
      },
      initSelectedMenus() {
        this.$getRequest('/system/basic/permission/role/resIds').then(res=>{
          if(res) {
            this.allRoleSelectedMenus = res;
          }
        })
      },
      doChange(rid){
        console.log('change');
        this.selectedMenus = [];
        // this.tempSelected = [];
        this.checked = false;
        this.expandAll = false;
        if(rid) {
          this.initAllMenus();
          for(let i = 0; i < this.allRoleSelectedMenus.length; i++) {
            if(rid === this.allRoleSelectedMenus[i].roleId) {
              this.selectedMenus = this.allRoleSelectedMenus[i].resIds;
              break;
            }
          }
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
        this.$getRequest('/system/basic/permission/resId/list').then(res=>{
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
