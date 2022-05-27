<template>
  <div>
    <div style="width: 500px;">
      <el-input
          clearable
          size="small"
          placeholder="输入部门进行过滤.."
          prefix-icon="el-icon-search"
          v-model="filterText">
      </el-input>

      <el-tree
          :data="deps"
          :props="defaultProps"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          class="depTree"
          ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }" style="display: flex;justify-content: space-between;width: 100%">
          <span>{{data.name}}</span>
          <span>
            <el-button
                type="primary"
                size="small"
                class="depBtn"
                @click="() => showAddDep(data)">
              添加部门
            </el-button>
            <el-button
                type="danger"
                size="mini"
                class="depBtn"
                @click="() => deleteDep(data)">
              删除部门
            </el-button>
          </span>
        </span>
      </el-tree>
      <el-dialog
          title="添加部门"
          :visible.sync="dialogVisible"
          width="30%">
        <div>
          <table>
            <tr>
              <td>
                <el-tag>上级部门</el-tag>
              </td>
              <td>{{pname}}</td>
            </tr>
            <tr>
              <td>
                <el-tag>部门名称</el-tag>
              </td>
              <td>
                <el-input v-model="dep.name" placeholder="请输入部门名称"></el-input>
              </td>
            </tr>
          </table>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAddDep">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DepManage",
    data() {
      return {
        filterText: '',
        deps: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        dialogVisible: false,
        dep: {
          name: '',
          parentId: -1
        },
        pname: ''
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted() {
      this.initDeps();
    },
    methods:{
      addDep2Deps(deps, dep){
        if(!deps) {
          return;
        }
        for(let i=0; i<deps.length;i++){
          let d = deps[i];
          if(d.id === dep.parentId){
            if(!d.children){
              d.children = [];
            }
            d.children.push(dep);
            if(d.children.length>0){
              d.isParent = true;
            }
            return;
          } else{
            this.addDep2Deps(d.children, dep);
          }
        }
      },
      initDep(){
        this.dep = {
          name: '',
          parentId: -1
        };
        this.pname = '';
      },
      doAddDep(){
        this.$postRequest('/system/basic/department/',this.dep).then(res=>{
          if(res){
            this.addDep2Deps(this.deps, res.obj);
            this.dialogVisible = false;
            this.initDep();
          }
        })
      },
      showAddDep(data){
        this.pname = data.name;
        this.dep.parentId = data.id;
        this.dialogVisible = true;
      },
      removeDepFromDeps(p,deps, id){
        if(!deps) {
          return;
        }
        for(let i=0;i<deps.length;i++){
          let d = deps[i];
          if(d.id === id){
            deps.splice(i,1);
            if(deps.length === 0){
              p.isParent=false;
            }
            return;
          } else{
            this.removeDepFromDeps(d,d.children, id);
          }
        }
      },
      deleteDep(data){
        if(data.isParent){
          this.$message.error("父部门删除失败");
        } else{
          this.$confirm('此操作将永久删除【'+data.name+'】部门', '是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$deleteRequest('/system/basic/department/'+data.id).then(res=>{
              if(res){
                this.removeDepFromDeps(null,this.deps, data.id);
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }
      },
      initDeps(){
        this.$getRequest('/system/basic/department/').then(res=>{
          if(res){
            this.deps = res;
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      }
    }
  }
</script>

<style scoped>
  .depBtn{
    padding: 2px;
  }

  .depTree {
    margin-top: 10px;
  }
</style>
