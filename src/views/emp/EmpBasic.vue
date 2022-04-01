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
          <el-upload action="/employee/basic/import"
                     :headers="headers"
                     :show-file-list="false"
                     :before-upload="beforeUpload"
                     :on-success="onSuccess"
                     :on-error="onError"
                     :disabled="importDataDisabled"
                     style="display: inline-flex;margin-right: 10px">
            <el-button type="success" :icon="importDataBtnIcon" :disabled="importDataDisabled">
              {{importDataBtnText}}
            </el-button>
          </el-upload>
          <el-button type="success" @click="exportData" icon="fa fa-download">
            导出数据
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="showAddEmpView">添加员工</el-button>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="showAdvanceSearchVisible" style="border: 1px solid #409eff;border-radius: 5px;box-sizing: border-box;padding:5px;margin: 10px 0px">
        <el-row>
          <el-col :span="5">
            政治面貌:
            <el-select v-model="searchValue.politicId" size="mini" style="width: 130px" placeholder="政治面貌">
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
            <el-select v-model="searchValue.nationId" size="mini" style="width: 130px" placeholder="民族">
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
            <el-select v-model="searchValue.positionId" size="mini" style="width: 130px" placeholder="职位">
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
            <el-select v-model="searchValue.jobLevelId" size="mini" style="width: 150px" placeholder="职位">
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
          <el-col :span="7" style="display: inline-flex;align-items: center;">
            所属部门:
            <treeselect v-model="searchValue.departmentId" placeholder="所属部门" :normalizer="normalizer" style="width: 240px;margin-left: 5px;" :show-count="true" :options="allDeps" />
          </el-col>
          <el-col :span="10">
            入职日期:
            <el-date-picker
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
          <el-col :span="5" :offset="2">
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
            width="250">
          <template slot-scope="scope">
            <el-button style="padding: 3px" icon="el-icon-edit" size="mini" @click="showEditEmpView(scope.row)">编辑</el-button>
            <el-button style="padding: 3px" type="primary" icon="el-icon-view" size="mini">查看高级资料</el-button>
            <el-button style="padding: 3px" type="danger" icon="el-icon-delete" size="mini" @click="deleteEmp(scope.row)">删除</el-button>
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
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
      <div>
        <el-form ref="empForm" :model="emp" :rules="empRules">
          <el-row>
            <el-col :span="6">
              <el-form-item label="姓名:" prop="name">
                <el-input v-model="emp.name" prefix-icon="el-icon-edit" placeholder="请输入员工姓名" style="width: 150px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="性别:" prop="gender">
                <el-radio-group v-model="emp.gender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                    v-model="emp.birthday"
                    value-format="yyyy-MM-dd"
                    type="date"
                    size="mini"
                    style="width: 150px"
                    placeholder="出生日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="政治面貌:" prop="politicId">
                <el-select v-model="emp.politicId" size="mini" style="width: 200px" placeholder="政治面貌">
                  <el-option
                      v-for="item in politicsstatus"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="籍贯:" prop="nativePlace">
                <el-input v-model="emp.nativePlace" placeholder="请输入籍贯" prefix-icon="el-icon-edit" size="mini" style="width:150px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="民族:" prop="nationId">
                <el-select v-model="emp.nationId" size="mini" style="width: 150px" placeholder="民族">
                  <el-option
                      v-for="item in nations"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input v-model="emp.email" placeholder="请输入电子邮箱" size="mini" style="width:150px" prefix-icon="el-icon-message"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="联系地址" prop="address">
                <el-input v-model="emp.address" placeholder="请输入地址" size="mini" style="width: 200px" prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职位:" prop="positionId">
                <el-select v-model="emp.positionId" size="mini" style="width: 150px" placeholder="职位">
                  <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="职称:" prop="jobLevelId">
                <el-select v-model="emp.jobLevelId" size="mini" style="width: 150px" placeholder="职称">
                  <el-option
                      v-for="item in joblevels"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="电话号码:" prop="phone">
                <el-input v-model="emp.phone" placeholder="请输入电话号码" size="mini" style="width: 150px" prefix-icon="el-icon-phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="身份证号码:" prop="idCard">
                <el-input v-model="emp.idCard" placeholder="请输入身份证号码" size="mini" prefix-icon="el-icon-edit" style="width: 200px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="工号:" prop="workId">
                <el-input v-model="emp.workId" disabled placeholder="请输入工号" size="mini" style="width: 150px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="学历:" prop="tiptopDegree">
                <el-select v-model="emp.tiptopDegree" size="mini" style="width: 150px" placeholder="学历">
                  <el-option
                      v-for="item in tiptopDegrees"
                      :key="item"
                      :label="item"
                      :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毕业院校:" prop="school">
                <el-input v-model="emp.school" size="mini" style="width: 150px" prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="专业名称:" prop="specialty">
                <el-input v-model="emp.specialty" placeholder="请输入专业名称" size="mini" style="width: 200px" prefix-icon="el-icon-edit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="入职日期:" prop="beginDate">
                <el-date-picker
                    v-model="emp.beginDate"
                    value-format="yyyy-MM-dd"
                    size="mini"
                    style="width: 122px"
                    type="date"
                    placeholder="入职日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="转正日期:" prop="conversionTime">
                <el-date-picker
                    v-model="emp.conversionTime"
                    value-format="yyyy-MM-dd"
                    size="mini"
                    style="width: 125px"
                    type="date"
                    placeholder="转正日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合同起始日期:" prop="beginContract">
                <el-date-picker
                    v-model="emp.beginContract"
                    value-format="yyyy-MM-dd"
                    size="mini"
                    style="width: 130px"
                    type="date"
                    placeholder="合同起始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="合同截止日期:" prop="endContract">
                <el-date-picker
                    v-model="emp.endContract"
                    value-format="yyyy-MM-dd"
                    size="mini"
                    style="width: 170px"
                    type="date"
                    placeholder="合同截至日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="所属部门:" prop="departmentId">
                <treeselect v-model="emp.departmentId" placeholder="所属部门" :normalizer="normalizer" style="width: 240px" :show-count="true" :options="allDeps" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="聘用形式:" prop="engageForm">
                <el-radio-group v-model="emp.engageForm">
                  <el-radio label="劳动合同">劳动合同</el-radio>
                  <el-radio label="劳务合同">劳务合同</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="婚姻状况:" prop="wedLock">
                <el-radio-group v-model="emp.wedLock">
                  <el-radio label="已婚">已婚</el-radio>
                  <el-radio label="未婚">未婚</el-radio>
                  <el-radio label="离异">离异</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="doAddEmp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  export default {
    name: "EmpBasic",
    components: { Treeselect },
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
          beginDateScope: null
        },
        showAdvanceSearchVisible: false,
        headers:{
          Authorization: window.sessionStorage.getItem('tokenStr')
        },
        importDataDisabled: false,
        importDataBtnText: '导入数据',
        importDataBtnIcon: 'fa fa-upload',
        title: '',

        emps: [],
        loading: false,
        total: 0,
        currentPage: 1,
        size: 10,
        empName: '',
        dialogVisible: false,
        emp: {
          id: null,
          name: '',
          gender: '男',
          birthday: '',
          idCard: '',
          wedLock: '未婚',
          nationId: null,
          nativePlace: '',
          politicId: null,
          email: '',
          phone: '',
          address: '',
          departmentId: null,
          jobLevelId: null,
          positionId: null,
          engageForm: '',
          tiptopDegree: '',
          specialty: '',
          school: '',
          beginDate: '',
          workState: '在职',
          workId: '',
          contractTerm: null,
          conversionTime: '',
          notWorkDate: null,
          beginContract: '',
          endContract: '',
          workAge: null,
          salaryId: null,
        },
        nations:[],
        joblevels:[],
        politicsstatus:[],
        positions:[],
        tiptopDegrees:['博士','硕士','本科','大专','高中','初中','小学','其他'],
        allDeps:[],
        empRules: {
          name: [{required: true, message:'请输入员工姓名', trigger: 'blur'}],
          gender: [{required: true, message:'请选择员工性别', trigger: 'blur'}],
          birthday: [{required: true, message:'请输入员工出生日期', trigger: 'blur'}],
          idCard: [{required: true, message:'请输入身份证号码', trigger: 'blur'},
            {pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,message: '身份证号码格式不正确',trigger: 'blur'}],
          wedLock: [{required: true, message:'请输入婚姻状况', trigger: 'blur'}],
          nationId: [{required: true, message:'请输入民族', trigger: 'blur'}],
          nativePlace: [{required: true, message:'请输入籍贯', trigger: 'blur'}],
          politicId: [{required: true, message:'请输入政治面貌', trigger: 'blur'}],
          email: [{required: true, message:'请输入邮箱地址', trigger: 'blur'},
            {type: 'email',message: '邮箱地址格式不正确',trigger: 'blur'}],
          phone: [{required: true, message:'请输入电话号码', trigger: 'blur'}],
          address: [{required: true, message:'请输入员工地址', trigger: 'blur'}],
          departmentId: [{required: true, message:'请输入部门名称', trigger: 'blur'}],
          jobLevelId: [{required: true, message:'请输入职称', trigger: 'blur'}],
          positionId: [{required: true, message:'请输入职位', trigger: 'blur'}],
          engageForm: [{required: true, message:'请输入聘用形式', trigger: 'blur'}],
          tiptopDegree: [{required: true, message:'请输入学历', trigger: 'blur'}],
          specialty: [{required: true, message:'请输入专业', trigger: 'blur'}],
          school: [{required: true, message:'请输入毕业院校', trigger: 'blur'}],
          beginDate: [{required: true, message:'请输入入职日期', trigger: 'blur'}],
          workState: [{required: true, message:'请输入工作状态', trigger: 'blur'}],
          workId: [{required: true, message:'请输入工号', trigger: 'blur'}],
          contractTerm: [{required: true, message:'请输入合同期限', trigger: 'blur'}],
          // conversionTime: [{required: true, message:'请输入转正日期', trigger: 'blur'}],
          notWorkDate: [{required: true, message:'请输入离职日期', trigger: 'blur'}],
          beginContract: [{required: true, message:'请输入合同起始日期', trigger: 'blur'}],
          endContract: [{required: true, message:'请输入合同截至日期', trigger: 'blur'}],
          workAge: [{required: true, message:'请输入工龄', trigger: 'blur'}]
        }
      }
    },
    mounted() {
      this.initEmps();
      this.initData();
      this.initPositions();
    },
    methods:{
      normalizer(node) {
        return {
          label: node.name
        }
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
      onSuccess(){
        this.importDataBtnIcon = 'fa fa-upload';
        this.importDataBtnText = '导入数据';
        this.importDataDisabled = false;
        this.initEmps();
      },
      onError(){
        this.importDataBtnIcon = 'fa fa-upload';
        this.importDataBtnText = '导入数据';
        this.importDataDisabled = false;
      },
      beforeUpload(){
        this.importDataBtnIcon = 'el-icon-loading';
        this.importDataBtnText = '正在导入';
        this.importDataDisabled = true;
      },
      exportData(){
        this.$downloadRequest('/employee/basic/export');
        console.log("download");
      },
      showEditEmpView(data){
        this.title = '编辑员工信息';
        this.emp = data;
        this.initPositions();
        this.dialogVisible = true;
      },
      deleteEmp(data){
        this.$confirm('此操作将永久删除员工['+data.name+'], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$deleteRequest('/employee/basic/'+data.id).then(res=>{
            if(res){
              this.initEmps();
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      doAddEmp(){
        if(this.emp.id){
          this.$refs['empForm'].validate(valid=>{
            if(valid){
              this.$putRequest('/employee/basic/',this.emp).then(res=>{
                if(res){
                  this.dialogVisible = false;
                  this.visible = false;
                  this.initEmps();
                }
              })
            }
          })
        } else{
          this.$refs['empForm'].validate(valid=>{
            if(valid){
              this.$postRequest('/employee/basic/',this.emp).then(res=>{
                if(res){
                  this.dialogVisible = false;
                  this.visible = false;
                  this.initEmps();
                }
              })
            }
          })
        }
      },
      cancel(){
        this.dialogVisible = false;
        this.visible = false;
      },
      getMaxWorkId(){
        this.$getRequest('/employee/basic/maxWorkId').then(res=>{
          if(res){
            this.emp.workId = res.obj;
          }
        })
      },
      initPositions(){
        this.$getRequest('/employee/basic/positions').then(res=>{
          if(res){
            this.positions = res;
          }
        })
      },
      // 处理树形结构
      treeChange (arr) {
        return arr.map(item => {
          if (item.children && item.children.length > 0) {
            this.treeChange(item.children);
          } else {
            delete item.children;
          }
          return item;
        })
      },
      initData(){
        if(!window.sessionStorage.getItem('nations')){
          this.$getRequest('/employee/basic/nations').then(res=>{
            if(res){
              this.nations = res;
              window.sessionStorage.setItem('nations',JSON.stringify(res));
            }
          })
        } else{
          this.nations = JSON.parse(window.sessionStorage.getItem('nations'));
        }
        if(!window.sessionStorage.getItem('joblevels')){
          this.$getRequest('/employee/basic/joblevels').then(res=>{
            if(res){
              this.joblevels = res;
              window.sessionStorage.setItem('joblevels',JSON.stringify(res));
            }
          })
        } else{
          this.joblevels = JSON.parse(window.sessionStorage.getItem('joblevels'));
        }
        if(!window.sessionStorage.getItem('politicsstatus')){
          this.$getRequest('/employee/basic/politicsstatus').then(res=>{
            if(res){
              this.politicsstatus = res;
              window.sessionStorage.setItem('politicsstatus',JSON.stringify(res));
            }
          })
        } else{
          this.politicsstatus = JSON.parse(window.sessionStorage.getItem('politicsstatus'));
        }

        if(!window.sessionStorage.getItem('allDeps')){
          this.$getRequest('/employee/basic/deps').then(res=>{
            if(res){
              this.allDeps = this.treeChange(res);
              window.sessionStorage.setItem('allDeps',JSON.stringify(res));
            }
          })
        } else{
          this.allDeps = JSON.parse(window.sessionStorage.getItem('allDeps'));
        }
      },
      showAddEmpView(){
        this.title = '添加员工';
        this.emp = {
          id: null,
          name: '',
          gender: '男',
          birthday: '',
          idCard: '',
          wedLock: '未婚',
          nationId: null,
          nativePlace: '',
          politicId: null,
          email: '',
          phone: '',
          address: '',
          departmentId: null,
          jobLevelId: null,
          positionId: null,
          engageForm: '',
          tiptopDegree: '',
          specialty: '',
          school: '',
          beginDate: '',
          workState: '在职',
          workId: '',
          contractTerm: null,
          conversionTime: '',
          notWorkDate: null,
          beginContract: '',
          endContract: '',
          workAge: null,
          salaryId: null,
        };
        this.inputDepName = '';
        this.getMaxWorkId();
        this.initPositions();
        this.dialogVisible = true;
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
        let url = '/employee/basic/?currentPage='+this.currentPage+"&size="+this.size;
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
          }if(this.searchValue.departmentId){
            url += '&departmentId='+this.searchValue.departmentId;
          }if(this.searchValue.beginDateScope){
            url += '&beginDateScope='+this.searchValue.beginDateScope;
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
::v-deep .vue-treeselect {
  display: flex;
  width: 204px;
  .vue-treeselect__control {
    line-height: 28px;
    height: 28px;
    .vue-treeselect__value-container {
      font-size: 12px;
      .vue-treeselect__placeholder {
        line-height: 28px;
      }
      .vue-treeselect__single-value {
        line-height: 28px;
      }
    }
  }
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
