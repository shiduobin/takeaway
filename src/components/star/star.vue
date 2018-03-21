<template>

  <div class="star" :class="starType">
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" v-bind:key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const length = 5;
  const classOn = 'on'; // 全星
  const classHalf = 'half'; // 半星
  const classOff = 'off'; // 空星
  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size; // 图标大小
      },
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        let hasDecimal = score % 1 !== 0; // 评分是否有小数
        let integer = Math.floor(score);
        // 全星评价
        for (let i = 0; i < integer; i++) {
          result.push(classOn);
        }
        // 半星评价
        if (hasDecimal) {
          result.push(classHalf);
        }
        // 空星评价
        while (result.length < length) {
          result.push(classOff);
        }
        return result;
      }
    }
  };
</script>

<style>
  @import "star.css";
</style>
