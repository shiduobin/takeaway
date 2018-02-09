<template>
  <div class="cartcontrol">
    <!--减号小球动画-->
    <transition name="move">
      <!--减少商品-->
      <div class="cart-decrease" v-show="food.count>0" v-on:click.stop.prevent="decreaseCart($event)">
        <i class="icon iconfont icon-offline_fill inner"></i>
      </div>
    </transition>
    <!--商品数量-->
    <div class="cart-count" v-show="food.count">
      {{food.count}}
    </div>
    <!--增加商品-->
    <div class="cart-add" v-on:click.stop.prevent="addCart($event)">
      <i class="icon iconfont icon-addition_fill"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart: function (event) {
        // 去掉自带click事件的点击
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        // 子组件与父组件通信,向父组建传递当前dom对象
        this.$emit('add', event.target);
      },
      decreaseCart: function (event) {
        // 去掉自带click事件的点击
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style>
  @import "cartcontrol.css";
</style>
