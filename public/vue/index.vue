<template>
	<div id="app">
		<transition-group appear name="fade" tag="ol">
			<li is="list-item" v-for="(item,i) in list" :item="item" @remove="remove(i)" :key="item">
				正在加载中……
				<template scope="props" slot="index">这是第{{i+1}}个元素{{props.txt}}</template>
			</li>
		</transition-group>
		<select v-model="selectedValue">
			<option value="">请选择</option>
			<option value="0">A</option>
			<option value="1">B</option>
			<option value="2">C</option>
		</select>
		<span>Selected:{{selectedValue}}</span>
	</div>
</template>
<script>
import item from './item.vue';
export default{
	name: 'app',
	props: ['list', 'selected'],
	components: {
		'list-item':item
	},
	data: function(){
		return {
			selectedValue: this.selected
		}
	},
	watch: {
		selectedValue: function(val, o){
			// this.$parent.$data.selected = val;
			this.$emit('test', val,1,2,3,4);
		}
	},
	methods: {
		remove: function(i){
			this.list.splice(i,1);
		}
	}
};
</script>
<style lang="scss">
.fade-enter-active,.fade-leave-active{
	transition:opacity .5s;
}
.fade-enter,.fade-leave-active{
	opacity:0;
}
</style>
