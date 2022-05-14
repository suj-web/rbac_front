<template>
  <div>
    <div>
      <transition name="slide-fade">
        <el-card v-show="showSearchView">
        <el-row style="font-size: 13px!important;">
          <el-col :span="6">
            系统模块:
            <el-input clearable v-model="searchValue.model" size="small" placeholder="系统模块" style="width: 200px"></el-input>
          </el-col>
          <el-col :span="6">
            操作人员:
            <el-input clearable v-model="searchValue.operator" placeholder="操作人员" style="width: 200px"></el-input>
          </el-col>
          <el-col :span="6">
            操作类型:
            <el-select clearable v-model="searchValue.type" placeholder="请选择" style="width: 200px;margin-left: 10px">
              <el-option
                  v-for="item in operTypes"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            操作状态:
            <el-select clearable v-model="searchValue.result" placeholder="请选择" style="width: 200px">
              <el-option
                  v-for="item in results"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="font-size: 13px!important;">
          <el-col :span="8">
            操作时间:
            <el-date-picker
                v-model="searchValue.operDateScope"
                type="daterange"
                value-format="yyyy-MM-dd"
                style="margin-left: 10px;width: 240px"
                :unlink-panels="true"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
            </el-date-picker>
          </el-col>
          <el-col :span="6" :offset="10">
            <el-button size="mini" type="primary" icon="el-icon-search" round @click="initOperLogs">搜索</el-button>
            <el-button size="mini" type="warning" icon="el-icon-refresh" round @click="resetSearchValue">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
      </transition>
    </div>
    <div>
      <el-card style="margin-top: 10px">
        <div style="display: flex;justify-content: space-between;">
          <div>
            <el-button style="padding:6px 8px" type="danger" icon="el-icon-delete" :disabled="this.multipleSelection.length===0" @click="deleteMany">批量删除</el-button>
            <el-button style="padding:6px 8px" type="warning" @click="exportData" icon="fa fa-download">&nbsp;导出</el-button>
          </div>
          <el-button-group>
            <el-tooltip effect="dark" content="隐藏/显示搜索" placement="top" popper-class="myPopper">
              <el-button class="group_button" icon="fa fa-search" @click="showSearchView = !showSearchView"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top" popper-class="myPopper">
              <el-button class="group_button" icon="el-icon-refresh" @click="initOperLogs"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="列" placement="top" popper-class="myPopper">
              <el-popover
                placement="bottom"
                trigger="click"
                popper-class="my-popover"
                width="100">
                <div>
                  <el-checkbox v-model="showField.showModel">系统模块</el-checkbox>
                  <el-checkbox v-model="showField.showType">操作类型</el-checkbox>
                  <el-checkbox v-model="showField.showOperator">操作人员</el-checkbox>
                  <el-checkbox v-model="showField.showIp">主机</el-checkbox>
                  <el-checkbox v-model="showField.showResult">操作结果</el-checkbox>
                  <el-checkbox v-model="showField.showGmtCreate">操作时间</el-checkbox>
                  <el-checkbox v-model="showField.showOperation">操作</el-checkbox>
                </div>
                <el-button class="group_button" slot="reference" style="border-top-left-radius: 0;border-bottom-left-radius: 0;" icon="fa fa-th">
                  <i class="fa fa-caret-down" aria-hidden="true" style="margin-left: 5px"></i>
                </el-button>
              </el-popover>
            </el-tooltip>
          </el-button-group>
        </div>
        <el-table
            :data="operLogs"
            border
            stripe
            style="width: 100%;margin-top: 10px"
            @selection-change="handleSelectionChange">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column
              prop="id"
              label="日志编号"
              sortable
              width="100">
          </el-table-column>
          <el-table-column
              prop="model"
              label="系统模块"
              v-if="showField.showModel"
              width="200"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="type"
              label="操作类型"
              v-if="showField.showType"
              width="140">
          </el-table-column>
          <el-table-column
              prop="operator"
              sortable
              label="操作人员"
              v-if="showField.showOperator"
              width="150">
          </el-table-column>
          <el-table-column
              prop="ip"
              label="主机"
              v-if="showField.showIp"
              width="120">
          </el-table-column>
          <el-table-column
              label="操作结果"
              v-if="showField.showResult"
              width="120">
            <template slot-scope="scope">
              <el-tag size="mini" v-if="scope.row.result===200" type="success">成功</el-tag>
              <el-tag size="mini" v-else type="danger">失败</el-tag>
            </template>
          </el-table-column>
          <el-table-column
              prop="gmtCreate"
              label="操作时间"
              v-if="showField.showGmtCreate"
              :formatter="dateFormat"
              width="200">
          </el-table-column>
          <el-table-column
              v-if="showField.showOperation"
              label="操作">
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteOperLog(scope.row.id)">删除</el-button>
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
    </div>
  </div>
</template>

<script>
export default {
  name: "SysLog",
  data() {
    return {
      operTypes: ['添加','修改','删除','查询','导入','导出','备份','恢复','初始化','强退'],
      results: [
        {
          value: 200,
          label: '成功'
        },
        {
          value: 500,
          label: '失败'
        }
      ],
      searchValue: {
        model: '',
        operator: '',
        type: '',
        result: null,
        operDateScope: null
      },
      operLogs: [],
      total: 0,
      currentPage: 1,
      size: 10,
      multipleSelection: [],
      showSearchView: true,
      showField: {
        showModel: true,
        showType: true,
        showOperator: true,
        showIp: true,
        showResult: true,
        showGmtCreate: true,
        showOperation: true
      }
    }
  },
  mounted() {
    this.initOperLogs();
  },
  methods: {
    resetSearchValue() {
      this.searchValue = {
        model: '',
        operator: '',
        type: '',
        result: null,
        operDateScope: null
      };
    },
    exportData() {
      this.$downloadRequest('/system/log/export');
    },
    deleteMany() {
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条操作日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item=>{
          ids += 'ids=' + item.id + '&';
        });
        this.$deleteRequest('/system/log/' + ids).then(res => {
          if (res) {
            this.initOperLogs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteOperLog(id) {
      this.$confirm('此操作将永久删除【' + id + '】操作日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteRequest('/system/log/' + id).then(res => {
          if (res) {
            this.initOperLogs();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    currentChange(val) {
      this.currentPage = val;
      this.initOperLogs();
    },
    sizeChange(val) {
      this.size = val;
      this.initOperLogs();
    },
    dateFormat(row, column) {
      var date = row[column.property];
      if (date === undefined) {
        return "";
      }
      return this.$moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    initOperLogs() {
      let url = '/system/log/?currentPage='+this.currentPage+"&size="+this.size;
      if(this.searchValue.model) {
        url += '&model=' + this.searchValue.model;
      }
      if(this.searchValue.operator) {
        url += '&operator=' + this.searchValue.operator;
      }
      if(this.searchValue.type) {
        url += '&type=' + this.searchValue.type;
      }
      if(this.searchValue.result) {
        url += '&result=' + this.searchValue.result;
      }
      if(this.searchValue.operDateScope) {
        url += '&operDateScope=' + this.searchValue.operDateScope;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.operLogs = res.data;
          this.total = res.total;
        }
      })
    }
  }
}
</script>
<style>
.el-popover.my-popover{
  min-width: 100px;
}
.myPopper.el-tooltip__popper {
  background: #6c6c6c;
  padding: 3px 6px;
  height: 15px;
  line-height: 15px;
}
.myPopper.el-tooltip__popper.is-dark {
  background: #6c6c6c;
}
.el-tooltip__popper[x-placement^="top"] .popper__arrow:after, .el-tooltip__popper[x-placement^="top"] .popper__arrow {
  border-top-color: #6c6c6c;
  opacity: 1;
}
</style>
<style scoped>
  /*.el-col .el-input,.el-select{*/
  /*  margin-left: 10px;*/
  /*}*/
  .el-card__body .el-row {
    margin-top: 10px;
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .8s ease;
  }
  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  ::v-deep .el-button-group .el-button {
    padding: 6px 12px;
    height: 30px;
    width: 46px;
  }
  .group_button {
    padding: 6px 12px;
    height: 34px;
    width: 46px;
  }

</style>
