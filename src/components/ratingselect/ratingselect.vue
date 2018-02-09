<template>
  <div class="ratingselect">
    <!--描述-->
    <div class="rating-type">
      <span v-on:click="select(0,$event)" class="block all" :class="{'active':selectType===0}">{{desc.all}}<span
        class="count">({{ratings.length}})</span></span>
      <span v-on:click="select(1,$event)" class="block positive"
            :class="{'active':selectType===1}">{{desc.positive}}<span
        class="count">({{positives.length}})</span></span>
      <span v-on:click="select(-1,$event)" class="block negative"
            :class="{'active':selectType===-1}">{{desc.negative}}<span
        class="count">({{nagatives.length}})</span></span>
    </div>
    <!--有内容的评价-->
    <div class="switch" :class="{'on':onlyContent}" v-on:click="toggleContent">
      <span class="icon iconfont icon-success_fill"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  // 定义3个常量用来表示，组件描述内容
  const Positive = 1; // 好评
  const Negative = -1; // 差评
  const All = 0; // 全部评价
  export default {
    // 接受父组件动态传过来的数据
    props: {
      // 评价的内容
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      // 选择的类型
      selectType: {
        type: Number,
        default: All
      },
      // 只看的内容
      onlyContent: {
        type: Boolean,
        default: false // 默认FALSE查看所有的内容
      },
      // 描述
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    methods: {
      select: function (type, event) {
        if (!event._constructed) {
          return;
        } else {
          /*
          * 不可以在子组件内,随意改变父组件传过来的值,通过$emit将子组件需要改变的值
          * 发送给父组件然后父组件再通过props传给子组件,然后view就会发生相应的改变
          */
          this.$emit('select', type);
        }
      },
      toggleContent: function (event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('onlyContent', this.onlyContent);
      }
    },
    computed: {
      positives: function () {
        return this.ratings.filter(function (rating) {
          return rating.rateType === Positive;
        });
      },
      nagatives: function () {
        return this.ratings.filter(function (rating) {
          return rating.rateType === Negative;
        });
      }
    }
  };
</script>

<style>
  @import "ratingselect.css";
</style>
