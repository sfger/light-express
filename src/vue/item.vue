<template>
  <li @click="$emit('remove')">{{item.text+'-'+$attrs.ccc}}, <slot name="index" txt="test">222</slot></li>
</template>
<script>
export default {
  inheritAttrs: false,
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
  li{
    color: red;
  }
}
</style>
