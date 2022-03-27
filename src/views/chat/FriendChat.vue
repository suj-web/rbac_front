<template>
  <div id="friendChat">
    <div class="sidebar">
      <card></card>
      <list></list>
    </div>
    <div class="main">
      <div class="chatRightTop">
        <div class="chatObject" v-text="currentSession? currentSession.name: ''"></div>
        <div class="closeContainer">
          <el-button style="color: #ccc" type="text" size="mini" icon="el-icon-close" @click="closeChat"></el-button>
        </div>
      </div>
      <el-scrollbar class="scrollbar">
        <message></message>
      </el-scrollbar>
      <usertext></usertext>
    </div>
  </div>
</template>

<script>
import card from '../../components/chat/card.vue'
import list from '../../components/chat/list.vue'
import message from '../../components/chat/message.vue'
import usertext from '../../components/chat/usertext.vue'
import {mapState} from "vuex";

export default {
  name: 'FriendChat',
  data () {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed: mapState([
    'currentSession'
  ]),
  mounted:function() {
    this.$store.dispatch('initData');
  },
  components:{
    card,
    list,
    message,
    usertext
  },
  methods: {
    closeChat() {
      this.$router.push('/home');
    }
  }
}
</script>

<style lang="scss" scoped>
.scrollbar {
  height: 360px;
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}

#friendChat {
  margin: 5px auto;
  width: 800px;
  height: 600px;
  border: 1px solid #E3E3E3;
  border-radius: 10px;
  .sidebar, .main {
    height: 100%;
  }
  .sidebar {
    float: left;
    color: #f4f4f4;
    background-color: #eeebe9;
    width: 200px;
  }
  .main {
    position: relative;
    overflow: hidden;
    background-color: #f5f5f5;
  }
}
  .el-button:hover {
    color: #409eff!important;
  }
  .chatRightTop {
    height:60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    .chatObject {
      font-size: 18px;
      margin-left: 30px;
      margin-bottom: -10px;
    }
    .closeContainer {
      height: 100%;
      margin-top: 0;
      margin-right: 8px;
    }
  }
</style>
