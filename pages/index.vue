<template>
  <div />
</template>

<script>
export default {
  name: 'MainPage',
  mounted() {
    this.$router.push('/applications')
  },
  head() {
    return { title: 'Главная страница' }
  },
}
</script>
