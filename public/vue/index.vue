<template>
	<div id="app">
		<transition-group appear name="fade" tag="ol" v-if="!!list.length">
			<li is="list-item" v-for="(item,i) in list" :item="item" @remove="remove(i)" :key="item.text">
				<template scope="props" slot="index">这是第{{i+1}}个元素{{props.txt}} {{$attrs.aaa + ' ' + $attrs.bbb}}</template>
			</li>
		</transition-group>
		<ol v-else>
			<li style="list-style:none;">暂无数据！</li>
		</ol>
		<select v-model="data">
			<option value="">请选择</option>
			<option value="0">A</option>
			<option value="1">B</option>
			<option value="2">C</option>
		</select>
		<span>Selected:{{data}}</span>
	</div>
</template>
<script>
import item from './item.vue';
export default {
	inheritAttrs: false,
	name: 'app',
	props: ['value', 'list'],
	components: {
		'list-item':item
	},
	computed: {
		data: {
			get: function(){
				return this.value;
			},
			set: function(val){
				console.log('select input',val);
				this.$emit('input',val,1,2,3,4);
			}
		}
	},
	methods: {
		/*
		changeData: function(e){
			console.log(e);
			this.$emit('input', e.target.value,1,2,3,4);
		},*/
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
