<template>
  <div class="advert-top" v-if="message">
    <!-- 滚动文字区域 -->
    <div class="marquee-wrap">
      <ul class="marquee-box" id="marquee-box">
        <li class="marquee-list" v-for="i in 10" v-html="message" :id="i===1?'marquee':''"></li>
      </ul>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  name: "notice",
  props: {
    message: {
      type: String,
      required: true
    }
  },
  data() {
    return {

    }
  },
  mounted: function() {
    // 延时滚动
    setTimeout(() => {
      this.runMarquee();
    }, 1000);
  },
  methods: {
    runMarquee() {
      // 获取文字 计算后宽度
      var width = document.getElementById("marquee").getBoundingClientRect()
              .width,
          marquee = document.getElementById("marquee-box"),
          disx = 0; // 位移距离
      //设置位移
      setInterval(() => {
        disx--; // disx-=1; 滚动步长
        if (-disx >= width) {
          disx = 10; // 如果位移超过文字宽度，则回到起点  marquee-list的margin值
        }
        // marquee.style.transform = 'translateX(' + disx + 'px)'
        marquee.style.left = disx + "px";
      }, 30); //滚动速度
    }
  }
};
// JavaScript Document
(function px2rem(doc, win) {
  var docEl = doc.documentElement,
      resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
      recalc = function() {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = 100 * (clientWidth / 750) + "px";
      };
  if (!doc.addEventListener) return;
  // 窗口大小发生变化，初始化
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
  setTimeout(function() {
    px2rem(doc, win);
  }, 200);
})(document, window);
</script>

<style scoped>
body, div, html, img, li, ul {
  margin: 0;
  padding: 0;
  border: 0;
}
li {
  list-style: none;
}
.advert-top {
  position: relative;
  display: flex;
  width: 100%;
  height: 30px;
  background-color: #fff;
  color: #2d8cf0;
  font-size: 14px;
  align-items: center;
}
.ico-horn {
  display: flex;
  margin-right: 10px;
  width: 14px;
  height: 14px;
  justify-content: center;
  align-items: center;
}
.ico-horn > img {
  width: 30px;
  height: 30px;
}
/* 以下代码与滚动相关 */
.marquee-wrap {
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin-left: 20px;
}
.marquee-box {
  position: absolute;
  top: 50%;
  display: flex;
  white-space: nowrap;
  transform: translateY(-50%);
}
.marquee-list {
  margin-right: 10px;
}
.marquee-list span {
  padding: 0 0.04rem;
  color: #ffe17b;
  font-weight: 700;
}
</style>
