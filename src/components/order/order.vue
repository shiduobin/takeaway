<template>
  <transition name="move">
    <div class="order" v-if="showFlag" ref="orderWrapper">
      <div class="order-content">
        <div class="header">
          <div class="back" @click="back">
            <i class="icon iconfont icon-fanhui"></i>
          </div>
          <p class="success">下单成功</p>
          <div class="thanks">
            感谢您对贝壳外卖的信任，期待再次光临
          </div>
        </div>
        <div class="content">
          <div class="seller-box">
            <p class="seller-name">{{seller.name}}</p>
            <ul>
              <li v-for="(food, index) in food">
                <span>{{food.name}}</span>
                <span>×{{food.count}}</span>
                <span>￥{{food.price * food.count}}</span>
              </li>
              <li class="preferential">
                <span>在线支付立减优惠</span>
                <p>
                  <span class="jian">-</span><span>¥</span>
                  <span>5</span>
                </p>
              </li>
              <li>
                <div class="content-bottom">
                  <a href='tel:18888888888'><i class="icon iconfont icon-dianhua"></i>联系商家</a>
                  <p>实付<span class="yuan">¥</span><span class="num">{{payMoney}}</span></p>
                </div>
              </li>
            </ul>
          </div>
          <div class="distribution-box">
            <p class="distribution-info">配送信息</p>
            <ul>
              <li>
                <label>送达时间：</label>
                <div class="box">尽快送达</div>
              </li>
              <li>
                <label>收货地址：</label>
                <div class="box">
                  <p class="address">{{selectAddress.name}}{{selectAddress.address}}{{selectAddress.house}}</p>
                  <p class="user">{{selectAddress.username}}</p>
                </div>
              </li>
              <li>
                <label>配送方式：</label>
                <div class="box">贝壳专送</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style>
  @import url('./order.css');
</style>

<script>
  import sellerData from '../../common/json/data';
  import Bscroll from 'better-scroll';

  export default {
    props: {
      food: {
        type: Array
      },
      totalPrice: {
        type: Number
      },
      selectAddress: {
        type: Object
      }
    },
    data() {
      return {
        seller: '',
        payMoney: 1000,
        showFlag: false
      };
    },
    methods: {
      show() {
        let totalPrice = this.totalPrice;
        let deliveryPrice = this.seller.deliveryPrice; // 配送费
        let preferential = this.seller.preferential; // 满减
        this.payMoney = totalPrice + deliveryPrice - preferential;
        this.showFlag = true;
        this.$nextTick(function () {
          this.scroll = new Bscroll(this.$refs.orderWrapper, {
            click: true
          });
        });
      },
      back() {
        this.showFlag = false;
      }
    },
    mounted() {
      this.seller = sellerData.seller;
    }
  };
</script>
