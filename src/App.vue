<template>
  <div>
    <!-- 头部 -->
    <v-header :seller="seller"></v-header>
    <!-- 主体切换 -->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link v-bind:to="'/goods'">
          商品
        </router-link>
      </div>

      <div class="tab-item">
        <router-link to="/ratings">
          评论
        </router-link>
      </div>

      <div class="tab-item">
        <router-link to="/seller">
          商家
        </router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>


  </div>
</template>
<script type="text/ecmascript-6">
  import header from './components/header/header';
  import {urlParse} from 'common/tool/until';
  import data from 'common/json/data';

  export default {
    data() {
      return {
        seller: {},
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      };
    },
    created() {
      this.seller = data.seller;
    },
    components: {
      'v-header': header
    }
  };
</script>
<style >
  @import "common/style/app.css";
</style>
