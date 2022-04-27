<template>
  <div>
  </div>
</template>

<script>
export default {
  name: "MyPopper"
}
</script>

<style>
.myPopper.el-tooltip__popper {
  background: #6c6c6c;
  padding: 3px 6px;
  height: 15px;
  line-height: 15px;
}
.myPopper.el-tooltip__popper.is-dark {
  background: #6c6c6c;
}
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow:after, .el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #6c6c6c;
  opacity: 1;
}
</style>
