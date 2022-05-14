<template>
  <div>
    <el-card class="box-card" style="width: 98%;margin: 1% 1%">
      <div style="display: flex;justify-content: space-between;align-items: center">
        <div>
          <el-button size="mini"  icon="fa fa-plus" type="primary" style="padding: 8px 8px" @click="showAddView">&nbsp;添加</el-button>
          <el-button size="mini" @click="handleExpand" icon="el-icon-sort" type="default" style="padding: 8px 8px" >展开/折叠</el-button>
        </div>
        <el-tooltip effect="dark" content="刷新" placement="top" popper-class="myPopper">
          <el-button size="mini" icon="el-icon-refresh" circle @click="this.initMenus"></el-button>
        </el-tooltip>
      </div>
      <div>
        <el-table
            ref="tableData"
            :data="menus"
            style="width: 100%;margin-top: 10px"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            row-key="id">
          <el-table-column
              prop="name"
              label="菜单名称"
              width="180">
          </el-table-column>
          <el-table-column
              label="图标"
              width="100">
            <template slot-scope="scope">
              <i :class="scope.row.iconCls"></i>
            </template>
          </el-table-column>
          <el-table-column
              label="菜单类型"
              width="100">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.type===0">目录</el-tag>
              <el-tag type="primary" v-else-if="scope.row.type===1">菜单</el-tag>
              <el-tag type="warning" v-else>按钮</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              label="权限标识"
              width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.component!=='Home'">{{scope.row.component}}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="组件路径"
              width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.path!=='/home'">{{scope.row.path}}</span>
            </template>
          </el-table-column>
          <el-table-column
              label="状态"
              width="100">
            <template slot-scope="scope">
              <el-tag size="mini" type="primary" style="border-radius: 4px" v-if="scope.row.enabled">正常</el-tag>
              <el-tag size="mini" type="danger" style="border-radius: 4px" v-else>关闭</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="gmtCreate"
              label="创建时间"
              width="200">
          </el-table-column>
          <el-table-column
              label="操作">
            <template slot-scope="scope">
              <el-link :underline="false" type="primary" @click="showAddView" icon="fa fa-plus" style="padding: 4px 5px">&nbsp;新增</el-link>
              <el-link :underline="false" type="primary" @click="showEditView(scope.row)" icon="fa fa-edit" style="padding: 4px 5px">&nbsp;编辑</el-link>
              <el-link :underline="false" type="danger" @click="deleteMenu(scope.row)" icon="fa fa-remove" style="padding: 4px 5px">&nbsp;删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="45%">
      <el-form ref="menuForm" :rules="rules" :model="menuForm" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="上级菜单">
              <treeselect placeholder="选择上级菜单" @select="selectParentMenu" :normalizer="normalizer" :label="label" v-model="menuForm.parentId" :show-count="true" :options="allMenus" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单类型">
              <el-radio-group v-model="menuForm.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="menuForm.type!==0">
            <el-form-item label="组件名称" prop="component">
              <el-input v-model="menuForm.component" placeholder="请输入组件名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="菜单图标" v-if="menuForm.type!==2">
              <icon-picker v-model="menuForm.iconCls" prefix="fa fa-search" placeholder="点击选中图标"></icon-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="name">
              <el-input style="width: 200px;" v-model="menuForm.name" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="menuForm.enabled">
                <el-radio :label="true">正常</el-radio>
                <el-radio :label="false">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="menuForm.type===1">
          <el-col :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input style="width: 200px" v-model="menuForm.path"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求路径" prop="url">
              <el-input v-model="menuForm.url"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: "MenuManage",
  components: {
    Treeselect
  },
  data() {
    return {
      allMenus: [],
      menus: [],
      isExpand: false,
      menuForm: {
        parentId: 1,
        type: 0,
        iconCls: '',
        name: '',
        path: '',
        url: '',
        component: '',
        enabled: true
      },
      selectedParentMenu: null,
      dialogVisible: false,
      title: '',
      rules: {
        name: [{required: true, message: '请输入菜单名称', trigger: 'blur'}],
        url: [{required: true, message: '请输入访问路径', trigger: 'blur'}],
        path: [{required: true, message: '请输入路由地址', trigger: 'blur'}],
        component: [{required: true, message: '请输入组件名称', trigger: 'blur'}]
      },
      label: ''
    }
  },
  mounted() {
    this.initMenus();
  },
  methods: {
    selectParentMenu(node){
      this.selectedParentMenu = node;
    },
    addMenu() {
      if(this.menuForm.id) {
        this.$refs['menuForm'].validate(valid=>{
          if(valid){
            if(this.selectedParentMenu && this.selectedParentMenu.type>=this.menuForm.type) {
              this.$message.warning('菜单类型有误');
              return;
            }
            if(this.menuForm.type === 0) {
              this.menuForm.url = '/';
              this.menuForm.path = '/home';
            }
            if(this.menuForm.type === 2) {
              this.menuForm.url = '#';
              this.menuForm.path = '#';
            }
            this.$putRequest('/system/cfg/resource',this.menuForm).then(res=>{
              if(res){
                this.dialogVisible = false;
                this.initMenus();
              }
            })
          }
        })
      } else {
        this.$refs.menuForm.validate(valid=>{
          if(valid){
            if(this.selectedParentMenu && this.selectedParentMenu.type>=this.menuForm.type) {
              this.$message.warning('菜单类型有误');
              return;
            }
            if(this.menuForm.type === 0) {
              this.menuForm.url = '/';
              this.menuForm.path = '/home';
            }
            if(this.menuForm.type === 2) {
              this.menuForm.url = '#';
              this.menuForm.path = '#';
            }
            this.$postRequest('/system/cfg/resource',this.menuForm).then(res=>{
              if(res){
                this.dialogVisible = false;
                this.initMenus();
              }
            })
          }
        })
      }
    },
    normalizer(node) {
      return {
        label: node.name
      }
    },
    showEditView(data) {
      this.title = '更新菜单';
      Object.assign(this.menuForm, data);
      this.dialogVisible = true;
    },
    showAddView() {
      this.title = '添加菜单';
      this.menuForm = {
        id: null,
        parentId: 1,
        type: 0,
        iconCls: '',
        name: '',
        path: '',
        url: '',
        component: '',
        enabled: true
      }
      this.dialogVisible = true;
    },
    deleteMenu(data) {
      this.$confirm('是否确定删除名称为【'+ data.name+'】的数据项', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteRequest('/system/cfg/resource/'+data.id).then(res=>{
          if(res){
            this.initMenus();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleExpand(){
      this.isExpand = !this.isExpand
      this.$nextTick(() => {
        this.forArr(this.menus, this.isExpand)
      })
    },
    // 遍历
    forArr(arr, isExpand) {
      arr.forEach(i => {
        this.$refs.tableData.toggleRowExpansion(i, isExpand)
        if (i.children) {
          this.forArr(i.children, isExpand)
        }
      })
    },
    // 处理树形结构
    treeChange (arr) {
      return arr.map(item => {
        if (item.children && item.children.length > 0) {
          this.treeChange(item.children);
        } else {
          delete item.children;
        }
        return item;
      })
    },
    initMenus() {
      this.$getRequest('/system/cfg/resources').then(res=>{
        if(res) {
          this.menus = res[0].children;
          this.allMenus = this.treeChange(res);
        }
      })
    }
  }
}
</script>

<style scoped>
  ::v-deep .el-form-item__label {
    font-weight: bold;
  }
  ::v-deep .el-row {
    margin-bottom: 10px;
  }
</style>
