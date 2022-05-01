<template>
  <div>
    <div>
      <div style="display: flex;justify-content: space-between">
        <div>
          <el-input style="width: 240px;margin-right: 10px"
                    prefix-icon="el-icon-search"
                    clearable
                    v-model="searchValue.name"
                    @keydown.enter.native="initEmpData"
                    @clear="initEmpData"
                    placeholder="请输入员工姓名进行搜索..."></el-input>
          <el-select @clear="initEmpData" clearable @change="initEmpData" style="width: 240px;margin-right: 10px;" v-model="searchValue.depId" placeholder="所属部门">
            <el-option v-for="item in allDeps"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
          <el-button icon="el-icon-search" type="primary" @click="initEmpData">搜索</el-button>
        </div>
        <div>
          <el-button icon="el-icon-refresh" type="success" @click="initEmpData"></el-button>
        </div>
      </div>
    </div>
    <div>
      <el-table
          :data="empData"
          stripe
          @selection-change="handleSelectionChange"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          style="width: 100%;margin-top:20px">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="employee.workId"
            label="工号"
            fixed
            align="left"
            width="100">
        </el-table-column>
        <el-table-column
            prop="employee.name"
            label="姓名"
            width="90">
        </el-table-column>
        <el-table-column
            prop="employee.department.name"
            label="所属部门"
            width="120">
        </el-table-column>
        <el-table-column
            label="人事资料存档率"
            width="150">
            <template slot-scope="scope">
              <el-link :underline="false" type="primary" style="font-size: 12px;">{{scope.row | archiveRate}}</el-link>
            </template>
        </el-table-column>
        <el-table-column
            label="身份证正反面"
            width="120">
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
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="showView(scope.row)">
              <i class="el-icon-edit">编辑</i>
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
    <el-dialog
        style="border-radius: 15%"
        title="人事资料存档"
        width="60%"
        :visible.sync="dialogVisible">
      <div>
        <div>

        </div>
        <div>
          <h3><span style="color: #366cb3">资料上传</span></h3>
          <span>（注: 上传文件为pdf格式，且命名格式规范，如身份证正反面.pdf）</span>
          <el-row>
            <el-col :span="4">
              <el-upload
                  class="upload-demo"
                  drag
                  :show-file-list="false"
                  :limit="1"
                  :headers="headers"
                  :before-upload="idCardBeforeUpload"
                  :on-success="idCardSuccess"
                  :on-error="idCardError"
                  :file-list="idCardFileList"
                  accept=".pdf"
                  :on-progress="uploadIdCardProcess"
                  :action="idCard">
                <div class="el-upload__text">
                  <i class="fa fa-upload">
                    <div style="margin-top: 10px;">身份证正反面</div>
                  </i>
                </div>
              </el-upload>
            </el-col>
            <el-col :span="5">
              <span class="icon_container" v-if="showFile.idCardFileVisible">
                <el-link @click="downloadIdCard" :underline="false" style="color: #5888bf;margin-left: 5px;margin-right: 20px;">
                  <i class="fa fa-link"></i>
                  身份证正反面.pdf
                </el-link>
                <el-tooltip content="删除文件" placement="bottom" effect="light">
                  <i @click="deleteIdCard" class="el-icon-delete showIcon" style="opacity: 0;margin-right: 5px;"></i>
                </el-tooltip>
              </span>
              <el-progress v-if="idCardProgressFlag" :percentage="idCardLoadProgress"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-upload
                  class="upload-demo"
                  drag
                  :show-file-list="false"
                  :limit="1"
                  :headers="headers"
                  :before-upload="contractBeforeUpload"
                  :on-success="contractSuccess"
                  :on-error="contractError"
                  :file-list="contractFileList"
                  accept=".pdf"
                  :on-progress="uploadContractProcess"
                  :action="contract">
                <div class="el-upload__text">
                  <i class="fa fa-upload">
                    <div style="margin-top: 10px;">合同</div>
                  </i>
                </div>
              </el-upload>
            </el-col>
            <el-col :span="5">
              <span class="icon_container" v-if="showFile.contractFileVisible">
                <el-link @click="downloadContract" :underline="false" style="color: #5888bf;margin-left: 5px;margin-right: 20px;">
                  <i class="fa fa-link"></i>
                  合同.pdf
                </el-link>
                <el-tooltip content="删除文件" placement="bottom" effect="light">
                  <i @click="deleteContract" class="el-icon-delete showIcon" style="opacity: 0;margin-right: 5px;"></i>
                </el-tooltip>
              </span>
              <el-progress v-if="contractProgressFlag" :percentage="contractLoadProgress"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-upload
                  class="upload-demo"
                  drag
                  :show-file-list="false"
                  :limit="1"
                  :headers="headers"
                  :before-upload="resumeBeforeUpload"
                  :on-success="resumeSuccess"
                  :on-error="resumeError"
                  :file-list="resumeFileList"
                  accept=".pdf"
                  :on-progress="uploadResumeProcess"
                  :action="resume">
                <div class="el-upload__text">
                  <i class="fa fa-upload">
                    <div style="margin-top: 10px;">入职简历</div>
                  </i>
                </div>
              </el-upload>
            </el-col>
            <el-col :span="5">
              <span class="icon_container" v-if="showFile.resumeFileVisible">
                <el-link @click="downloadResume" :underline="false" style="color: #5888bf;margin-left: 5px;margin-right: 20px;">
                  <i class="fa fa-link"></i>
                  入职简历.pdf
                </el-link>
                <el-tooltip content="删除文件" placement="bottom" effect="light">
                  <i @click="deleteResume" class="el-icon-delete showIcon" style="opacity: 0;margin-right: 5px;"></i>
                </el-tooltip>
              </span>
              <el-progress v-if="resumeProgressFlag" :percentage="resumeLoadProgress"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-upload
                  class="upload-demo"
                  drag
                  :show-file-list="false"
                  :limit="1"
                  :headers="headers"
                  :before-upload="offerBeforeUpload"
                  :on-success="offerSuccess"
                  :on-error="offerError"
                  :file-list="offerFileList"
                  accept=".pdf"
                  :on-progress="uploadOfferProcess"
                  :action="offer">
                <div class="el-upload__text">
                  <i class="fa fa-upload">
                    <div style="margin-top: 10px;">offer</div>
                  </i>
                </div>
              </el-upload>
            </el-col>
            <el-col :span="5">
              <span class="icon_container" v-if="showFile.offerFileVisible">
                <el-link @click="downloadOffer" :underline="false" style="color: #5888bf;margin-left: 5px;margin-right: 20px;">
                  <i class="fa fa-link"></i>
                  offer.pdf
                </el-link>
                <el-tooltip content="删除文件" placement="bottom" effect="light">
                  <i @click="deleteOffer" class="el-icon-delete showIcon" style="opacity: 0;margin-right: 5px;"></i>
                </el-tooltip>
              </span>
              <el-progress v-if="offerProgressFlag" :percentage="offerLoadProgress"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-upload
                  class="upload-demo"
                  drag
                  :show-file-list="false"
                  :limit="1"
                  :headers="headers"
                  :before-upload="medicalReportBeforeUpload"
                  :on-success="medicalReportSuccess"
                  :on-error="medicalReportError"
                  :file-list="medicalReportFileList"
                  accept=".pdf"
                  :on-progress="uploadMedicalReportProcess"
                  :action="medicalReport">
                <div class="el-upload__text">
                  <i class="fa fa-upload">
                    <div style="margin-top: 10px;">体检报告</div>
                  </i>
                </div>
              </el-upload>
            </el-col>
            <el-col :span="5">
              <span class="icon_container" v-if="showFile.medicalReportFileVisible">
                <el-link @click="downloadMedicalReport" :underline="false" style="color: #5888bf;margin-left: 5px;margin-right: 20px;">
                  <i class="fa fa-link"></i>
                  体检报告.pdf
                </el-link>
                <el-tooltip content="删除文件" placement="bottom" effect="light">
                  <i @click="deleteMedicalReport" class="el-icon-delete showIcon" style="opacity: 0;margin-right: 5px;"></i>
                </el-tooltip>
              </span>
              <el-progress v-if="medicalReportProgressFlag" :percentage="medicalReportLoadProgress"></el-progress>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              <el-upload
                  class="upload-demo"
                  drag
                  :show-file-list="false"
                  :limit="1"
                  :headers="headers"
                  :before-upload="degreeCertificateBeforeUpload"
                  :on-success="degreeCertificateSuccess"
                  :on-error="degreeCertificateError"
                  :file-list="degreeCertificateFileList"
                  accept=".pdf"
                  :on-progress="uploadDegreeCertificateProcess"
                  :action="degreeCertificate">
                <div class="el-upload__text">
                  <i class="fa fa-upload">
                    <div style="margin-top: 10px;">学历证书</div>
                  </i>
                </div>
              </el-upload>
            </el-col>
            <el-col :span="5">
              <span class="icon_container" v-if="showFile.degreeCertificateFileVisible">
                <el-link @click="downloadDegreeCertificate" :underline="false" style="color: #5888bf;margin-left: 5px;margin-right: 20px;">
                  <i class="fa fa-link"></i>
                  学历证书.pdf
                </el-link>
                <el-tooltip content="删除文件" placement="bottom" effect="light">
                  <i @click="deleteDegreeCertificate" class="el-icon-delete showIcon" style="opacity: 0;margin-right: 5px;"></i>
                </el-tooltip>
              </span>
              <el-progress v-if="degreeCertificateProgressFlag" :percentage="degreeCertificateLoadProgress"></el-progress>
            </el-col>
          </el-row>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="doUpdate">取 消</el-button>
          <el-button type="primary" @click="doUpdate">确 定</el-button>
        </span>
    </el-dialog>
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
      headers:{
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      empData: [],
      loading: false,
      currentPage: 1,
      size: 10,
      total: 0,
      multipleSelection: [],
      title: '',
      dialogVisible: false,
      currentEmp: {
        id: null,
        idCardPath: '',
        contractPath: '',
        medicalReportPath: '',
        degreeCertificatePath: '',
        offerPath: '',
        resumePath: ''
      },
      showFile: {
        idCardFileVisible: false,
        contractFileVisible: false,
        medicalReportFileVisible: false,
        degreeCertificateFileVisible: false,
        offerFileVisible: false,
        resumeFileVisible: false
      },
      idCardFileList: [],
      contractFileList: [],
      resumeFileList: [],
      offerFileList: [],
      medicalReportFileList: [],
      degreeCertificateFileList: [],
      idCardLoadProgress: 0,
      idCardProgressFlag: false,
      contractLoadProgress: 0,
      contractProgressFlag: false,
      resumeLoadProgress: 0,
      resumeProgressFlag: false,
      offerLoadProgress: 0,
      offerProgressFlag: false,
      medicalReportLoadProgress: 0,
      medicalReportProgressFlag: false,
      degreeCertificateLoadProgress: 0,
      degreeCertificateProgressFlag: false
    }
  },
  computed: {
    idCard() {
      return '/api/employee/advanced/idCard/upload?id='+this.currentEmp.id;
    },
    contract() {
      return '/api/employee/advanced/contract/upload?id='+this.currentEmp.id;
    },
    medicalReport() {
      return '/api/employee/advanced/medicalReport/upload?id='+this.currentEmp.id;
    },
    degreeCertificate() {
      return '/api/employee/advanced/degreeCertificate/upload?id='+this.currentEmp.id;
    },
    offer() {
      return '/api/employee/advanced/offer/upload?id='+this.currentEmp.id;
    },
    resume() {
      return '/api/employee/advanced/resume/upload?id='+this.currentEmp.id;
    }
  },
  mounted() {
    this.initAllDeps();
    this.initEmpData();
  },
  methods: {
    downloadDegreeCertificate() {
      if(this.currentEmp.degreeCertificatePath) {
        this.$downloadRequest('/employee/advanced/degreeCertificate/download?fileName='+this.currentEmp.degreeCertificatePath);
      }
    },
    downloadMedicalReport() {
      if(this.currentEmp.medicalReportPath) {
        this.$downloadRequest('/employee/advanced/medicalReport/download?fileName='+this.currentEmp.medicalReportPath);
      }
    },
    downloadOffer() {
      if(this.currentEmp.offerPath) {
        this.$downloadRequest('/employee/advanced/offer/download?fileName='+this.currentEmp.offerPath);
      }
    },
    downloadResume() {
      if(this.currentEmp.resumePath) {
        this.$downloadRequest('/employee/advanced/resume/download?fileName='+this.currentEmp.resumePath);
      }
    },
    downloadContract() {
      if(this.currentEmp.contractPath) {
        this.$downloadRequest('/employee/advanced/contract/download?fileName=' + this.currentEmp.contractPath);
      }
    },
    downloadIdCard() {
      if(this.currentEmp.idCardPath) {
        this.$downloadRequest('/employee/advanced/idCard/download?fileName=' + this.currentEmp.idCardPath);
      }
    },
    uploadDegreeCertificateProcess(event, file, fileList) {
      this.degreeCertificateProgressFlag = true; // 显示进度条
      this.degreeCertificateLoadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (this.degreeCertificateLoadProgress >= 100) {
        this.degreeCertificateLoadProgress = 100
        setTimeout( () => {this.degreeCertificateProgressFlag = false}, 1000) // 一秒后关闭进度条
      }
    },
    uploadMedicalReportProcess(event, file, fileList) {
      this.medicalReportProgressFlag = true; // 显示进度条
      this.medicalReportLoadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (this.medicalReportLoadProgress >= 100) {
        this.medicalReportLoadProgress = 100
        setTimeout( () => {this.medicalReportProgressFlag = false}, 1000) // 一秒后关闭进度条
      }
    },
    uploadOfferProcess(event, file, fileList) {
      this.offerProgressFlag = true; // 显示进度条
      this.offerLoadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (this.offerLoadProgress >= 100) {
        this.offerLoadProgress = 100
        setTimeout( () => {this.offerProgressFlag = false}, 1000) // 一秒后关闭进度条
      }
    },
    uploadResumeProcess(event, file, fileList) {
      this.resumeProgressFlag = true; // 显示进度条
      this.resumeLoadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (this.resumeLoadProgress >= 100) {
        this.resumeLoadProgress = 100
        setTimeout( () => {this.resumeProgressFlag = false}, 1000) // 一秒后关闭进度条
      }
    },
    uploadContractProcess(event, file, fileList) {
      this.contractProgressFlag = true; // 显示进度条
      this.contractLoadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (this.contractLoadProgress >= 100) {
        this.contractLoadProgress = 100
        setTimeout( () => {this.contractProgressFlag = false}, 1000) // 一秒后关闭进度条
      }
    },
    uploadIdCardProcess(event, file, fileList) {
      this.idCardProgressFlag = true; // 显示进度条
      this.idCardLoadProgress = parseInt(event.percent); // 动态获取文件上传进度
      if (this.idCardLoadProgress >= 100) {
        this.idCardLoadProgress = 100
        setTimeout( () => {this.idCardProgressFlag = false}, 1000) // 一秒后关闭进度条
      }
    },
    doUpdate() {
      this.currentEmp = {
        id: null,
        idCardPath: '',
        contractPath: '',
        medicalReportPath: '',
        degreeCertificatePath: '',
        offerPath: '',
        resumePath: ''
      };
      this.showFile = {
        idCardFileVisible: false,
            contractFileVisible: false,
            medicalReportFileVisible: false,
            degreeCertificateFileVisible: false,
            offerFileVisible: false,
            resumeFileVisible: false
      };
      this.idCardFileList = [];
      this.contractFileList = [];
      this.resumeFileList = [];
      this.offerFileList = [];
      this.medicalReportFileList = [];
      this.degreeCertificateFileList = [];
      this.dialogVisible = false;
    },
    deleteDegreeCertificate() {
      this.currentEmp.degreeCertificatePath = '';
      this.$putRequest('/employee/advanced/', this.currentEmp).then(res=>{
        if(res) {
          this.degreeCertificateFileList.splice(0,1);
          this.showFile.degreeCertificateFileVisible = false;
          this.initEmpData();
        }
      })
    },
    degreeCertificateError() {
      this.$notify({
        message: '上传失败',
        type: 'error'
      });
      this.showFile.degreeCertificateFileVisible = false;
      this.degreeCertificateFileList.splice(0,1);
    },
    degreeCertificateSuccess(response, file, fileList) {
      this.$notify({
        message: '上传成功',
        type: 'success'
      });
      this.currentEmp.degreeCertificatePath = response.obj;
      this.initEmpData();
    },
    degreeCertificateBeforeUpload(file) {
      let content = file.name.split('\.');
      console.log(content[0]);
      if(content[0]!=='学历证书') {
        this.$notify({
          title: '警告',
          message: '上传文件命名不正确',
          type: 'warning'
        });
        return false;
      }else if(content[1]!=='pdf') {
        this.$notify({
          title: '警告',
          message: '上传文件格式不正确',
          type: 'warning'
        });
        return false;
      }
      this.showFile.degreeCertificateFileVisible = true;
    },
    deleteMedicalReport() {
      this.currentEmp.medicalReportPath = '';
      this.$putRequest('/employee/advanced/', this.currentEmp).then(res=>{
        if(res) {
          this.medicalReportFileList.splice(0,1);
          this.showFile.medicalReportFileVisible = false;
          this.initEmpData();
        }
      })
    },
    medicalReportError() {
      this.$notify({
        message: '上传失败',
        type: 'error'
      });
      this.showFile.medicalReportFileVisible = false;
      this.medicalReportFileList.splice(0,1);
    },
    medicalReportSuccess(response, file, fileList) {
      this.$notify({
        message: '上传成功',
        type: 'success'
      });
      this.currentEmp.medicalReportPath = response.obj;
      this.initEmpData();
    },
    medicalReportBeforeUpload(file) {
      let content = file.name.split('\.');
      console.log(content[0]);
      if(content[0]!=='体检报告') {
        this.$notify({
          title: '警告',
          message: '上传文件命名不正确',
          type: 'warning'
        });
        return false;
      }else if(content[1]!=='pdf') {
        this.$notify({
          title: '警告',
          message: '上传文件格式不正确',
          type: 'warning'
        });
        return false;
      }
      this.showFile.medicalReportFileVisible = true;
    },
    deleteOffer() {
      this.currentEmp.offerPath = '';
      this.$putRequest('/employee/advanced/', this.currentEmp).then(res=>{
        if(res) {
          this.offerFileList.splice(0,1);
          this.showFile.offerFileVisible = false;
          this.initEmpData();
        }
      })
    },
    offerError() {
      this.$notify({
        message: '上传失败',
        type: 'error'
      });
      this.showFile.offerFileVisible = false;
      this.offerFileList.splice(0,1);
    },
    offerSuccess(response, file, fileList) {
      this.$notify({
        message: '上传成功',
        type: 'success'
      });
      this.currentEmp.offerPath = response.obj;
      this.initEmpData();
    },
    offerBeforeUpload(file) {
      let content = file.name.split('\.');
      console.log(content[0]);
      if(content[0]!=='offer') {
        this.$notify({
          title: '警告',
          message: '上传文件命名不正确',
          type: 'warning'
        });
        return false;
      }else if(content[1]!=='pdf') {
        this.$notify({
          title: '警告',
          message: '上传文件格式不正确',
          type: 'warning'
        });
        return false;
      }
      this.showFile.offerFileVisible = true;
    },
    deleteResume() {
      this.currentEmp.resumePath = '';
      this.$putRequest('/employee/advanced/', this.currentEmp).then(res=>{
        if(res) {
          this.resumeFileList.splice(0,1);
          this.showFile.resumeFileVisible = false;
          this.initEmpData();
        }
      })
    },
    resumeError() {
      this.$notify({
        message: '上传失败',
        type: 'error'
      });
      this.showFile.resumeFileVisible = false;
      this.resumeFileList.splice(0,1);
    },
    resumeSuccess(response, file, fileList) {
      this.$notify({
        message: '上传成功',
        type: 'success'
      });
      this.currentEmp.resumePath = response.obj;
      this.initEmpData();
    },
    resumeBeforeUpload(file) {
      let content = file.name.split('\.');
      console.log(content[0]);
      if(content[0]!=='入职简历') {
        this.$notify({
          title: '警告',
          message: '上传文件命名不正确',
          type: 'warning'
        });
        return false;
      }else if(content[1]!=='pdf') {
        this.$notify({
          title: '警告',
          message: '上传文件格式不正确',
          type: 'warning'
        });
        return false;
      }
      this.showFile.resumeFileVisible = true;
    },
    deleteContract() {
      this.currentEmp.contractPath = '';
      this.$putRequest('/employee/advanced/', this.currentEmp).then(res=>{
        if(res) {
          this.contractFileList.splice(0,1);
          this.showFile.contractFileVisible = false;
          this.initEmpData();
        }
      })
    },
    contractError() {
      this.$notify({
        message: '上传失败',
        type: 'error'
      });
      this.showFile.contractFileVisible = false;
      this.contractFileList.splice(0,1);
    },
    contractSuccess(response, file, fileList) {
      this.$notify({
        message: '上传成功',
        type: 'success'
      });
      this.currentEmp.contractPath = response.obj;
      this.initEmpData();
    },
    contractBeforeUpload(file) {
      let content = file.name.split('\.');
      console.log(content[0]);
      if(content[0]!=='合同') {
        this.$notify({
          title: '警告',
          message: '上传文件命名不正确',
          type: 'warning'
        });
        return false;
      }else if(content[1]!=='pdf') {
        this.$notify({
          title: '警告',
          message: '上传文件格式不正确',
          type: 'warning'
        });
        return false;
      }
      this.showFile.contractFileVisible = true;
    },
    deleteIdCard() {
      this.currentEmp.idCardPath = '';
      this.$putRequest('/employee/advanced/', this.currentEmp).then(res=>{
        if(res) {
          this.idCardFileList.splice(0,1);
          this.showFile.idCardFileVisible = false;
          this.initEmpData();
        }
      })
    },
    idCardError() {
      this.$notify({
        message: '上传失败',
        type: 'error'
      });
      this.showFile.idCardFileVisible = false;
      this.idCardFileList.splice(0,1);
    },
    idCardSuccess(response, file, fileList) {
      this.$notify({
        message: '上传成功',
        type: 'success'
      });
      this.currentEmp.idCardPath = response.obj;
      this.initEmpData();
    },
    idCardBeforeUpload(file) {
      let content = file.name.split('\.');
      console.log(content[0]);
      if(content[0]!=='身份证正反面') {
        this.$notify({
          title: '警告',
          message: '上传文件命名不正确',
          type: 'warning'
        });
        return false;
      }else if(content[1]!=='pdf') {
        this.$notify({
          title: '警告',
          message: '上传文件格式不正确',
          type: 'warning'
        });
        return false;
      }
      this.showFile.idCardFileVisible = true;
    },
    showView(data) {
      if(!this.$store.getters.checkPermissionFlag('EmpAdvEdit')) {
        this.$message.error('权限不足,请联系管理员');
        return;
      }
      Object.assign(this.currentEmp, data);
      if(this.currentEmp.idCardPath) {
        this.showFile.idCardFileVisible = true;
      }
      if(this.currentEmp.degreeCertificatePath) {
        this.showFile.degreeCertificateFileVisible = true;
      }
      if(this.currentEmp.resumePath) {
        this.showFile.resumeFileVisible = true;
      }
      if(this.currentEmp.offerPath) {
        this.showFile.offerFileVisible = true;
      }
      if(this.currentEmp.medicalReportPath) {
        this.showFile.medicalReportFileVisible = true;
      }if(this.currentEmp.contractPath) {
        this.showFile.contractFileVisible = true;
      }

      this.dialogVisible = true;
    },
    currentChange(val){
      this.currentPage = val;
      this.initEmpData();
    },
    sizeChange(val) {
      this.size = val;
      this.initEmpData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    initEmpData() {
      this.loading = true;
      let url = '/employee/advanced/?currentPage='+this.currentPage+'&size='+this.size;
      if(this.searchValue.name) {
        url += '&name='+this.searchValue.name;
      }
      if(this.searchValue.depId){
        url += '&depId='+this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        this.loading = false;
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
  },
  filters: {
    archiveRate(data) {
      let count = 0;
      if(data.contractPath) {
        count++;
      }
      if(data.idCardPath) {
        count++;
      }
      if(data.medicalReportPath){
        count++;
      }
      if(data.degreeCertificatePath) {
        count++;
      }
      if(data.offerPath){
        count++;
      }
      if(data.resumePath) {
        count++;
      }
      let rate = count / 6.0 * 100;
      return rate.toFixed(2) + '%';
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-upload{
  width: 100px;
  height: 100px;
  margin: 10px 0 10px 30px;
}
::v-deep .el-upload__text {
  width: 100px;
  height: 100px;
  font-size: 12px;
  line-height: 100px;
}
::v-deep .el-upload .el-upload-dragger{
  width: 100px;
  height: 100px;
}
::v-deep .upload-demo {
  display: inline-flex;
}
::v-deep .icon_container:hover > .showIcon{
  opacity:100!important;
}
::v-deep .icon_container:hover {
  background-color: #E9ECEF;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
