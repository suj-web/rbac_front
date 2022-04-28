<template>
  <div id="uesrtext">
    <div class="chatIcon">
      <el-popover placement="top-start" width="400" trigger="click" class="emoBox">
        <div class="emotionList">
          <a href="javascript:void(0);" @click="getEmo(index)" v-for="(item,index) in faceList" :key="index" class="emotionItem">{{item.char}}</a>
        </div>
        <el-button
            class="emotionSelect"
            slot="reference"
            type="text"
        ><i class="fa fa-smile-o" style="font-size: 20px;color: #9C9898"></i></el-button>
      </el-popover>
    </div>
    <textarea id="textarea" placeholder="按 Ctrl + Enter 发送" v-model="content" v-on:keyup="addMessage"></<textarea name="" id="" cols="30" rows="10"></textarea>>
  </div>
</template>

<script>
import {mapState} from 'vuex'
const appData = require("../../../public/emoji.json");
export default {
  name: 'uesrtext',
  data () {
    return {
      faceList: [],
      content: '',
      sendMsg: ''
    }
  },
  mounted() {
    for(let i in appData){
      this.faceList.push({'code': appData[i].codes,'char':appData[i].char});
    };
  },
  computed: mapState([
    'currentSession'
  ]),
  methods: {
    getEmo(index){
      var textArea=document.getElementById('textarea');
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          // 非IE浏览器
          textArea.setRangeText(str);
          // 在未选中文本的情况下，重新设置光标位置
          textArea.selectionStart += str.length;
          textArea.focus()
        } else if (document.selection) {
          // IE浏览器
          obj.focus();
          var sel = document.selection.createRange();
          sel.text = str;
        }
      }
      changeSelectedText(textArea,this.faceList[index].char);
      this.content=textArea.value;// 要同步data中的数据
      this.sendMsg = '$'+this.faceList[index].code+'$';
      // console.log(this.faceList[index]);
      console.log(this.sendMsg)
      return;
    },
  	addMessage (e) {
  		if (e.ctrlKey && e.keyCode ===13 && this.content.length) {
  		  if(this.$store.state.currentSession!=null){
          let msgObj = new Object();
          msgObj.to = this.currentSession.username;
          msgObj.content = this.content;
          this.$store.state.stomp.send('/ws/chat',{},JSON.stringify(msgObj));
          this.$store.commit('addMessage',msgObj);
          this.content='';
          this.$emit('scroll');
        } else{
  		    this.$message.info("请选择发送对象");
        }
  		}
  	}
  }
}
</script>
<style lang="scss">
/* el-popover是和app同级的，所以scoped的局部属性设置了无效 */
/* 需要设置全局style */
.el-popover{
  height:200px;
  width:400px;
  overflow: scroll;
  overflow-x:auto;
}
</style>
<style lang="scss" scoped>
#uesrtext {
	position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #DDD;
  > textarea {
  	padding: 10px;
  	width: 100%;
  	height: 100%;
  	border: none;
  	outline: none;
  }
}
.chatIcon {
  margin-left: 10px;
}
.emotionList{
  display: flex;
  flex-wrap: wrap;
  padding:5px;
}
.emotionItem{
  width:10%;
  font-size:20px;
  text-align:center;
}
/*包含以下四种的链接*/
.emotionItem {
  text-decoration: none;
}
/*正常的未被访问过的链接*/
.emotionItem:link {
  text-decoration: none;
}
/*已经访问过的链接*/
.emotionItem:visited {
  text-decoration: none;
}
/*鼠标划过(停留)的链接*/
.emotionItem:hover {
  text-decoration: none;
}
/* 正在点击的链接*/
.emotionItem:active {
  text-decoration: none;
}
</style>
