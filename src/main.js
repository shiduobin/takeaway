// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import MintUI from 'mint-ui';
import AMap from 'vue-amap';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
import welcome from './components/welcome/welcome';
import settlement from './components/settlement/settlement';
import positon from './components/position/positon';
import address from './components/address/address';
import newAddress from './components/address/newAddress';
import search from './components/search/search';
import order from './components/order/order';
import './common/style/index.css';
import 'mint-ui/lib/style.css';
import 'vue2-animate/dist/vue2-animate.min.css';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(MintUI);
Vue.use(AMap);

// 初始化vue-amap
AMap.initAMapApiLoader({
  // 申请的高德key
  key: '8aece58a3e5cfe238348e2815aa6a033',
  // 插件集合
  plugin: ['AMap.PlaceSearch', 'AMap.Geolocation']
});

let routes = [
  {
    path: '/welcome',
    name: 'welcome',
    component: welcome
  },
  {
    path: '/settlement',
    name: 'settlement',
    component: settlement
  },
  {
    path: '/app',
    name: 'index',
    component: App,
    children: [
      {path: '/goods', component: goods},
      {path: '/ratings', component: ratings},
      {path: '/seller', component: seller}
    ]
  },
  {
    path: '/position',
    name: 'positon',
    component: positon
  },
  {
    path: '/address',
    name: 'address',
    component: address
  },
  {
    path: '/newAddress',
    name: 'newAddress',
    component: newAddress
  },
  {
    path: '/search',
    name: 'search',
    component: search
  },
  {
    path: '/order',
    name: 'order',
    component: order
  }
];
let router = new VueRouter({
  // mode: 'history',
  linkActiveClass: 'active',
  routes: routes
});
let app = new Vue({
  router: router
}).$mount('#app');
router.push('/goods');
export default app;
