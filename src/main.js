// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import vueResource from 'vue-resource';
import App from './App';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

import 'common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(vueResource);
Vue.config.productionTip = false;

const router = new VueRouter({
	linkActiveClass: 'active',
	routes: [
		{
			path: '/goods',
			component: goods
		},
		{
			path: '/ratings',
			component: ratings
		},
		{
			path: '/seller',
			component: seller
		}
	]
});

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	render: h => h(App)
});

router.push('/goods');
