<template>
	<li @click="$emit('remove')">{{item.text}}, <slot name="index" txt="test3333">222</slot></li>
</template>
<script>
export default {
	props: {
		'item':{
			type:Object,
			required:true
		}
	}
};
</script>
<style lang="scss">
#app{
	li{color:red;}
}
</style>
