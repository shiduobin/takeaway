<template>
  <div>
    <div class="choseAddress" ref="choseAddress">
      <div class="chose-title">
        <!-- 返回按钮 -->
        <div class="back">
          <i class="icon iconfont icon-fanhui"></i>
        </div>
        <span>选择收货地址</span>
      </div>
      <split></split>
      <div class="address1-wrapper">
        <ul>
          <li v-for="item in address" v-if="!item.exceed">
            <p>
              <span class="address1">{{item.address1}}</span>
              <span class="tag">{{item.tag}}</span>
            </p>
            <p>
              <span class="address2">{{item.address2}}</span>
            </p>
            <p>
              <span class="user">{{item.user}}</span><span class="sex" v-if="item.sex===1">(先生)</span><span class="sex"
                                                                                                            v-else="item.sex===0">(女士)</span>
              <span class="phone">{{item.phone}}</span>
            </p>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="address2-wrapper">
        <p class="address2-title">已下地址超出配送范围</p>
        <ul>
          <li v-for="item in address" v-if="item.exceed">
            <p>
              <span class="address1">{{item.address1}}</span>
              <span class="tag">{{item.tag}}</span>
            </p>
            <p>
              <span class="address2">{{item.address2}}</span>
            </p>
            <p>
              <span class="user">{{item.user}}</span><span class="sex" v-if="item.sex===1">(先生)</span><span class="sex"
                                                                                                            v-else="item.sex===0">(女士)</span>
              <span class="phone">{{item.phone}}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import "address.css";
</style>

<script>
  import split from '../../components/split/split';
  import data from '../../common/json/data.json';
  import Bscroll from 'better-scroll';

  export default {
    data() {
      return {
        address: {}
      };
    },
    components: {
      split: split
    },
    methods: {
      // 初始化 better-scroll
      _initScroll: function () {
        if (!this.scroll) {
          this.scroll = new Bscroll(this.$refs.choseAddress, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      }
    },
    mounted() {
      this.address = data.address;
    },
    created() {
      this.$nextTick(() => {
        this._initScroll();
      });
    }
  };
</script>
