<template>
  <div>
    <el-table
        :data="emps"
        stripe
        border
        style="width: 100%;margin-top:10px">
      <el-table-column
          prop="workId"
          label="工号"
          fixed
          align="left"
          width="85">
      </el-table-column>
      <el-table-column
          prop="name"
          label="姓名"
          align="left"
          width="90">
      </el-table-column>
      <el-table-column
          prop="gender"
          label="性别"
          width="85">
      </el-table-column>
      <el-table-column
          label="出生日期"
          width="95">
        <template slot-scope="scope">
          <el-link style="font-size: 12px!important;" type="danger" :underline="false">{{scope.row.birthday}}</el-link>
        </template>
      </el-table-column>
      <el-table-column
          prop="idCard"
          label="身份证号"
          width="150">
      </el-table-column>
      <el-table-column
          prop="wedLock"
          label="婚姻状况"
          width="70">
      </el-table-column>
      <el-table-column
          prop="nativePlace"
          label="籍贯"
          width="200">
      </el-table-column>
      <el-table-column
          prop="email"
          label="电子邮件"
          align="left"
          width="180">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="电话号码"
          align="left"
          width="100">
      </el-table-column>
      <el-table-column
          prop="address"
          label="联系地址"
          width="300">
      </el-table-column>
      <el-table-column
          prop="department.name"
          label="所属部门"
          align="left"
          width="100">
      </el-table-column>
      <el-table-column
          prop="engageForm"
          label="聘用形式"
          align="left"
          width="100">
      </el-table-column>
      <el-table-column
          prop="tiptopDegree"
          label="最高学历"
          align="left"
          width="80">
      </el-table-column>
      <el-table-column
          prop="school"
          label="学校"
          align="left"
          width="150">
      </el-table-column>
      <el-table-column
          prop="specialty"
          label="专业"
          align="left"
          width="150">
      </el-table-column>
      <el-table-column
          prop="workState"
          label="在职状态"
          align="left"
          width="70">
      </el-table-column>
      <el-table-column
          prop="beginDate"
          label="入职日期"
          align="left"
          width="95">
      </el-table-column>
      <el-table-column
          prop="conversionTime"
          label="转正日期"
          align="left"
          width="95">
      </el-table-column>
      <el-table-column
          prop="beginContract"
          label="合同起始日期"
          align="left"
          width="95">
      </el-table-column>
      <el-table-column
          prop="endContract"
          label="合同截止日期"
          align="left"
          width="96">
      </el-table-column>
      <el-table-column
          label="合同期限"
          align="left"
          width="100">
        <template slot-scope="scope">
          <el-tag>{{scope.row.contractTerm}}</el-tag>年
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
  </div>
</template>

<script>
export default {
  name: "EmpBirthday",
  data() {
    return {
      emps: [],
      currentPage: 1,
      size: 10,
      total: 0
    }
  },
  mounted() {
    this.initEmps();
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.initEmps();
    },
    sizeChange(val) {
      this.size = val;
      this.initEmps();
    },
    initEmps() {
      this.$getRequest('/home/remind/birthday/remind?currentPage='+this.currentPage+"&size="+this.size).then(res=>{
        if(res) {
          this.emps = res.data;
          this.total = res.total;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
