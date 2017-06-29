import test from "./index.vue";
let Vue = window.Vue;
Vue.component('app', test);
var app = window.app = new Vue({
	el: '#app',
	// render: function(c){
	// 	return c('app', {
	// 		props:{
	// 			list:this.list,
	// 			selected:this.selected
	// 		}
	// 	});
	// },
	data: {
		list: [],
		selected:'2'
	},
	components: {
		'list-item': {
			template: '<li @click="$emit(\'remove\')">{{item.text}}, <slot name="index" txt="test"></slot></li>'
		}
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
