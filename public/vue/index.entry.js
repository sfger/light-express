import test from "./index.vue";
Vue.component('app', test);
window.app = new Vue({
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
		list: [
			{text:'a'},
			{text:'b'},
			{text:'c'}
		],
		selected:''
	},
	components: {
		'list-item': {
			template: '<li @click="$emit(\'remove\')">{{item.text}}, <slot name="index" txt="test"></slot></li>'
		}
	},
	methods:{
		onChange: function(val, ...arg){
			this.selected = val;
			console.log(arg);
		}
	}
});
