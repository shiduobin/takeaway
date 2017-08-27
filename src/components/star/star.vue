<template>

  <div class="star" :class="starType">
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" v-bind:key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const length = 5;
  const classOn = 'on';
  const classHalf = 'half';
  const classOff = 'off';
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
        return 'star-' + this.size;
      },
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(classOn);
        }
        if (hasDecimal) {
          result.push(classHalf);
        }
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
