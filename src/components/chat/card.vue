<template>
  <div id="card">
  	<header>
  		<img class="avatar" :src="user.userFace" :alt="user.name">
  		<p class="name">{{user.name}}</p>
  	</header>
  	<footer>
      <el-input :clearable="true" @clear="search" @keydown.enter.native="search" prefix-icon="el-icon-search" class="search" type="text" v-model="$store.state.filterKey" placeholder="搜索"></el-input>
  	</footer>
  </div>
</template>

<script>
export default {
  name: 'card',
  data () {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  methods: {
    search() {
      this.$store.dispatch('initData');
    }
  }
}
</script>

<style lang="scss" scoped>
#card {
	padding: 12px;
  .avatar{
  	width: 40px;
  	height: 40px;
  	vertical-align: middle;/*这个是图片和文字居中对齐*/
    border-radius: 4px;
  }
  .name {
  	display: inline-block;
  	padding: 10px;
  	margin-bottom: 15px;
  	font-size: 16px;
    color: #444;
  }
}
</style>
