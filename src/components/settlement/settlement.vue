<template>
  <div class="settlement" v-show="showFlag" ref="settlement">
    <!-- 返回按钮 -->
    <div class="back" v-on:click="hide">
      <i class="icon iconfont icon-undo"></i>
    </div>
    <div class="address">
      <p class="add-title">订单配送至</p><i class="icon iconfont icon-shouhuodizhiyebianji"></i>
    <!--  <p class="add-first">{{ addressProvince }} {{ addressCity }} {{addressXian}}</p>-->
      <p class="add-second">{{addressStreet}}</p>
      <p>联系人：</p>
    </div>

    <div>
      <mt_picker :slots="addressSlots" class="picker" @change="onAddressChange" :visible-item-count="3"></mt_picker>
    </div>
    <div>
      <mt-picker :slots="streetSlots" class="picker" @change="onStreetChange" :visible-item-count="1"></mt-picker>
    </div>

  </div>
</template>

<script>
  import Vue from 'vue';
  import {Picker} from 'mint-ui';

  Vue.component(Picker.name, Picker);
  import addressData from '../../common/json/address';

  export default {
    data() {
      return {
        showFlag: false,
        // 省-市-区
        addressSlots: [
          {
            flex: 1,
            defaultIndex: 1, // 默认显示的第一个值的位置
            values: Object.keys(addressData),  // 省份数组
            className: 'slot1',
            textAlign: 'center'
          }, {
            divider: true,
            content: '-',
            className: 'slot2'
          }, {
            flex: 1,
            values: [],
            className: 'slot3',
            textAlign: 'center'
          },
          {
            divider: true,
            content: '-',
            className: 'slot4'
          },
          {
            flex: 1,
            values: [],
            className: 'slot5',
            textAlign: 'center'
          }
        ],
        // 街道
        streetSlots: [
          {
            flex: 1,
            values: [],
            className: 'slot6',
            textAlign: 'center'
          }
        ],
        addressProvince: '请选择省',
        addressCity: '请选择市',
        addressXian: '请选择区/县',
        addressStreet: '请选择街道'
      };
    },
    components: {
      mt_picker: Picker
    },
    methods: {
      show: function () {
        this.showFlag = true;
      },
      onAddressChange: function (picker, values) {
        let province = Object.keys(addressData[values[0]]);
        let index = province.indexOf(values[1]);
        let xian = addressData[values[0]][province[index]];
        this.xianObj = xian;
        picker.setSlotValues(1, province);
        this.addressProvince = values[0];
        this.addressCity = values[1];
        this.addressXian = values[2];
        picker.setSlotValues(2, Object.keys(xian));
      },
      onStreetChange: function (picker, values) {
        this.addressStreet = values[0];
      }
    },
    mounted() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.addressSlots[0].defaultIndex = 0;
        }, 100);
      });
    },
    watch: {
      addressXian: {
        handler(val, oldval) {
          let street = this.xianObj[this.addressXian];
          console.log(street);
          this.streetSlots[0].values = street;
        }
      }
    }
  };
</script>

<style scoped>
  @import url(./settlement.css);
</style>
