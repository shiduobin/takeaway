<template>
  <transition name="move">
    <div class="goods">
      <!--左侧菜单栏-->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="(item, index) in goods" class="menu-item" v-bind:class="{'current':currentIndex === index}"
              v-on:click="selectMenu(index,$event)">
          <span class="text border-1px">
            <!--图标-->
            <span v-show="item.type>0" class="icon" v-bind:class="classMap[item.type]"></span>
            <!--商品名-->
            <span>{{item.name}}</span>
          </span>
          </li>
        </ul>
      </div>
      <!--右侧商品详情-->
      <div class="foods-wrapper" ref="foodWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <!--列表名-->
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" v-on:click="seeFood(food,$event)">
                <!--商品图片-->
                <div class="img-icon">
                  <img v-bind:src="food.icon" width="64" height="64">
                </div>
                <!--商品信息-->
                <div class="content">
                  <span class="name">{{food.name}}</span>
                  <span class="remark" v-if="food.remark">({{food.remark}})</span>
                  <div class="describe" v-if="food.description">
                    <p class="desc">{{food.description}}</p>
                  </div>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now"><span class="icon-font">￥</span>{{food.price}}</span>
                    <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                  </div>
                  <!-- cartcontrol添加商品组件 -->
                  <div class="cartcontrol-wrapper">
                    <cartcontrol v-bind:food="food" v-on:add="addFood"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!--shopcart底部购物车组件-->
      <shopcart ref="shopcart" v-bind:delivery-price="seller.deliveryPrice" v-bind:min-price="seller.minPrice"
                v-bind:select-foods="selectFoods"></shopcart>
      <!--food商品详情页组件-->
      <food v-bind:food="seeFoodinfo" v-on:add="addFood" ref="food"></food>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import data from '../../common/json/data.json';
  import Bscroll from 'better-scroll';
  import shopcart from '../../components/shopcart/shopcart';
  import cartcontrol from '../../components/cartcontrol/cartcontrol';
  import food from '../../components/food/food';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    // 注册组件
    components: {
      shopcart: shopcart,
      cartcontrol: cartcontrol,
      food: food
    },
    data() {
      return {
        goods: [], // 商品信息
        listHeight: [], // 菜单列表元素
        scrolly: 0,  // 食物列表滚动的高度实时计算
        seeFoodinfo: {} // 选中的商品用以查看商品详情
      };
    },
    created() {
      this.goods = data.goods;
      this.$nextTick(() => {
        this._initScroll();
        this._calculateHeight();
      });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee', 'hot'];
    },
    computed: {
      // 根据食物列表所处的位置，判断菜单的class
      currentIndex: function () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrolly >= height1 && this.scrolly < height2)) {
            return i;
          }
        }
        return 0;
      },
      // 选中的商品即购物车内的商品
      selectFoods: function () {
        let foods = [];
        this.goods.forEach(function (good) {
          good.foods.forEach(function (food) {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    methods: {
      // foodlist 的 height 的高度变化 自动触发计算属性 currentIndex的变化
      selectMenu: function (index, event) {
        // 去掉自带click事件的点击
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodScroll.scrollToElement(el, 300);
      },
      // 初始化 better-scroll
      _initScroll: function () {
        this.menuScroll = new Bscroll(this.$refs.menuWrapper, {
          click: true // 允许点击
        });
        this.foodScroll = new Bscroll(this.$refs.foodWrapper, {
          probeType: 3, // 实时侦测滚动
          click: true
        });
        this.foodScroll.on('scroll', (pos) => {
          this.scrolly = Math.abs(Math.round(pos.y));
        });
      },
      // 计算菜单栏元素
      _calculateHeight: function () {
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height); // 将第一个高度放进数组
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight; // 获取每一个food-list的高度做累加
          this.listHeight.push(height);
        }
      },
      _drop: function (target) {
        // 体验优化,异步执行下落动画
        this.$nextTick(function () {
          this.$refs.shopcart.drop(target);
        });
      },
      // 子组件$emit派发而来的事件
      addFood: function (target) {
        this._drop(target);
      },
      // 查看商品详情
      seeFood(food, event) {
        if (!event._constructed) {
          return;
        } else {
          this.seeFoodinfo = food;
          // 调用子组件的 food show 方法
          this.$refs.food.show();
        }
      }
    }
  };
</script>

<style>
  @import "goods.css";
</style>
