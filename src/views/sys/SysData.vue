<template>
  <div>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="数据备份" name="backup">
          <div style="display: flex;justify-content: flex-end;align-items: center">
            备份文件路径:
            <el-input size="small" v-model="savePath" style="width: 200px;margin-left: 15px;margin-right: 10px" placeholder="如F:/data.sql"></el-input>
            <el-button type="primary" @click="backup" :icon="backupBtnIcon">{{backupBtnText}}</el-button>
          </div>
          <el-table
              :data="backupFiles"
              border
              stripe
              style="width: 100%;margin-top: 10px"
              @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                fixed
                width="55">
            </el-table-column>
            <el-table-column
                prop="name"
                fixed
                label="文件名称"
                width="300">
            </el-table-column>
            <el-table-column
                prop="path"
                label="文件全路径"
                width="600">
            </el-table-column>
            <el-table-column
                label="文件大小"
                width="120">
              <template slot-scope="scope">
                <span>{{scope.row.size | toNumberFixed}}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="gmtCreate"
                label="创建时间"
                width="150">
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right"
                width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" icon="fa fa-trash-o" @click="deleteBackup(scope.row)">&nbsp;删除</el-button>
                <el-button size="mini" type="warning" icon="fa fa-download" @click="download(scope.row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button style="padding-right: 8px;padding-left: 8px;margin-top: 10px" type="danger" icon="fa fa-trash-o" :disabled="this.multipleSelection.length===0" @click="deleteMany">&nbsp;批量删除</el-button>
        </el-tab-pane>
      <el-tab-pane label="数据恢复" name="recover">
        <el-upload
            ref="upload"
            action="/system/data/recover"
            :headers="headers"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :limit="1"
            :file-list="fileList"
            :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px" type="success" :icon="importDataBtnIcon" :disabled="importDataDisabled" @click="submitUpload">
            {{importDataBtnText}}
          </el-button>
          <div class="el-upload__tip" slot="tip">只能上传sql文件，限制1个文件，大小不超过100MB</div>
        </el-upload>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "SysData",
  data() {
    return {
      activeName: 'backup',
      backupFiles: [],
      multipleSelection: [],
      fileList: [],
      headers:{
        Authorization: window.sessionStorage.getItem('tokenStr')
      },
      importDataDisabled: false,
      importDataBtnText: '恢复数据',
      importDataBtnIcon: 'fa fa-upload',
      savePath: '',
      backupBtnText: '备份数据库',
      backupBtnIcon: ''
    }
  },
  mounted() {
    this.initBackupFiles();
  },
  methods: {
    backup() {
      this.backupBtnText = '备份中';
      this.backupBtnIcon = 'el-icon-loading';
      this.$getRequest('/system/data/backup?savePath='+this.savePath).then(res=>{
        this.backupBtnIcon = '';
        this.backupBtnText = '备份数据库';
        if(res) {
          this.initBackupFiles();
        }
      })
    },
    onSuccess(){
      this.$message.success("恢复成功");
      this.importDataBtnIcon = 'fa fa-upload';
      this.importDataBtnText = '恢复数据';
      this.importDataDisabled = false;
    },
    onError(){
      this.$message.error("恢复失败");
      this.importDataBtnIcon = 'fa fa-upload';
      this.importDataBtnText = '恢复数据';
      this.importDataDisabled = false;
    },
    beforeUpload(){
      this.importDataBtnIcon = 'el-icon-loading';
      this.importDataBtnText = '正在恢复';
      this.importDataDisabled = true;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    download(data) {
      window.open(data.path,"_self");
    },
    deleteMany() {
      this.$confirm('此操作将永久删除【' + this.multipleSelection.length + '】条备份文件信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item=>{
          ids += 'ids=' + item.id + '&';
        });
        this.$deleteRequest('/system/data/' + ids).then(res => {
          if (res) {
            this.initBackupFiles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    deleteBackup(data) {
      this.$confirm('此操作将永久删除【' + data.id + '】备份文件信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$deleteRequest('/system/data/' + data.id).then(res => {
          if (res) {
            this.initBackupFiles();
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
    initBackupFiles() {
      this.$getRequest('/system/data/list').then(res=>{
        if(res) {
          this.backupFiles = res;
        }
      })
    }
  },
  filters: {
    toNumberFixed(val) {
      return val.toFixed(1)+"M";
    }
  }
}
</script>

<style scoped>

</style>
