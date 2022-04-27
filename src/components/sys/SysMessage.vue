<template>
  <div>
    <div>
      <el-card style="width: 98%;margin: 1% 1%" shadow="always">
        <el-row>
          <el-col :span="6">
            公告标题:
            <el-input v-model="searchValue.title" style="width: 200px"></el-input>
          </el-col>
          <el-col :span="6">
            操作人员:
            <el-input v-model="searchValue.creator" style="width: 200px"></el-input>
          </el-col>
          <el-col :span="6">
            公告类型:
            <el-select v-model="searchValue.type">
              <el-option v-for="item in types"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button round size="mini" type="success" icon="el-icon-search" @click="initSysMsg">查询</el-button>
            <el-button round size="mini" type="warning" icon="el-icon-refresh" @click="resetSearchValue">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div style="margin-top: 10px">
      <el-card style="width: 98%;margin: 1% 1%" shadow="always">
        <div style="display: flex;justify-content: space-between;align-items: center">
          <div>
            <el-button size="mini"  icon="fa fa-plus" type="primary" style="padding: 8px 8px" @click="showAddView">&nbsp;添加</el-button>
            <el-button size="mini" icon="fa fa-trash-o" type="danger" style="padding: 8px 8px" :disabled="this.multipleSelection.length===0">&nbsp;删除</el-button>
          </div>
          <el-tooltip effect="dark" content="刷新" placement="top" popper-class="myPopper">
            <el-button size="mini" icon="el-icon-refresh" @click="initSysMsg"></el-button>
          </el-tooltip>
        </div>
        <el-table
            :data="sysMsgs"
            style="width: 100%;margin-top: 10px"
            stripe
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="id"
              label="序号"
              width="55">
          </el-table-column>
          <el-table-column
              prop="title"
              label="公告标题"
              width="350">
          </el-table-column>
          <el-table-column
              label="公告类型"
              width="120">
            <template slot-scope="scope">
              <el-tag size="mini" type="success" style="border-radius: 4px" v-if="!scope.row.type">公告</el-tag>
              <el-tag size="mini" type="warning" style="border-radius: 4px" v-else>通知</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="enabled"
              label="状态"
              width="150">
            <template slot-scope="scope">
              <el-switch
                  v-model="scope.row.enabled"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="enabledChange(scope.row)">
              </el-switch>
<!--              <el-tag size="mini" type="success" style="border-radius: 4px" v-if="scope.row.enabled">正常</el-tag>-->
<!--              <el-tag size="mini" type="danger" style="border-radius: 4px" v-else>关闭</el-tag>-->
            </template>
          </el-table-column>
          <el-table-column
              prop="creator"
              label="创建者"
              width="120">
          </el-table-column>
          <el-table-column
              prop="gmtCreate"
              label="创建时间"
              width="200">
          </el-table-column>
          <el-table-column
              label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showEditView(scope.row)" icon="fa fa-edit" style="padding: 4px 5px">&nbsp;编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteSysMsg" icon="fa fa-remove" style="padding: 4px 5px">&nbsp;删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: flex-end;margin-top: 10px">
          <el-pagination
              background
              @current-change="currentChange"
              @size-change="sizeChange"
              layout="sizes, prev, pager, next, jumper, ->, total"
              :total="total">
          </el-pagination>
        </div>
      </el-card>
      <el-dialog
          :title="formTitle"
          fullscreen
          modal
          :visible.sync="dialogVisible">
        <el-form :rules="rules" ref="sysMsg" :model="sysMsgForm" label-width="100px">
          <el-form-item label="公告标题" prop="title">
            <el-input style="width: 500px;" v-model="sysMsgForm.title"></el-input>
          </el-form-item>
          <el-form-item label="公告类型" prop="type">
            <el-select style="margin-left: -1px" v-model="sysMsgForm.type">
              <el-option v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公告内容" prop="content">
            <mavon-editor v-model="sysMsgForm.content"/>
          </el-form-item>
          <el-form-item label="公告状态" prop="enabled">
            <el-radio-group v-model="sysMsgForm.enabled">
              <el-radio :label="true">正常</el-radio>
              <el-radio :label="false">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doAddOrUpdateSysMsg">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SysMessage",
    data() {
      return {
        types: [
          {
            label: '公告',
            value: false
          },
          {
            label: '通知',
            value: true
          }
        ],
        searchValue: {
          title: '',
          creator: '',
          type: null
        },
        sysMsgs: [],
        total: 0,
        currentPage: 1,
        size: 10,
        multipleSelection: [],
        sysMsgForm: {
          id: null,
          title: '',
          content: '',
          type: false,
          enabled: true
        },
        formTitle: '',
        dialogVisible: false,
        rules: {
          title: [{required: true, message: '请输入公告标题', trigger: 'blur'}],
          content: [{required: true, message: '请输入公告内容', trigger: 'blur'}]
        }
      }
    },
    mounted() {
      this.initSysMsg();
    },
    methods: {
      enabledChange(data) {
        this.$putRequest('/system/cfg/system/message',data).then(res=>{
          if(res) {
            this.initSysMsg();
          }
        })
      },
      doAddOrUpdateSysMsg() {
        if(this.sysMsgForm.id) {
          this.$refs['sysMsg'].validate(valid=>{
            if(valid){
              this.$putRequest('/system/cfg/system/message',this.sysMsgForm).then(res=>{
                if(res){
                  this.dialogVisible = false;
                  this.initSysMsg();
                }
              })
            }
          })
        } else {
          this.$refs.sysMsg.validate(valid=>{
            if(valid){
              this.$postRequest('/system/cfg/system/message',this.sysMsgForm).then(res=>{
                if(res){
                  this.dialogVisible = false;
                  this.initSysMsg();
                }
              })
            }
          })
        }
      },
      showEditView(data) {
        this.formTitle = '编辑系统公告';
        this.sysMsgForm = data;
        this.dialogVisible = true;
      },
      showAddView() {
        this.formTitle = '添加系统公告';
        this.sysMsgForm = {
          id: null,
          title: '',
          content: '',
          type: false,
          enabled: true
        };
        this.dialogVisible = true;
      },
      deleteMany() {
        this.$confirm('确定删除[' + this.multipleSelection.length + ']条公告信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = '?';
          this.multipleSelection.forEach(item=>{
            ids += 'ids=' + item.id + '&';
          });
          this.$deleteRequest('/system/cfg/system/message/' + ids).then(res => {
            if (res) {
              this.initSysMsg();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteSysMsg(data) {
        this.$confirm('确定删除该公告信息吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$deleteRequest('/system/cfg/system/message/'+data.id).then(res=>{
            if(res){
              this.initSysMsg();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      resetSearchValue() {
        this.searchValue = {
          title: '',
              creator: '',
              type: null
        }
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
      initSysMsg() {
        let url = '/system/cfg/system/message/list?currentPage='+this.currentPage+"&size="+this.size;
        if(this.searchValue.title) {
          url += "&title=" + this.searchValue.title;
        }
        if(this.searchValue.creator) {
          url += "&creator=" + this.searchValue.creator;
        }
        if(this.searchValue.type) {
          url += "&type=" + this.searchValue.type;
        }
        this.$getRequest(url).then(res=>{
          if(res) {
            this.sysMsgs = res.data;
            this.total = res.total;
          }
        });
        this.$getRequest('/system/cfg/system/message').then(res=>{
          if(res) {
            let message = "";
            res.forEach(item=>{
              if(!item.type) {
                message += "&nbsp;&nbsp;&nbsp;<span style='color: red'>系统公告:</span>" + "&nbsp;&nbsp;" + item.title + "&nbsp;&nbsp;" + item.content + "&nbsp;&nbsp;&nbsp;";
              } else {
                message += "&nbsp;&nbsp;&nbsp;<span style='color: #E6A23C'>系统通知:</span>" + "&nbsp;&nbsp;" + item.title + "&nbsp;&nbsp;" + item.content + "&nbsp;&nbsp;&nbsp;";
              }
            })
            this.$store.commit('initCircleSysMsgs', message === "" ? "<span style='color:black'>暂无公告</span>": message);
          }
        })
      }
    }
  }
</script>

<style scoped>
  .el-col{
    font-size: 13px;
  }
  .el-col .el-input,.el-select {
    margin-left: 5px;
  }
</style>
