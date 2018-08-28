<template>            
    <section>
         选择颜色:<el-color-picker v-model="color1"></el-color-picker>
    </section>
</template>
<script> 
export default {
      props: ['init','api','value'],
    data() {
        return {
          color1:'#409EFF'
        }
    },
}
</script>
