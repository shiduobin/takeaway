<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <!--综合评分-->
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <!--评星-->
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star v-bind:size="36" v-bind:score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" v-bind:score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <!--split组件-->
      <split></split>
      <!--ratingselect评价描述组件-->
      <rateselect
        :desc="desc"
        :ratings="ratings"
        :selectType="selectType"
        :onlyContent="onlyContent"
        @select="selectRating"
        @onlyContent="toggleContent"
      ></rateselect>
      <!--评论列表-->
      <div class="ratings-wrapper">
        <ul>
          <li class="rating-item" v-for="rating in ratings" v-if="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28" alt="">
            </div>
            <div class="content">
              <div class="name">{{rating.username}}</div>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <div class="delivery">{{rating.deliveryTime}}分钟送达</div>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon iconfont icon-haoping"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <!--底部-->
      <div class="foot">
        <div class="title">
          <div class="line"></div>
          <div class="text">已经到底啦</div>
          <div class="line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import star from '../../components/star/star.vue';
  import split from '../../components/split/split.vue';
  import rateselect from '../../components/ratingselect/ratingselect.vue';
  import {formatDate} from '../../common/tool/date';
  import data from '../../common/json/data.json';

  const All = 0; // 全部评价

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: All,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    components: {
      star: star,
      split: split,
      rateselect: rateselect
    },
    created() {
      this.ratings = data.ratings;
      this.$nextTick(function () {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        });
      });
    },
    methods: {
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
    }
  };
</script>

<style>
  @import "ratings.css";
</style>
