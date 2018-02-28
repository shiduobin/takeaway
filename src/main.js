// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import MintUI from 'mint-ui';
import App from './App';
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
import welcome from './components/welcome/welcome';
import settlement from './components/settlement/settlement';
import './common/style/index.css';
import 'mint-ui/lib/style.css';

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(MintUI);

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
router.push('/welcome');
export default app;
