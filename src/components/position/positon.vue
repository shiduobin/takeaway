<template>
  <div>
    <transition name="move">
      <div class="position" v-show="showFlag">
        <div class="pos-title">
          <i class="icon iconfont icon-fanhui" @click="back"></i>
          <p>选择收货地址</p>
          <i class="icon iconfont icon-sousuo" @click="toSearch"></i>
        </div>
        <div id="container"></div>
        <div class="input-box">
          <span class="icon iconfont icon-dingwei"></span>
          <p>{{name}}</p>
          <input readonly="readonly" v-model="address" id="addIpt"/>
        </div>
        <button class="btn-success btn-queding" @click="save">确&nbsp;定</button>
      </div>
    </transition>
    <search ref="sea" :name="name" @itemSearch="itemSearch"></search>
  </div>
</template>

<style scoped>
  @import url(./position.css);
</style>

<script>
  import AMap from 'AMap';
  import search from '../../components/search/search';

  export default {
    data() {
      return {
        searchData: '',
        name: '定位中...',
        address: '',
        lng: '',
        lat: '',
        positionFlag: false, // 定位状态
        showFlag: false
      };
    },
    components: {
      search: search
    },
    methods: {
      show() {
        this.showFlag = true;
        this.geoLocation();
      },
      back() {
        this.showFlag = false;
        this.positionFlag = false;
        this.name = '定位中...';
        this.address = '';
      },
      save() {
        if (this.positionFlag) {
          this.showFlag = false;
          let data = {
            name: this.name,
            address: this.address,
            lng: this.lng,
            lat: this.lat
          };
          this.$emit('position', data);
        }
      },

      // 定位
      geoLocation() {
        var map;
        map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 16
        });
        map.plugin('AMap.Geolocation', () => {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //  是否使用高精度定位，默认:true
            zoomToAccuracy: true,      // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonOffset: new AMap.Pixel(7, 250), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonPosition: 'RB'
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', (data) => {
            this.geoCoder(data);
          });
          AMap.event.addListener(geolocation, 'error', (data) => {
            console.log(data);
          });
        });
      },

      // 逆地理编码
      geoCoder(data) {
        AMap.service(['AMap.Geocoder', 'AMap.PlaceSearch'], () => {
          let Geocoder = new AMap.Geocoder({
            radius: 500,
            extensions: 'all'
          });
          // 经纬度转地址
          Geocoder.getAddress([data.position.getLng(), data.position.getLat()], (status, result) => {
            this.lng = data.position.getLng();
            this.lat = data.position.getLat();
            if (status === 'complete' && result.info === 'OK') {
              let _post = result.regeocode.formattedAddress;
              this.placeSearch(_post);
            }
          });
        });
      },

      // 定位后查询当前地址
      placeSearch(data) {
        let PlaceSearch = new AMap.PlaceSearch({
          pageSize: 1,
          pageIndex: 1,
          city: '010' // 城市
        });
        PlaceSearch.search(data, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.name = result.poiList.pois[0].name;
            this.address = result.poiList.pois[0].address;
            this.lng = JSON.stringify(result.poiList.pois[0].location.lng);
            this.lat = JSON.stringify(result.poiList.pois[0].location.lat);
            this.positionFlag = true; // 定位成功
            document.getElementById('addIpt').readOnly = false;
          }
        });
      },

      // 查询地址组件
      toSearch() {
        this.$refs.sea.show();
      },

      // 选择地址后重新定位
      itemSearch(data) {
        this.placeSearch(data);
      }
    }
  };
</script>
