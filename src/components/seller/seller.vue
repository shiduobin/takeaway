<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <!--概述-->
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <div class="text">({{seller.ratingCount}})</div>
          <div class="text">月售{{seller.sellCount}}单</div>
        </div>
        <ul class="remark">
          <li class="block">
            <h1 class="title">起送价</h1>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h1 class="title">商家配送</h1>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h1 class="title">平均配送时间</h1>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <!--收藏-->
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon iconfont icon-shoucang" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <!--商家公告-->
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <!-- supports内容 -->
        <ul v-if="seller.supports" class="support">
          <li class="support-item" v-for="(item,index) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text"> {{seller.supports[index].description}} </span>
          </li>
        </ul>
      </div>
      <split></split>
      <!--商家实景-->
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="picwrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img width="120" height='90' :src="pic" alt="">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <!--商家信息-->
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
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
  import star from '../../components/star/star.vue';
  import split from '../../components/split/split.vue';
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from '../../common/tool/store';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee', 'hot'];
    },
    components: {
      star: star,
      split: split
    },
    mounted: function () {
      // 确保dom加载完毕后加载BScroll插件
      this.$nextTick(function () {
        this._initScroll();
        this._initPicScroll();
      });
    },
    /**
     * 必须等到seller数据,异步加载完成后,才能执行_initPicScroll方法
     * 将其方法执行放在watch对象中,当观测到seller数据,或得到之后执行 _initPicScroll 方法
     */
    watch: {
      // 当watch到seller数据生成时就可以执行_initScroll()和_initPicScroll方法
      seller: function () {
        this.$nextTick(function () {
          this._initScroll();
          this._initPicScroll();
        });
      }
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '未收藏';
      }
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPicScroll() {
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = this.seller.pics.length * (picWidth + margin) - margin;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(function () {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true, // 横向滚动
                eventPassthrough: 'vertical' // 允许外层竖向滚动，内层横向滚动
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      },
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        } else {
          this.favorite = !this.favorite;
          saveToLocal(this.seller.id, 'favorite', this.favorite);
        }
      }
    }
  };
</script>

<style>
  @import "seller.css";
</style>
