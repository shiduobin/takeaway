<template>
  <div>
    <div class="shopcart">
      <div class="content" v-on:click="toggleList($event)">
        <div class="content-left">
          <div class="logo-wrapper">
            <!--购物车-->
            <div class="logo" v-bind:class="{'highlight':totalCount>0}">
              <i class="icon iconfont icon-publishgoods_fill" v-bind:class="{'highlight':totalCount>0}"></i>
            </div>
            <!--数量-->
            <div class="num" v-show="totalCount>0">
              {{totalCount}}
            </div>
          </div>
          <!--价格-->
          <div class="price" v-bind:class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
          <!--配送费-->
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" v-on:click.stop.prevent="pay">
          <!--结算按钮-->
          <div class="pay" v-bind:class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <!--添加购物车动画-->
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition v-on:before-enter="beforeDrop" v-on:enter="dropping" v-on:after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <!--购物车列表-->
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" v-on:click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol v-bind:food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--列表背后的蒙版-->
    <transition name="fade">
      <div class="list-mask" v-show="listShow" v-on:click="hideList"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/cartcontrol';
  import Bscroll from 'better-scroll';

  export default {
    components: {
      cartcontrol: cartcontrol
    },
    props: {
      // 配送费
      deliveryPrice: {
        type: Number,
        default: 0
      },
      // 最低起送价
      minPrice: {
        type: Number,
        default: 0
      },
      // 传递选择的商品数组
      selectFoods: {
        type: Array,
        default: function () {
          return [
            {
              price: 30,
              count: 1
            }
          ];
        }
      }
    },
    data() {
      return {
        // 创建5个小球用于动画
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        // 存储下落的小球
        dropBalls: [],
        // 折叠状态默认折叠
        fold: true
      };
    },
    computed: {
      // 商品总价格
      totalPrice: function () {
        let total = 0;
        this.selectFoods.forEach(function (food) {
          total += food.price * food.count;
        });
        return total;
      },
      // 商品数量
      totalCount: function () {
        let count = 0;
        this.selectFoods.forEach(function (food) {
          count += food.count;
        });
        return count;
      },
      // 支付状态
      payDesc: function () {
        if (this.totalPrice === 0) {
          return '￥' + this.minPrice + '元起送';
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return '还差￥' + diff + '元起送';
        } else {
          return '去结算';
        }
      },
      // 支付状态样式
      payClass: function () {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      // 购物车列表
      listShow: function () {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        } else {
          let show = !this.fold;
          if (show) {
            this.$nextTick(function () {
              if (!this.scroll) {
                this.scroll = new Bscroll(this.$refs.listContent, {
                  click: true
                });
              } else {
                this.scroll.refresh();
              }
            });
          }
          return show;
        }
      }
    },
    methods: {
      // 折叠购物车列表
      toggleList: function () {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      // 清空购物车
      empty: function () {
        this.selectFoods.forEach(function (food) {
          food.count = 0;
        });
      },
      // 点击背景折叠购物车
      hideList: function () {
        this.fold = !this.fold;
      },
      // 支付
      pay: function () {
        if (this.totalPrice < this.minPrice) {
          return;
        } else {
          // let money = this.totalPrice + this.deliveryPrice;
          // window.alert('支付' + money + '元');
          // 调用子组件的 food show 方法
          // this.$refs.settlement.show();
          this.$router.push({
            path: '/settlement',
            query: {
              selectFoods: this.selectFoods
            }
          });
        }
      },
      drop: function (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();// 获取对象距离当前视图窗口的距离:top,right,bottom,left
            let x = rect.left - 32;// 购物小球X轴的位置
            let y = -(window.innerHeight - rect.top - 22); // 购物小球Y轴的位置
            el.style.display = '';
            // 纵向动画 el(初始位置为 0，0，0)和购物车icon在一起,将小球(el)放到加号位置去
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            // 横向动画  inner-hook,仅仅定义类 dom选择器,不做样式
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      dropping(el) {
        // 手动触发浏览器重绘,便于translate3d,--rf 变量不会使用
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(function () {
          // 重置小球样式位置，置于购物车按钮位置处
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterDrop(el) {
        // 此轮动画结束后,将此次的ball取出,ball状态重置,进行重用
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    }
  };
</script>

<style>
  @import "shopcart.css";
</style>
