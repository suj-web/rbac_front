<template>
  <div>
    <transition name="slide-fade">
      <el-card v-show="showSearchView">
        <el-row>
          <el-col :span="6">
            调前部门:
            <el-select @change="initEmpRemoveRecords" v-model="searchValue.beforeDepartmentId" clearable placeholder="选择部门">
              <el-option v-for="item in allDeps"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            调后部门:
            <el-select @change="initEmpRemoveRecords" v-model="searchValue.afterDepartmentId" clearable placeholder="选择部门">
              <el-option v-for="item in allDeps"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            调前职位:
            <el-select @change="initEmpRemoveRecords" v-model="searchValue.beforePositionId" clearable placeholder="选择职位">
              <el-option v-for="item in positions"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            调后职位:
            <el-select @change="initEmpRemoveRecords" v-model="searchValue.afterPositionId" clearable placeholder="选择职位">
              <el-option v-for="item in positions"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="6">
            时间:
            <el-date-picker
                v-model="searchValue.localDate"
                @change="initEmpRemoveRecords"
                type="month"
                placeholder="选择月份">
            </el-date-picker>
          </el-col>
        </el-row>
      </el-card>
    </transition>
    <el-card style="margin-top: 20px">
      <el-button-group style="display: flex;justify-content: flex-end">
        <el-tooltip effect="dark" content="隐藏/显示搜索" placement="top">
          <el-button size="default" icon="fa fa-search" @click="showSearchView = !showSearchView"></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="刷新" placement="top">
          <el-button size="default" icon="el-icon-refresh" @click="initEmpRemoveRecords"></el-button>
        </el-tooltip>
      </el-button-group>
      <div v-if="empRemoveRecords.length>0">
        <div v-for="(item, index) in empRemoveRecords" :key="index">
          <el-descriptions class="margin-top" :column="4">
            <el-descriptions-item label="工号">{{item.employee.workId}}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{item.employee.name}}</el-descriptions-item>
            <el-descriptions-item label="调前部门">
            <span v-for="(dep, depi) in allDeps" :key="depi">
              <el-tag size="mini" type="warning" v-if="dep.id===item.beforeDepartmentId">{{dep.name}}</el-tag>
            </span>
            </el-descriptions-item>
            <el-descriptions-item label="调后部门">
            <span v-for="(dep, depj) in allDeps" :key="depj">
              <el-tag size="mini" type="success" v-if="dep.id===item.afterDepartmentId">{{dep.name}}</el-tag>
            </span>
            </el-descriptions-item>
            <el-descriptions-item label="调前职位">
            <span v-for="(pos, posi) in positions" :key="posi">
              <el-tag size="mini" type="warning" v-if="pos.id===item.beforePositionId">{{pos.name}}</el-tag>
            </span>
            </el-descriptions-item>
            <el-descriptions-item label="调后职位">
            <span v-for="(pos, posj) in positions" :key="posj">
              <el-tag size="mini" type="success" v-if="pos.id===item.afterPositionId">{{pos.name}}</el-tag>
            </span>
            </el-descriptions-item>
            <el-descriptions-item label="调动时间">{{item.removeDate}}</el-descriptions-item>
            <el-descriptions-item label="调动原因">{{item.reason}}</el-descriptions-item>
          </el-descriptions>
          <el-divider></el-divider>
        </div>
        <div style="display: flex;justify-content: flex-end;margin-top: 10px">
          <el-pagination
              background
              @current-change="currentChange"
              @size-change="sizeChange"
              layout="sizes, prev, pager, next, jumper, ->, total"
              :total="total">
          </el-pagination>
        </div>
      </div>
      <div v-else>
        <el-empty :image-size="200"></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "EmpRemove",
  props: {
    allDeps: {
      type: Array,
      default() {
        return [];
      }
    },
    positions: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      showSearchView: true,
      searchValue: {
        beforeDepartmentId: null,
        afterDepartmentId: null,
        beforePositionId: null,
        afterPositionId: null,
        localDate: null
      },
      empRemoveRecords: [],
      total: 0,
      currentPage: 1,
      size: 10
    }
  },
  watch: {
    allDeps(val) {
      if(val) {
        this.initEmpRemoveRecords();
      }
    },
    positions(val) {
      if(val) {
        this.initEmpRemoveRecords();
      }
    }
  },
  mounted() {
    this.initEmpRemoveRecords();
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.initEmpRemoveRecords();
    },
    sizeChange(val) {
      this.size = val;
      this.initEmpRemoveRecords();
    },
    initEmpRemoveRecords() {
      let url = '/statistics/record/employee/remove?currentPage='+this.currentPage+"&size="+this.size;
      if(this.searchValue.localDate) {
        let year = this.searchValue.localDate.getFullYear();
        let month = this.searchValue.localDate.getMonth() + 1;
        if(month > 0 && month < 10) {
          month = "0" + month;
        }
        url += "&localDate=" + year + "-" + month;
      }
      if(this.searchValue.beforeDepartmentId) {
        url += "&beforeDepartmentId=" + this.searchValue.beforeDepartmentId;
      }
      if(this.searchValue.afterDepartmentId) {
        url += "&afterDepartmentId=" + this.searchValue.afterDepartmentId;
      }
      if(this.searchValue.beforePositionId) {
        url += "&beforePositionId=" + this.searchValue.beforePositionId;
      }
      if(this.searchValue.afterPositionId) {
        url += "&afterPositionId=" + this.searchValue.afterPositionId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.empRemoveRecords = res.data;
          this.total = res.total;
        }
      })
    }
  }
}
</script>

<style scoped>
.margin-top {
  margin-top: 20px;
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
</style>
