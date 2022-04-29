<template>
  <div>
    <div>
      <el-input clearable size="small" v-model="ecRule.ecReason" placeholder="添加奖惩原因" prefix-icon="el-icon-plus"
                style="width: 300px;"></el-input>
      <el-input clearable size="small" v-model="ecRule.score" placeholder="奖惩得分" style="margin-right: 8px;margin-left: 8px;width: 300px;"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addJobLevel">添加</el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table :data="ecRules" size="small" stripe @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="80">
        </el-table-column>
        <el-table-column
            prop="ecReason"
            label="奖惩原因"
            width="200">
        </el-table-column>
        <el-table-column
            prop="score"
            label="奖惩得分"
            width="140">
        </el-table-column>
        <el-table-column
            prop="gmtCreate"
            label="创建日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="enabled"
            label="是否启用"
            width="200">
          <template slot-scope="scope">
            <el-tag type="success" size="small" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="danger" size="small" v-else>未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditView(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteEcRule(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: space-between;margin-top: 10px">
        <el-button size="small" style="margin-top: 8px" type="danger" :disabled="this.multipleSelection.length===0" @click="deleteMany">批量删除</el-button>
        <el-pagination
            background
            layout="sizes, prev, pager, next, jumper, ->, slot, total"
            @size-change="sizeChange"
            @current-change="currentChange"
            :total="total">
        </el-pagination>
      </div>
      <el-dialog
          title="编辑奖惩规则"
          :visible.sync="dialogVisible"
          width="30%">
        <div>
          <el-tag>奖惩原因</el-tag>
          <el-input v-model="updateEcRule.ecReason" size="small" class="updateEcRuleInput"></el-input>
        </div>
        <div>
          <el-tag>奖惩得分</el-tag>
          <el-input size="small" v-model="updateEcRule.score" placeholder="职称等级" class="updateEcRuleInput" style="margin-left: 8px">
          </el-input>
        </div>
        <div style="margin-top: 8px">
          <el-tag style="margin-right: 8px">是否启用</el-tag>
          <el-switch
              v-model="updateEcRule.enabled"
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
    name: "EcRule",
    data() {
      return {
        ecRule: {
          ecReason: '',
          score: null
        },
        ecRules: [],
        dialogVisible: false,
        updateEcRule: {
          ecReason: '',
          score: null,
          enabled: false
        },
        multipleSelection: [],
        currentPage: 1,
        size: 10,
        total: 0
      }
    },
    mounted() {
      this.initEcRules();
    },
    methods: {
      deleteMany(){
        this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条奖惩规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = '?';
          this.multipleSelection.forEach(item=>{
            ids += 'ids=' + item.id + '&';
          });
          this.$deleteRequest('/system/basic/ec/rule/' + ids).then(res => {
            if (res) {
              this.initEcRules();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      sizeChange(size){
        this.size = size;
        this.initSysMsg();
      },
      currentChange(currentPage){
        this.currentPage = currentPage;
        this.initSysMsg();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      doUpdate() {
        this.$putRequest('/system/basic/ec/rule/',this.updateEcRule).then(res=>{
          if(res) {
            this.initEcRules();
            this.dialogVisible = false;
          }
        })
      },
      showEditView(data){
        Object.assign(this.updateEcRule, data);
        this.dialogVisible = true;
      },
      deleteEcRule(data){
        this.$confirm('此操作将永久删除编号【' + data.id + '】奖惩规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$deleteRequest('/system/basic/ec/rule/' + data.id).then(res => {
            if (res) {
              this.initEcRules();
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
        if(this.ecRule.ecReason && this.ecRule.score) {
          this.$postRequest('/system/basic/ec/rule/',this.ecRule).then(res=>{
            if(res) {
              this.initEcRules();
            }
          })
        } else {
          this.$message.error("字段不能为空!");
        }
      },
      initEcRules() {
        this.$getRequest('/system/basic/ec/rule/list').then(res=>{
          if(res) {
            this.ecRules = res.data;
            this.total = res.total;
            this.ecRule.ecReason = '';
            this.ecRule.score = '';
          }
        })
      }
    }
  }
</script>

<style scoped>
.updateEcRuleInput{
  width: 200px;
  margin-left: 8px;
  margin-top: 8px;
}
</style>
