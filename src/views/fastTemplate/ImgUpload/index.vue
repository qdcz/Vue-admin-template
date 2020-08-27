<template>
  <div class="padd20">
    <!-- 上传单张图片 -->
    <one />
    <!-- 上传多张图片 -->
    <multiple />
  </div>
</template>

<script>
import One from './One.vue'
import multiple from './multiple.vue'
export default {
  components: { One, multiple },
  data() {
    return {
      name: 'Total'
    }
  },
  methods: {

  }
}
</script>

<style scoped="scoped"></style>
