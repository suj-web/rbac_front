<template>
  <div id="message" v-scroll-bottom="sessions">
  	<ul v-if="currentSession">
  		<li v-for="entry in sessions[user.username+'$'+currentSession.username]">
  			<p class="time">
  				<span>{{entry.date | time}}</span>
  			</p>
  			<div class="main" :class="{self:entry.self,noself:!entry.self}">
  				<img class="avatar" :src="entry.self ? user.userFace : currentSession.userFace" alt="">
  				<div :class="{chatBox_left:!entry.self,chatBox_right:entry.self}" style="border: 1px solid #ddd">{{entry.content}}</div>
  			</div>
  		</li>
  	</ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'message',
  data () {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user')),
      img: 'http://106.14.95.224:8888/group1/M00/00/00/rB_3lWDzlY2AKlHcAABTSuAbANs950.jpg'
    }
  },
  computed: mapState([
  	'sessions',
  	'currentSession'
  ]),
  filters:{
  	time (date) {
      let weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
      let returnTime = '';
      if (date) {
        date = new Date(date);
      }
      console.log(date);
      let year = date.getFullYear();
      let month = date.getMonth();
      if(month > 0 && month < 10) {
        month = '0' + month;
      }
      let day = date.getDate();
      if(day > 0 && day < 10) {
        day = '0' + day;
      }
      let hour = date.getHours();
      if(hour > 0 && hour < 10) {
        hour = '0' + hour;
      } else if(hour===0) {
        hour = '00';
      }
      let minute = date.getMinutes();
      if(minute > 0 && minute < 10) {
        minute = '0' + minute;
      } else if(minute === 0) {
        minute = '00';
      }
      let today = new Date();
      let subDay = today.getDate() - date.getDate();
      let subYear = today.getFullYear() - date.getFullYear();
      if(subDay === 0) {
        returnTime = hour + ':' + minute;
      } else if(subDay === 1) {
        returnTime = '昨天 ' + hour + ':' + minute;
      } else if(subDay >= 2 && subDay < 7) {
        returnTime = weekDay[date.getDay()] + ' ' + hour + ':' + minute;
      } else if(subDay >= 8 && subYear === 0) {
        returnTime = month + '-' + day + ' ' + hour + ':' + minute;
      } else {
        returnTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
      }
  		return returnTime;
  	}
  },
  directives: {/*这个是vue的自定义指令,官方文档有详细说明*/
    // 发送消息后滚动到底部,这里无法使用原作者的方法，也未找到合理的方法解决，暂用setTimeout的方法模拟
    'scroll-bottom' (el) {
      //console.log(el.scrollTop);
      setTimeout(function () {
        el.scrollTop+=9999;
      },1)
    }
  }
}
</script>

<style lang="scss" scoped>
#message {
	padding: 15px;
  max-height: 60%;
  overflow-y: scroll;
  ul {
  	list-style-type: none;
    padding-left: 0px;
  	li {
  		margin-bottom: 15px;
  	}
  }
  .time {
  	text-align: center;
  	margin: 7px 0;
  	> span {
  		display: inline-block;
  		padding: 0 18px;
  		font-size: 12px;
  		color: #FFF;
  		background-color: #dcdcdc;
  		border-radius: 2px;
  	}
  }
  .main {
  	.avatar {
  		float: left;
  		margin: 0 10px 0 0;
  		border-radius: 3px;
  		width: 30px;
  		height: 30px;

  	}
  }
  .self {
    text-align: right;
    .avatar {
      float: right;
      margin: 0 0 0 10px;
      border-radius: 3px;
      width: 30px;
      height: 30px;
    }
  }
}
.chatBox_right::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  right: -20px;
  top:5px;
  border: 10px solid;
  border-color: transparent transparent transparent #b2e281;
}
.chatBox_right {
  border: 1px solid #b2e281;
  position: relative;
  padding: 0 10px;
  max-width: 80%;
  background-color: #b2e281;
  border-radius: 4px;
  line-height: 30px;
  margin: 12px;
  display: inline-block;
}
.chatBox_left::before{
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  left: -20px;
  top:5px;
  border: 10px solid;
  border-color: transparent white transparent transparent ;
}
.chatBox_left{
  border: 1px solid white!important;
  position: relative;
  padding: 0 10px;
  max-width: 80%;
  background-color: white;
  border-radius: 4px;
  line-height: 30px;
  margin: 12px;
  display: inline-block;
}
</style>
