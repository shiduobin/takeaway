<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <!-- 头部商品图片 -->
        <div class="image-header">
          <img :src="food.image" alt="">
          <!-- 返回按钮 -->
          <div class="back" v-on:click="hide">
            <i class="icon iconfont icon-fanhui"></i>
          </div>
        </div>
        <!--商品相关信息-->
        <div class="content">
          <!--商品名称-->
          <h1 class="title">{{food.name}}</h1>
          <!--销售量 好评率-->
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <!--价格-->
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <!-- 当所选商品有数量时，显示 cart-control 组件 -->
          <div class="cartcontrol-wrapper" v-show="food.count>0">
            <cartcontrol v-bind:food="food" @add="addFood"></cartcontrol>
          </div>
          <!-- 当所选商品无数量时，显示加入购物车按钮 -->
          <transition name="fade">
            <div class="buy" v-show="!food.count||food.count===0" v-on:click.stop.prevent="addFirst">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <!--商品信息组件-->
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <!--商品评价-->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!--ratingselect评价描述组件-->
          <ratingselect
            @select="selectRating" @onlyContent="toggleContent" :selectType="selectType"
            :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings">
          </ratingselect>
          <!--评价列表-->
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-if="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                  class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar" alt="">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i class="iconfont"
                     :class="{'icon iconfont icon-haoping':rating.rateType===1,'icon iconfont icon-chaping':rating.rateType===-1}"></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div v-show="!food.ratings||!food.ratings.length" class="no-rating">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Bscroll from 'better-scroll';
  import cartcontrol from '../cartcontrol/cartcontrol.vue';
  import split from '../split/split.vue';
  import ratingselect from '../ratingselect/ratingselect.vue';
  import Vue from 'vue';
  import {formatDate} from '../../common/tool/date';

  const All = 0; // 全部评价
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: All,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      show: function () {
        this.showFlag = true;
        this.selectType = All;
        this.onlyContent = false;
        this.$nextTick(function () {
          if (!this.scroll) {
            this.scroll = new Bscroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide: function () {
        this.showFlag = false;
      },
      addFirst: function (event) {
        if (!event._constructed) {
          return;
        } else {
          // 子组件与父组件通信,向父组建传递当前dom对象
          this.$emit('add', event.target);
          Vue.set(this.food, 'count', 1);
        }
      },
      addFood: function (target) {
        // 子组件与父组件通信,向父组建传递当前dom对象
        this.$emit('add', event.target);
      },
      // 子组件选择评价类别向父组件传递type值
      selectRating: function (type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      // 子组件选择是否只看内容向父组件传递onlyContent值
      toggleContent: function () {
        this.onlyContent = !this.onlyContent;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      // 需要展示的评价内容
      needShow: function (type, text) {
        // 只看有内容的评价但当前数据没有内容则返回false被隐藏
        if (this.onlyContent && !text) {
          return false;
        }
        // 如果选择类型为全部则显示全部内容
        if (this.selectType === All) {
          return true;
        } else {
          // 否则选择什么类型显示什么类型的内容
          return type === this.selectType;
        }
      }
    },
    filters: {
      formatDate: function (time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartcontrol: cartcontrol,
      split: split,
      ratingselect: ratingselect
    }
  };
</script>

<style>
  @import "food.css";
</style>
