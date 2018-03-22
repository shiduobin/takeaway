<template>
  <div>
    <transition name="move">
      <div class="newAddress" v-if="showFlag">
        <div class="newAddress-title">
          <!-- 返回按钮 -->
          <div class="back" @click="back">
            <i class="icon iconfont icon-fanhui"></i>
          </div>
          <span>新增地址</span>
        </div>
        <div class="newAddress-content">
          <ul>
            <li>
              <label>联系人</label>
              <input type="text" v-model="username" ref="username" class="username" placeholder="姓名"/>
              <!-- <span class="sex man">先生</span><span class="sex woman">女士</span>-->
              <ul>
                <li @click="activeSex(1)">
                  <i class="icon iconfont icon-nanshi" :class="{active:sex=='1'}"></i>
                </li>
                <li @click="activeSex(0)">
                  <i class="icon iconfont icon-nvshi" :class="{active:sex=='0'}"></i>
                </li>
              </ul>
            </li>
            <li>
              <label>电话</label>
              <input type="text" v-model="phone" ref="phone" class="phone" placeholder="手机号码"/>
            </li>
            <li>
              <label class="label-address">地址</label>
              <div @click="toPosition" style="width: 70%;display: inline-block;line-height: 70px;" v-if="!name">
                <p class="address-placeholder">请选择收货地址</p>
                <i class="icon iconfont icon-jiantouyou"></i>
              </div>
              <div @click="toPosition" style="width: 70%;display: inline-block;position:relative;" v-else>
                <p class="name">{{name}}</p>
                <p class="address">{{address}}</p>
                <i class="icon iconfont icon-jiantouyou"
                   style="position: absolute;top: -3px;right: 15px;"></i>
              </div>
            </li>
            <li>
              <label>门牌号</label>
              <input type="text" v-model="house" ref="house" class="house" placeholder="例：11斋307"/>
            </li>
            <li>
              <label>标签</label>
              <span v-for="(item,index) in tagParam" class="tag" :class="{act:nowIndex==index}"
                    @click="selTag(index,item)">{{item}}</span>
            </li>
          </ul>
        </div>
        <div class="btn-box">
          <button class="btn btn-success save" @click="checkAddress">保存并使用</button>
        </div>
      </div>
    </transition>
    <position ref="position" @position="chosePosition"></position>
  </div>
</template>

<style>
  @import url('./address.css');
</style>

<script>
  import {Toast} from 'mint-ui';
  import position from '../../components/position/positon';

  export default {
    data() {
      return {
        username: '',
        phone: '',
        sex: 1,
        name: '',
        address: '',
        lng: '',
        lat: '',
        tag: '',
        house: '',
        nowIndex: 5,
        tagParam: ['公司', '家', '学校'],
        showFlag: false
      };
    },
    components: {
      position: position
    },
    methods: {
      show() {
        this.showFlag = true;
      },
      back() {
        this.showFlag = false;
      },
      activeSex(sex) {
        this.sex = sex;
      },
      toPosition() {
        this.$refs.position.show();
      },
      selTag(index, item) {
        this.tag = item;
        this.nowIndex = index;
      },
      chosePosition(data) {
        this.name = data.name;
        this.address = data.address;
        this.lng = data.lng;
        this.lat = data.lat;
      },
      checkAddress() {
        var reg = /^1[0-9]{10}$/;
        let username = this.$refs.username.value;
        let phone = this.$refs.phone.value;
        let house = this.$refs.house.value;
        let name = this.name;
        let address = this.address;
        let lng = this.lng;
        let lat = this.lat;
        let sex = this.sex;
        let tag = this.tag;
        if (username === '') {
          Toast({
            message: '请填写收货人',
            position: 'bottom',
            duration: 2000
          });
          return false;
        }
        if (phone === '') {
          Toast({
            message: '请填写手机号码',
            position: 'bottom',
            duration: 2000
          });
          return false;
        }
        if (!reg.test(phone)) {
          Toast({
            message: '手机号码不正确',
            position: 'bottom',
            duration: 2000
          });
          return false;
        }
        if (house === '') {
          Toast({
            message: '请填写门牌号',
            position: 'bottom',
            duration: 2000
          });
          return false;
        }
        if (name === '' || address === '') {
          Toast({
            message: '请选择地址',
            position: 'bottom',
            duration: 2000
          });
          return false;
        }
        this.$http.post('/api/addAddress', {
          name: name,
          address: address,
          lng: lng,
          lat: lat,
          tag: tag,
          username: username,
          sex: sex,
          phone: phone,
          house: house
        }, {})
          .then((response) => {
            if (response.status === 200) {
              this.showFlag = false;
              this.$emit('refreshAddress');
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  };
</script>
