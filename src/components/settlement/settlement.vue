<template>
  <transition name="move">
    <div class="settlement" v-if="listShow" ref="settlement">
      <div class="settlement-content">
        <div class="address">
          <!-- 返回按钮 -->
          <div class="back" @click="goBack">
            <i class="icon iconfont icon-fanhui"></i>
          </div>
          <p class="add-title">订单配送至</p>
          <div v-if="selectAddress" @click="chooseAddres">
            <p class="select-address">{{selectAddress.name}}{{selectAddress.address}}{{selectAddress.house}}</p>
            <i class="icon iconfont icon-jiantouyou" style="font-size: 14px;"></i>
            <p class="select-user">
              {{selectAddress.username}}
              <span v-if="selectAddress.sex=='1'">(先生)</span>
              <span v-if="selectAddress.sex=='0'">(女士)</span>
              <span>{{selectAddress.phone}}</span>
            </p>
          </div>
          <div v-else @click="chooseAddres">
            <p class="add-second">{{streetString}}</p>
            <i class="icon iconfont icon-jiantouyou"></i>
          </div>
        </div>
        <div class="time">
          <div class="time-box">
            <p class="time_1">送达时间</p>
            <p class="time_2">尽快送达({{time}})</p>
          </div>
          <span>贝壳专送</span>
          <span>准时达</span>
          <span>支持预定</span>
          <p class="line"></p>
          <div class="pay-box" @click="choosePay">
            <p class="pay_1">支付方式</p>
            <p class="pay_2">{{means}}<i class="icon iconfont icon-jiantouyou"></i></p>
          </div>
        </div>
        <div class="foods-box">
          <p class="seller-name">{{seller.name}}</p>
          <ul>
            <li v-for="(food, index) in food">
              <span>{{food.name}}</span>
              <span>×{{food.count}}</span>
              <span>￥{{food.price * food.count}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="pay-yes">
        <div class="content">
          <div class="content-left">
            <div class="price">￥{{totalPrice}}</div>
            <div class="desc">另需配送费￥{{seller.deliveryPrice}}元</div>
          </div>
          <div class="content-right">
            <div class="pay" @click="pay">确认支付</div>
          </div>
        </div>
      </div>
      <site ref="address" @item="getAddress"></site>
      <payChoose @choose="choose" ref="choosepay"></payChoose>
      <order ref="order" v-bind:food="food" v-bind:totalPrice="totalPrice" v-bind:selectAddress="selectAddress"></order>
    </div>
  </transition>
</template>

<script>
  import Bscroll from 'better-scroll';
  import sellerData from '../../common/json/data';
  import shopcart from '../../components/shopcart/shopcart';
  import site from '../../components/address/address';
  import payChoose from '../../components/pay/pay';
  import order from '../../components/order/order';
  import {Toast, Indicator} from 'mint-ui';

  export default {
    props: {
      food: {
        type: Array
      },
      totalPrice: {
        type: Number
      }
    },
    data() {
      return {
        streetString: '请选择地址',
        time: '',
        selectFood: [],
        seller: {},
        means: '',
        listShow: false,
        selectAddress: ''
      };
    },
    components: {
      shopcart: shopcart,
      site: site,
      payChoose: payChoose,
      order: order
    },
    methods: {
      show() {
        this.listShow = true;
        this.$nextTick(function () {
          this.scroll = new Bscroll(this.$refs.settlement, {
            click: true
          });
        });
      },
      goBack() {
        this.listShow = false;
      },
      getDate(addMounties) {
        var date = new Date();
        var H, M;
        if (date.getMinutes() + addMounties < 60) {
          H = date.getHours();
        } else {
          H = date.getHours() + 1;
        }
        date.setMinutes(date.getMinutes() + addMounties);
        M = date.getMinutes();
        M = M > 9 ? M : '0' + M;
        this.time = H + ':' + M;
      },
      getAddress(item) {
        this.selectAddress = item;
      },
      choose(data) {
        this.means = data;
      },
      chooseAddres() {
        this.$refs.address.show();
      },
      choosePay() {
        this.$refs.choosepay.show();
      },
      pay() {
        if (this.selectAddress === '') {
          Toast({
            message: '请选择收货地址',
            position: 'middle',
            duration: 1000
          });
        } else {
          Indicator.open({
            text: '支付中',
            spinnerType: 'triple-bounce'
          });
          setTimeout(() => {
            Indicator.close();
            this.$refs.order.show();
          }, 2000);
        }
      }
    },
    mounted() {
      this.seller = sellerData.seller;
      this.getDate(38);
    }
  };
</script>

<style scoped>
  @import url(./settlement.css);
</style>
