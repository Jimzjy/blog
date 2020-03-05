<template>
  <div>
    <BaseListLayoutNew v-if="$pagination" />
    <Content v-else />
  </div>
</template>

<script>
import BaseListLayoutNew from '@theme/components/BaseListLayoutNew.vue'

export default {
  components: {
    BaseListLayoutNew
  }
}
</script>