<template>
  <div>
    <transition name="move">
      <div class="choseAddress" v-if="showFlag">
        <div class="chose-title">
          <!-- 返回按钮 -->
          <div class="back" @click="hideList">
            <i class="icon iconfont icon-fanhui"></i>
          </div>
          <span>选择收货地址</span>
          <span @click="toNewAddress">新增地址</span>
        </div>
        <div ref="choseAddress" class="addressWrapper">
          <div>
            <div v-if="Object.keys(address2).length>0">
              <div class="address1-wrapper">
                <ul>
                  <li v-for="item in address2" v-if="item.within"
                      v-on:click.stop.prevent.once="selAddress(item,$event)">
                    <p>
                      <span class="address1">{{item.name}}</span>
                      <span class="tag" v-if="item.tag">{{item.tag}}</span>
                    </p>
                    <p>
                      <span class="address2">{{item.address}}&nbsp;{{item.house}}</span>
                    </p>
                    <p>
                      <span class="user">{{item.username}}</span>
                      <span class="sex" v-if="item.sex==1">(先生)</span>
                      <span class="sex" v-if="item.sex==0">(女士)</span>
                      <span class="phone">{{item.phone}}</span>
                    </p>
                  </li>
                </ul>
              </div>
              <split></split>
              <div class="address2-wrapper">
                <p class="address2-title">已下地址超出配送范围</p>
                <ul style="opacity: 0.5">
                  <li v-for="item in address2" v-if="!item.within" @click="warning">
                    <p>
                      <span class="address1">{{item.name}}</span>
                      <span class="tag" v-if="item.tag">{{item.tag}}</span>
                    </p>
                    <p>
                      <span class="address2">{{item.address}}&nbsp;{{item.house}}</span>
                    </p>
                    <p>
                      <span class="user">{{item.username}}</span>
                      <span class="sex" v-if="item.sex==1">(先生)</span>
                      <span class="sex" v-if="item.sex==0">(女士)</span>
                      <span class="phone">{{item.phone}}</span>
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <new-address ref="newAddress" @refreshAddress="refreshAddress"></new-address>
  </div>
</template>

<style scoped>
  @import "address.css";
</style>

<script>
  import split from '../../components/split/split';
  import newAddress from './newAddress';
  import Bscroll from 'better-scroll';
  import AMap from 'AMap';
  import {MessageBox, Indicator} from 'mint-ui';

  export default {
    data() {
      return {
        address1: {},
        address2: {},
        showFlag: false,
        num: 0,
        lng: 0,
        lat: 0
      };
    },
    components: {
      split: split,
      newAddress: newAddress
    },
    methods: {
      show() {
        this.showFlag = true;
        this.geoLocation();
        this.$nextTick(function () {
          this.scroll = new Bscroll(this.$refs.choseAddress, {
            click: true
          });
        });
      },
      hideList: function () {
        this.showFlag = false;
        this.address1 = {};
        this.address2 = {};
      },
      geoLocation() {
        this.num = 0;
        Indicator.open({
          text: '加载中',
          spinnerType: 'triple-bounce'
        });
        var map;
        map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 16
        });
        // 定位获取当前位置
        map.plugin('AMap.Geolocation', () => {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', (data) => {
            this.lng = data.position.getLng();
            this.lat = data.position.getLat();
            this.getAddress();
          });
          AMap.event.addListener(geolocation, 'error', (data) => {
            console.log(data.result);
          });
        });
      },
      // 获取之前添加的地址
      getAddress() {
        this.$http.get('/api/selAddress').then((response) => {
          console.log('查询数据库地址：', response.data);
          this.address1 = response.data;
          response.data.forEach((val) => {
            this.geoCoder(val.name);
          });
        });
      },
      // 将地址转换成经纬度
      geoCoder(name) {
        AMap.service(['AMap.Geocoder'], () => {
          let geoCoder = new AMap.Geocoder({
            city: '010', // 城市，默认：'全国'
            radius: 1000 // 范围，默认：500
          });
          // 地理编码,返回地理编码结果
          geoCoder.getLocation(name, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              let geocode = result.geocodes;
              let geoCoderArr = [];
              geocode.forEach((val) => {
                geoCoderArr.push(val.location.getLng());
                geoCoderArr.push(val.location.getLat());
                this.getDistance(geoCoderArr, name);
              });
            }
          });
        });
      },

      // 计算当前定位地址与保存地址之间的距离
      getDistance(data, name) {
        this.num++;
        let lnglat1 = new AMap.LngLat(this.lng, this.lat);
        let lnglat2 = new AMap.LngLat(data[0], data[1]);
        if (Math.round(lnglat1.distance(lnglat2)) < 5000) {
          this.address1.forEach((v) => {
            if (v.name === name) {
              v.within = true;
            }
          });
        } else {
          this.address1.forEach((v) => {
            if (v.name === name) {
              v.within = false;
            }
          });
        }
        if (this.num === this.address1.length) {
          this.address2 = this.address1;
          Indicator.close();
        }
      },

      // 添加地址成功
      refreshAddress() {
        this.getAddress();
      },

      // 将选择的地址传给父组件
      selAddress(item, event) {
        if (!event._constructed) {
          return;
        }
        this.showFlag = false;
        this.$emit('item', item);
        this.address1 = {};
        this.address2 = {};
      },

      // 超出配送地址提示
      warning() {
        MessageBox({
          title: '超出配送范围',
          message: '当前选择地址超出商家配送范围，请您重新选择地址！',
          showConfirmButton: true
        });
      },

      // 新增地址
      toNewAddress() {
        this.$refs.newAddress.show();
      }
    }
  };
</script>
