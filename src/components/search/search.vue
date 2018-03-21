<template>
  <transition name="move">
    <div class="search" v-if="showFlag">
      <div class="ipt-box">
        <i class="icon iconfont icon-sousuo"></i>
        <input v-model="keywords" @input="keyUpSearch(keywords)" class="search-ipt" type="text" autofocus="autofocus"
               placeholder="小区/写字楼/学校 等"/>
        <span class="cancel" @click="back">取消</span>
      </div>
      <div ref="addressWraper" class="addressWraper">
        <div>
          <div class="address_content">
            <ul>
              <li v-for="(item,index) in searchData" @click="choseItem(item)">
                <div v-if="index===0 && item.address!==''">
                  <label><i class="icon iconfont icon-dingwei"></i></label>
                  <div class="address-box">
                    <p class="name">{{ item.name }}</p>
                    <p class="address" style="color: #333">{{ item.address }}</p>
                  </div>
                </div>
                <div v-else-if="item.address!==''">
                  <label><span class="circle"></span></label>
                  <div class="address-box">
                    <p class="name">{{ item.name }}</p>
                    <p class="address">{{ item.address }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
  @import url('./search.css');
</style>

<script>
  import AMap from 'AMap';
  import Bscroll from 'better-scroll';

  export default {
    data() {
      return {
        keywords: '',
        searchData: '',
        showFlag: false
      };
    },
    props: ['name'],
    methods: {
      show() {
        this.showFlag = true;
        this.keyUpSearch(this.name);
        this.$nextTick(function () {
          this.scroll = new Bscroll(this.$refs.addressWraper);
        });
      },
      back() {
        this.showFlag = false;
        this.keywords = '';
      },
      keyUpSearch(keywords) {
        if (keywords.length > 0) {
          AMap.service(['AMap.PlaceSearch'], () => {
            var placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
              pageSize: 30,
              pageIndex: 1,
              city: '010' // 城市
            });
            // 关键字查询
            placeSearch.search(keywords, (status, result) => {
              if (status === 'complete' && result.info === 'OK') {
                this.searchData = {};
                this.searchData = result.poiList.pois;
              }
            });
          });
        } else {
          this.searchData = {};
        }
      },
      choseItem(item) {
        this.$emit('itemSearch', item.name);
        this.showFlag = false;
      }
    }
  };
</script>
