// import Vue from 'vue/dist/vue.common.js';
import Vue from 'vue';
// let Vue = window.Vue;
console.log(Vue);
import App from "./index.vue";
// Vue.component('App', App);

console.log('tet');
var app = window.app = new Vue({
	el: '#app',
	// render: function(c){
	// 	return c(App, {
	// 		props:{
	// 			list:this.list,
	// 			aaa:this.aaa,
	// 			bbb:this.bbb,
	// 			selected:this.selected
	// 		},
	// 		listeners:{
	// 			input: this.pushData
	// 		}
	// 	});
	// },
	data: {
		list:[],
		aaa:'aaa',
		bbb:'bbb',
		selected:'2'
	},
	components: {
		'App': App
		// 'list-item': {
		// 	template:'<li @click="$emit(\'remove\')">{{item.text}}, <slot name="index" txt="test111">111</slot></li>'
		// }
	},
	methods:{
		pushData: function(val, ...arg){
			console.log('sss', val, arg);
			val && this.list.push({text:val});
		}
	}
});

setTimeout(function(){
	app.$data.list = [
		{text:'a'},
		{text:'b'},
		{text:'c'}
	];
}, 1200);
