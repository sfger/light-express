<template>
	<li @click="$emit('remove')">{{item.text}}, <slot name="index" txt="test"></slot></li>
</template>
<script>
export default {
	props: ['item'],
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
