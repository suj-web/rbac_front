<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input style="width: 300px;margin-right: 10px"
                    prefix-icon="el-icon-search"
                    clearable
                    v-model="empName"
                    @keydown.enter.native="initEmps"
                    :disabled="showAdvanceSearchVisible"
                    @clear="initEmps"
                    placeholder="请输入员工姓名进行搜索..."></el-input>
          <el-button icon="el-icon-search" type="primary" @click="initEmps" :disabled="showAdvanceSearchVisible">搜索</el-button>
          <el-button type="primary" @click="showAdvanceSearchVisible = !showAdvanceSearchVisible;advanceSearch=!advanceSearch">
            <i :class="showAdvanceSearchVisible? 'fa fa-angle-double-up':'fa fa-angle-double-down'" aria-hidden="true"></i>
            高级搜索
          </el-button>
        </div>
        <div>
          <el-button type="success" icon="el-icon-refresh"
                     @click="initEmps"></el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible" style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding:5px;margin: 10px 0px">
        <el-row>
          <el-col :span="5">
            政治面貌:
            <el-select clearable v-model="searchValue.politicId" size="mini" style="width: 130px" placeholder="政治面貌">
              <el-option
                  v-for="item in politicsstatus"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            民族:
            <el-select clearable v-model="searchValue.nationId" size="mini" style="width: 130px" placeholder="民族">
              <el-option
                  v-for="item in nations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职位:
            <el-select clearable v-model="searchValue.positionId" size="mini" style="width: 130px" placeholder="职位">
              <el-option
                  v-for="item in positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            职称:
            <el-select clearable v-model="searchValue.jobLevelId" size="mini" style="width: 150px" placeholder="职位">
              <el-option
                  v-for="item in joblevels"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="7">
            聘用形式:
            <el-radio-group v-model="searchValue.engageForm">
              <el-radio label="劳动合同">劳动合同</el-radio>
              <el-radio label="劳务合同">劳务合同</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px;">
          <el-col :span="4" style="display: inline-flex;align-items: center;">
            所属部门:&nbsp;
            <el-select size="mini" style="width:130px;" v-model="searchValue.departmentId" clearable placeholder="选择部门">
              <el-option v-for="item in allDeps"
                         :label="item.name"
                         :value="item.id"
                         :key="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            入职日期:
            <el-date-picker
                style="width: 240px;"
                v-model="searchValue.beginDateScope"
                size="mini"
                type="daterange"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
          <el-col :span="5">
            在职状态:
            <el-select clearable v-model="searchValue.workState" size="mini" style="width: 150px" placeholder="在职状态">
              <el-option
                  v-for="item in workStateOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            员工类型:
            <el-select clearable v-model="searchValue.status" size="mini" style="width: 150px" placeholder="员工类型">
              <el-option
                  v-for="item in statusOptions"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button size="mini" @click="cancelAdvanceSearch">取消</el-button>
            <el-button @click="initEmps" type="primary" icon="el-icon-search" size="mini">搜索</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
    <div>
      <el-table
          :data="emps"
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
            prop="name"
            label="姓名"
            fixed
            align="left"
            width="90">
        </el-table-column>
        <el-table-column
            prop="workId"
            label="工号"
            align="left"
            width="85">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            width="85">
        </el-table-column>
        <el-table-column
            prop="birthday"
            label="出生日期"
            width="95">
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
            prop="nation.name"
            label="民族"
            width="70">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            label="籍贯"
            width="200">
        </el-table-column>
        <el-table-column
            prop="politicsStatus.name"
            label="政治面貌"
            width="120">
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
            prop="joblevel.name"
            label="职称"
            width="100">
        </el-table-column>
        <el-table-column
            prop="position.name"
            label="职位"
            width="150">
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
          <template slot-scope="scope">
            <el-tag size="mini" type="primary" v-if="scope.row.workState==='在职'">{{scope.row.workState}}</el-tag>
            <el-tag size="mini" type="danger" v-else>{{scope.row.workState}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="员工类型"
            align="left"
            width="70">
          <template slot-scope="scope">
            <el-tag size="mini" type="warning" v-if="scope.row.status==='试用'">{{scope.row.status}}</el-tag>
            <el-tag size="mini" type="primary" v-else>{{scope.row.status}}</el-tag>
          </template>
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
        <el-table-column
            label="操作"
            fixed="right"
            width="180">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="updateEmp(scope.row, 1)">
              <i class="el-icon-edit">转正</i>
            </el-button>
            <el-button type="text" size="mini" @click="updateEmp(scope.row, 2)">
              <i class="el-icon-edit-outline">办理离职</i>
            </el-button>
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
  </div>
</template>

<script>
export default {
  name: "PerEmp",
  data(){
    return {
      advanceSearch: false,
      searchValue:{
        nationId: null,
        politicId: null,
        departmentId: null,
        jobLevelId: null,
        positionId: null,
        engageForm: '',
        beginDateScope: null,
        workState: '',
        status: ''
      },
      workStateOptions: [
        {
          name: '在职'
        },
        {
          name: '离职'
        }
      ],
      statusOptions: [
        {
          name: '试用'
        },
        {
          name: '正式'
        }
      ],
      showAdvanceSearchVisible: false,
      headers:{
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      emps: [],
      loading: false,
      total: 0,
      currentPage: 1,
      size: 10,
      empName: '',
      dialogVisible: false,
      nations:[],
      joblevels:[],
      politicsstatus:[],
      positions:[],
      tiptopDegrees:['博士','硕士','本科','大专','高中','初中','小学','其他'],
      allDeps:[]
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
    this.initPositions();
  },
  methods:{
    updateEmp(data, tag) {
      if(1 === tag && !this.$store.getters.checkPermissionFlag('PerEmpPositive')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      if(2 === tag && !this.$store.getters.checkPermissionFlag('PerEmpResion')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      let emp = {};
      if((data.workState==='离职' || data.status==='正式') && 1 === tag){
        this.$message.warning('该员工不可操作');
        return;
      }
      if(1 === tag) {
        if(new Date(data.conversionTime).getTime() > new Date().getTime()) {
          this.$message.warning('未到转正日期');
          return;
        } else {
          Object.assign(emp, data)
          emp.status = '正式';
        }
      } else {
        Object.assign(emp, data)
        emp.workState = '离职';
      }
      this.$putRequest('/personnel/emp/',emp).then(res=>{
        if(res) {
          this.initEmps();
        }
      })
    },
    cancelAdvanceSearch() {
      this.searchValue = {
        nationId: null,
        politicId: null,
        departmentId: null,
        jobLevelId: null,
        positionId: null,
        engageForm: '',
        beginDateScope: null
      };
    },


    initPositions(){
      this.$getRequest('/personnel/emp/positions').then(res=>{
        if(res){
          this.positions = res;
        }
      })
    },
    initData(){
      if(!window.sessionStorage.getItem('nations')){
        this.$getRequest('/personnel/emp/nations').then(res=>{
          if(res){
            this.nations = res;
            window.sessionStorage.setItem('nations',JSON.stringify(res));
          }
        })
      } else{
        this.nations = JSON.parse(window.sessionStorage.getItem('nations'));
      }
      if(!window.sessionStorage.getItem('joblevels')){
        this.$getRequest('/personnel/emp/joblevels').then(res=>{
          if(res){
            this.joblevels = res;
            window.sessionStorage.setItem('joblevels',JSON.stringify(res));
          }
        })
      } else{
        this.joblevels = JSON.parse(window.sessionStorage.getItem('joblevels'));
      }
      if(!window.sessionStorage.getItem('politicsstatus')){
        this.$getRequest('/personnel/emp/politicsstatus').then(res=>{
          if(res){
            this.politicsstatus = res;
            window.sessionStorage.setItem('politicsstatus',JSON.stringify(res));
          }
        })
      } else{
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem('politicsstatus'));
      }

      if(!window.sessionStorage.getItem('allDeps')){
        this.$getRequest('/personnel/emp/deps').then(res=>{
          if(res){
            this.allDeps = res;
            window.sessionStorage.setItem('allDeps',JSON.stringify(res));
          }
        })
      } else{
        this.allDeps = JSON.parse(window.sessionStorage.getItem('allDeps'));
      }
    },
    sizeChange(size){
      this.size = size;
      this.initEmps();
    },
    currentChange(currentPage){
      this.currentPage = currentPage;
      this.initEmps();
    },
    initEmps(){
      this.loading = true;
      let url = '/personnel/emp/?currentPage='+this.currentPage+"&size="+this.size;
      if(this.advanceSearch){
        if(this.searchValue.politicId){
          url += '&politicId='+this.searchValue.politicId;
        }
        if(this.searchValue.nationId){
          url += '&nationId='+this.searchValue.nationId;
        }
        if(this.searchValue.positionId){
          url += '&positionId='+this.searchValue.positionId;
        }
        if(this.searchValue.jobLevelId){
          url += '&jobLevelId='+this.searchValue.jobLevelId;
        }
        if(this.searchValue.engageForm){
          url += '&engageForm='+this.searchValue.engageForm;
        }
        if(this.searchValue.departmentId){
          url += '&departmentId='+this.searchValue.departmentId;
        }
        if(this.searchValue.beginDateScope){
          url += '&beginDateScope='+this.searchValue.beginDateScope;
        }
        if(this.searchValue.workState) {
          url += '&workState='+this.searchValue.workState;
        }
        if(this.searchValue.status) {
          url += '&status='+this.searchValue.status;
        }
      } else {
        url += '&name='+this.empName;
      }

      this.$getRequest(url).then(res=>{
        if(res){
          this.emps = res.data;
          this.loading = false;
          this.total = res.total;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
