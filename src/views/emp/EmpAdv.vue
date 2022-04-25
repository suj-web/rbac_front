<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input style="width: 300px;margin-right: 10px"
                    prefix-icon="el-icon-search"
                    clearable
                    v-model="searchValue.name"
                    @keydown.enter.native="initEmpData"
                    @clear="initEmpData"
                    placeholder="请输入员工姓名进行搜索..."></el-input>
          <el-select @clear="initEmpData" clearable @change="initEmpData" size="mini" style="width: 300px;margin-right: 10px;" v-model="searchValue.depId" placeholder="所属部门">
            <el-option v-for="item in allDeps"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-button icon="el-icon-search" type="primary" @click="initEmpData">搜索</el-button>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="showAddEmpDataView">添加员工</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-table
          :data="empData"
          stripe
          border
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%;margin-top:10px">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="employee.workId"
            label="工号"
            fixed
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="employee.name"
            label="姓名"
            width="90">
        </el-table-column>
        <el-table-column
            label="人事资料存档率"
            width="90">

        </el-table-column>
        <el-table-column
            label="身份证正反面"
            width="90">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.idCardPath"></i>
            <i class="el-icon-minus" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="合同"
            width="90">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.contractPath"></i>
            <i class="el-icon-minus" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="入职简历"
            width="90">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.resumePath"></i>
            <i class="el-icon-minus" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="offer"
            width="90">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.offerPath"></i>
            <i class="el-icon-minus" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="体检报告"
            width="90">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.medicalReportPath"></i>
            <i class="el-icon-minus" v-else></i>
          </template>
        </el-table-column>
        <el-table-column
            label="学历证书"
            width="90">
          <template slot-scope="scope">
            <i class="el-icon-check" v-if="scope.row.degreeCertificatePath"></i>
            <i class="el-icon-minus" v-else></i>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmpAdv",
  data() {
    return {
      allDeps: [],
      searchValue: {
        name: '',
        depId: null
      },
      empData: [],
      currentPage: 1,
      size: 10,
      total: 0
    }
  },
  mounted() {
    this.initAllDeps();
    this.initEmpData();
  },
  methods: {
    initEmpData() {
      let url = '/employee/advanced/?currentPage='+this.currentPage+'&size='+this.size;
      if(this.searchValue.name) {
        url += '&name='+this.searchValue.name;
      }
      if(this.searchValue.depId){
        url += '&depId='+this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.empData = res.data;
          this.total =res.total;
        }
      })
    },
    initAllDeps() {
      this.$getRequest('/employee/advanced/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
