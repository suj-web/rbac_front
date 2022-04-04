<template>
  <div>
    <h4>人员构成分析</h4>
    <div style="display: flex;justify-content: center">
      <el-select @change="initAll" v-model="searchValue.depId" clearable placeholder="选择部门">
        <el-option v-for="item in allDeps"
                   :label="item.name"
                   :value="item.id"
                   :key="item.id">
        </el-option>
      </el-select>
    </div>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <div>按年龄段统计</div>
          </div>
          <PieBar :data="compositionAges" :key="1"></PieBar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <div>按最高学历统计</div>
          </div>
          <PieBar :data="compositionDegrees" :key="2"></PieBar>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <div>按聘用形式统计</div>
          </div>
          <PieBar :data="compositionEngageForms" :key="3"></PieBar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <div>按性别统计</div>
          </div>
          <PieBar :data="compositionGenders" :key="4"></PieBar>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <div>按工龄统计</div>
          </div>
          <PieBar :data="compositionWorkAges" :key="5"></PieBar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <div>按在职状态统计</div>
          </div>
          <PieBar :data="compositionWorkStates" :key="6"></PieBar>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <div>按民族进行统计</div>
          </div>
          <PieBar :data="personnelNations" :key="7"></PieBar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <div>按政治面貌进行统计</div>
          </div>
          <PieBar :data="personnelPoliticStatus" :key="8"></PieBar>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header">
            <div>按婚姻状况统计</div>
          </div>
          <PieBar :data="personnelWedLocks" :key="9"></PieBar>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-card class="small-box-card" style="margin-top: 10px;">
            <div slot="header">
              <div>在职员工平均年龄</div>
            </div>
            <span>{{averageAge}}</span>
          </el-card>
        </el-row>
        <el-row>
          <el-card class="small-box-card" style="margin-top: 20px">
            <div slot="header">
              <div>在职员工平均工龄</div>
            </div>
            <span>{{averageWorkAge}}</span>
          </el-card>
        </el-row>
      </el-col>
    </el-row>

    <h4>年龄分析</h4>
    <el-card class="box-card" style="margin-top: 20px;width: 100%">
      <div slot="header">
        <div>部门员工平均年龄统计</div>
      </div>
      <bar :data="departmentAverageAges" :width="'1300'" :name="'部门平均年龄'" :key="11"></bar>
    </el-card>

    <h4>工龄分析</h4>
    <el-card class="box-card" style="margin-top: 20px;width: 100%">
      <div slot="header">
        <div>部门员工平均工龄统计</div>
      </div>
      <bar :data="departmentAverageWorkAges" :width="'1300'" :name="'部门平均工龄'" :key="12"></bar>
    </el-card>
  </div>
</template>

<script>
import PieBar from "../../components/chart/PieBar";
import bar from "../../components/chart/bar";
export default {
  name: "StaPers",
  components: {
    PieBar,
    bar
  },
  data() {
    return {
      allDeps: [],
      searchValue: {
        depId: null
      },
      compositionAges: [],
      compositionDegrees: [],
      compositionEngageForms: [],
      compositionGenders: [],
      compositionWorkAges: [],
      compositionWorkStates: [],
      personnelNations: [],
      personnelPoliticStatus: [],
      personnelWedLocks: [],
      averageAge: 0,
      averageWorkAge: 0,
      departmentAverageAges: [],
      departmentAverageWorkAges: [],
    }
  },
  mounted() {
    this.initAllDeps();
    this.initAll();
  },
  methods: {
    initAll() {
      this.initCompositionAges();
      this.initCompositionDegrees();
      this.initCompositionEngageForms();
      this.initCompositionGenders();
      this.initCompositionWorkAges();
      this.initCompositionWorkStates();
      this.initPersonnelNations();
      this.initPersonnelPoliticStatus();
      this.initPersonnelWedLocks();
      this.initAverageAge();
      this.initAverageWorkAge();
      this.initDepartmentAverageAges();
      this.initDepartmentAverageWorkAges()
    },
    initDepartmentAverageWorkAges() {
      this.$getRequest('/statistics/personnel/department/average/workAge').then(res=>{
        if(res) {
          this.departmentAverageWorkAges = res;
        }
      })
    },
    initDepartmentAverageAges() {
      this.$getRequest('/statistics/personnel/department/averageAge').then(res=>{
        if(res) {
          this.departmentAverageAges = res;
        }
      })
    },
    initAverageWorkAge() {
      let url = '/statistics/personnel/average/workAge';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.averageWorkAge = res;
        }
      })
    },
    initAverageAge() {
      let url = '/statistics/personnel/averageAge';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.averageAge = res;
        }
      })
    },
    initPersonnelWedLocks() {
      let url = '/statistics/personnel/wedLock';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.personnelWedLocks = res;
        }
      })
    },
    initPersonnelPoliticStatus() {
      let url = '/statistics/personnel/politic/status';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.personnelPoliticStatus = res;
        }
      })
    },
    initPersonnelNations() {
      let url = '/statistics/personnel/nation';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.personnelNations = res;
        }
      })
    },
    initCompositionWorkStates() {
      let url = '/statistics/personnel/composition/workState';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.compositionWorkStates = res;
        }
      })
    },
    initCompositionWorkAges() {
      let url = '/statistics/personnel/composition/workAge';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.compositionWorkAges = res;
        }
      })
    },
    initCompositionGenders() {
      let url = '/statistics/personnel/composition/gender';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.compositionGenders = res;
        }
      })
    },
    initCompositionEngageForms() {
      let url = '/statistics/personnel/composition/engageForm';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.compositionEngageForms = res;
        }
      })
    },
    initCompositionDegrees() {
      let url = '/statistics/personnel/composition/degree';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.compositionDegrees = res;
        }
      })
    },
    initCompositionAges() {
      let url = '/statistics/personnel/composition/age';
      if(this.searchValue.depId) {
        url += '?depId=' + this.searchValue.depId;
      }
      this.$getRequest(url).then(res=>{
        if(res) {
          this.compositionAges = res;
        }
      })
    },
    initAllDeps() {
      this.$getRequest('/statistics/personnel/department/list').then(res=>{
        if(res) {
          this.allDeps = res;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .box-card {
  width: 600px;
  height: 400px;
  margin: 10px;
  .el-card__header {
    background-color: #f2f2f2;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #19AA8D;
    font-family: sans-serif
  }
}

::v-deep .small-box-card {
  width: 600px;
  height: 190px;
  //margin: 8px 10px;
  .el-card__header {
    background-color: #f2f2f2;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #19AA8D;
    font-family: sans-serif
  }
  .el-card__body {
    height: 60%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 28px;
  }
}
</style>
