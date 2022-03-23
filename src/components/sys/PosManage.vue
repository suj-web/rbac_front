<template>
  <div>
    <div>
      <el-input
          style="width: 300px;margin-right: 20px"
          size="small"
          placeholder="添加职位..."
          suffix-icon="el-icon-plus"
          @keydown.enter.native="addPosition"
          v-model="pos.name">
      </el-input>
      <el-button type="primary" size="small" icon="el-icon-plus" @click="addPosition">添加</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
          stripe
          border
          size="small"
          @selection-change="handleSelectionChange"
          :data="positions"
          style="width: 80%">
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
            label="职位"
            width="200">
        </el-table-column>
        <el-table-column
            prop="gmtCreate"
            label="创建时间"
            width="200">
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditView(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button size="small" style="margin-top: 8px" type="danger" :disabled="this.multipleSelection.length===0" @click="deleteMany">批量删除</el-button>
      <el-dialog
          title="编辑职位"
          :visible.sync="dialogVisible"
          width="30%">
        <div>
          <el-tag>职位名称</el-tag>
          <el-input v-model="updatepos.name" size="small" class="updatePosInput"></el-input>
        </div>
        <div style="margin-top: 8px">
          <el-tag style="margin-right: 8px">是否启用</el-tag>
          <el-switch
              v-model="updatepos.enabled"
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
  name: "PosManage",
  data() {
    return {
      pos: {
        name: ''
      },
      positions: [],
      dialogVisible: false,
      updatepos: {
        name: '',
        enabled: false
      },
      multipleSelection: []
    }
  },
  mounted() {
    this.initPosistions();
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
        this.$deleteRequest('/system/basic/position/' + ids).then(res => {
          if (res) {
            this.initPosistions();
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
      this.$putRequest('/system/basic/position/',this.updatepos).then(res=>{
        if(res) {
          this.initPosistions();
          this.dialogVisible = false;
        }
      })
    },
    showEditView(index, data) {
      Object.assign(this.updatepos,data)//拷贝
      this.dialogVisible = true;
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除[' + data.name + ']职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteRequest('/system/basic/position/' + data.id).then(res => {
          if (res) {
            this.initPosistions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addPosition() {
      if (this.pos.name) {
        this.$postRequest('/system/basic/position/', this.pos).then(res => {
          if (res) {
            this.pos.name = '';
            this.initPosistions();
          }
        })
      } else {
        this.$message.error("职位名称不能为空");
      }
    },
    initPosistions() {
      this.$getRequest('/system/basic/position/').then(res => {
        if (res) {
          this.positions = res;
        }
      })
    }
  }
}
</script>

<style scoped>
  .updatePosInput{
    width: 200px;
    margin-left: 8px;
  }
</style>
