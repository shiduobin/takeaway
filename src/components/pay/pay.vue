<template>
  <div>
    <div class="pay-choose">
      <transition name="move">
        <div class="pay-list" v-if="showFlag">
          <div class="header">
            <h2>选择支付方式</h2>
            <i class="icon iconfont icon-guanbi" @click="hideList"></i>
          </div>
          <div class="content">
            <ul>
              <li v-for="(item,index) in pay" @click="togglePay(index)">
                <i class="icon iconfont" :class="item.class"></i>
                <p>{{item.name}}<i class="icon iconfont icon-success_fill" :class="{active:index==nowIndex}"></i></p>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--列表背后的蒙版-->
    <transition name="fade">
      <div class="list-mask" v-if="showFlag"></div>
    </transition>
  </div>
</template>

<style>
  @import "pay.css";
</style>

<script>
  import payData from '../../common/json/data';

  export default {
    data() {
      return {
        pay: '',
        showFlag: false,
        nowIndex: 0  // 默认第一种支付方式
      };
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      togglePay: function (index) {
        this.nowIndex = index;
        this.$emit('choose', this.pay[index].name);
        this.showFlag = false;
      },
      hideList: function () {
        this.showFlag = false;
      }
    },
    mounted() {
      this.pay = payData.pay;
      this.$emit('choose', this.pay[0].name);
    }
  };
</script>
