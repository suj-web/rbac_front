<template>
  <div>
    <div>
      <el-input size="small" v-model="jl.name" placeholder="添加职称等级" prefix-icon="el-icon-plus"
                style="width: 300px;"></el-input>
      <el-select size="small" v-model="jl.titleLevel" placeholder="职称等级" style="margin-right: 8px;margin-left: 8px">
        <el-option
            v-for="item in titleLevels"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addJobLevel">添加</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table :data="jls" size="small" stripe border style="width: 80%" @selection-change="handleSelectionChange">
        <el-table-column
              type="selection"
              width="55">
        </el-table-column>
        <el-table-column
              prop="id"
              label="编号"
              width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职称名称"
            width="150">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称等级"
            width="150">
        </el-table-column>
        <el-table-column
            prop="gmtCreate"
            label="创建日期"
            width="150">
        </el-table-column>
        <el-table-column
            prop="enabled"
            label="是否启用"
            width="150">
          <template slot-scope="scope">
            <el-tag type="success" size="small" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="danger" size="small" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditView(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteJobLevel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button size="small" style="margin-top: 8px" type="danger" :disabled="this.multipleSelection.length===0" @click="deleteMany">批量删除</el-button>
      <el-dialog
          title="编辑职称"
          :visible.sync="dialogVisible"
          width="30%">
        <div>
          <el-tag>职称名称</el-tag>
          <el-input v-model="updatejl.name" size="small" class="updateJlInput"></el-input>
        </div>
        <div>
          <el-tag>职称等级</el-tag>
          <el-select size="small" v-model="updatejl.titleLevel" placeholder="职称等级" class="updateJlInput" style="margin-left: 8px">
            <el-option
                v-for="item in titleLevels"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
          </el-select>
        </div>
        <div style="margin-top: 8px">
          <el-tag style="margin-right: 8px">是否启用</el-tag>
          <el-switch
              v-model="updatejl.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="已启用"
              inactive-text="未启用">
          </el-switch>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "JoblebelManage",
    data() {
      return {
        jl: {
          name: '',
          titleLevel: ''
        },
        titleLevels: [
            '正高级',
            '副高级',
            '中级',
            '初级',
            '员级'
        ],
        jls: [],
        dialogVisible: false,
        updatejl: {
          name: '',
          titleLevel: '',
          enabled: false
        },
        multipleSelection: []
      }
    },
    mounted() {
      this.initJls();
    },
    methods: {
      deleteMany(){
        this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条职位, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = '?';
          this.multipleSelection.forEach(item=>{
            ids += 'ids=' + item.id + '&';
          });
          this.$deleteRequest('/system/basic/joblevel/' + ids).then(res => {
            if (res) {
              this.initJls();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      doUpdate() {
        this.$putRequest('/system/basic/joblevel/',this.updatejl).then(res=>{
          if(res) {
            this.initJls();
            this.dialogVisible = false;
          }
        })
      },
      showEditView(data){
        Object.assign(this.updatejl, data);
        this.dialogVisible = true;
      },
      deleteJobLevel(data){
        this.$confirm('此操作将永久删除[' + data.name + ']职称, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$deleteRequest('/system/basic/joblevel/' + data.id).then(res => {
            if (res) {
              this.initJls();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      addJobLevel() {
        if(this.jl.name && this.jl.titleLevel) {
          this.$postRequest('/system/basic/joblevel/',this.jl).then(res=>{
            if(res) {
              this.initJls();
            }
          })
        } else {
          this.$message.error("字段不能为空!");
        }
      },
      initJls() {
        this.$getRequest('/system/basic/joblevel/').then(res=>{
          if(res) {
            this.jls = res;
            this.jl.name = '';
            this.jl.titleLevel = '';
          }
        })
      }
    }
  }
</script>

<style scoped>
  .updateJlInput{
    width: 200px;
    margin-left: 8px;
    margin-top: 8px;
  }
</style>
