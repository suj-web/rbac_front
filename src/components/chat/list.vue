<template>
  <div id="list">
  	<ul style="padding-left: 0">
  		<li v-for="item in admins" :class="{ active: currentSession ? item.username === currentSession.username : false }"
          @click="changeCurrentSession(item)"><!--   :class="[item.id === currentSession ? 'active':'']" -->
  			<img class="avatar" :src="item.userFace" :alt="item.name">
        <el-badge :max="10" :value="isDot[user.username+'$'+item.username] > 0? isDot[user.username+'$'+item.username]: null"><p class="name">{{item.name}}</p></el-badge>
  		</li>
  	</ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'list',
  data () {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed: mapState([
      'admins',
      'currentSession',
      'isDot'
	]),
  methods:{
  	changeCurrentSession(currentSession) {
  		this.$store.commit('changeCurrentSession',currentSession);
  		this.$putRequest('/chat/message/?chatObj='+this.user.username+'$'+currentSession.username);
  	}
  }
}
</script>

<style lang="scss" scoped>
#list {
	li {
		padding: 15px 15px;
		cursor: pointer;
    border-radius: 5px;
		&:hover {
      background-color: #ddd;
		}
	}
  li.active {/*注意这个是.不是冒号:*/
			background-color: #ddd;
	}
	.avatar {
		border-radius: 2px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
	}
	.name {
    color: #001529;
		display: inline-block;
		margin-left: 15px;
    margin-top: 0px;
    margin-bottom: 0px;
	}
}
</style>
