<template>
  <transition name="move">
    <div class="settlement" ref="settlement">
      <div class="settlement-wrapper" ref="settlementWrapper">
        <div class="settlement-cont">
          <div class="address">
            <!-- 返回按钮 -->
            <div class="back" @click="goBack">
              <i class="icon iconfont icon-fanhui"></i>
            </div>
            <p class="add-title">订单配送至</p>
            <p class="add-second">{{streetString}}</p><i class="icon iconfont icon-shouhuodizhiyebianji"></i>
            <p class="user">联系人：张三 18888888888</p>
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
          <div class="foods-box" ref="foodsWrapper">
            <p class="seller-name">{{seller.name}}</p>
            <ul>
              <li v-for="food in selectFood">
                <span>{{food.name}}</span>
                <span>×{{food.count}}</span>
                <span>￥{{food.price * food.count}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="pay-yes">
        <div class="content">
          <div class="content-left">
            <div class="price">￥{{totalPrice}}</div>
            <div class="desc">另需配送费￥{{seller.deliveryPrice}}元</div>
          </div>
          <div class="content-right">
            <div class="pay">确认支付</div>
          </div>
        </div>
      </div>
      <payChoose @choose="choose" ref="choosepay"></payChoose>
    </div>
  </transition>
  <!--<site></site>-->
</template>

<script>
  import Bscroll from 'better-scroll';
  import sellerData from '../../common/json/data';
  import shopcart from '../../components/shopcart/shopcart';
  import site from '../../components/address/address';
  import payChoose from '../../components/pay/pay';

  export default {
    data() {
      return {
        streetString: '请选择地址',
        time: '',
        selectFood: {},
        seller: {},
        means: '',
        listShow: false
      }
        ;
    },
    components: {
      shopcart: shopcart,
      site: site,
      payChoose: payChoose
    },
    methods: {
      // 初始化 better-scroll
      _initScroll: function () {
        if (!this.scroll) {
          this.scroll = new Bscroll(this.$refs.settlement, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      goBack() {
        this.$router.push('/goods');
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
      choose(data) {
        this.means = data;
      },
      choosePay() {
        this.$refs.choosepay.show();
      }
    },
    computed: {
      // 商品总价格
      totalPrice: function () {
        let total = 0;
        Object.keys(this.selectFood).forEach(food => {
          total += this.selectFood[food].price * this.selectFood[food].count;
        });
        return total;
      }
    },
    mounted() {
      this.selectFood = this.$route.query.selectFoods;
      this.seller = sellerData.seller;
      this.getDate(35);
    },
    created() {
      this.$nextTick(() => {
        this._initScroll();
      });
    }
  };
</script>

<style scoped>
  @import url(./settlement.css);
</style>
