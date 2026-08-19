<script setup lang="ts">
defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: null
  },
  filename: {
    type: String,
    default: null
  },
  highlights: {
    type: Array,
    default: () => []
  },
  meta: {
    type: String,
    default: null
  },
  class: {
    type: String,
    default: null
  }
})
</script>

<template>
  <template v-if="language === 'mermaid'">
    <ClientOnly>
      <Mermaid :code="code" />
      <template #fallback>
        <pre :class="$props.class"><code>{{ code }}</code></pre>
      </template>
    </ClientOnly>
  </template>
  <pre v-else :class="$props.class"><slot /></pre>
</template>

<style>
pre code .line{display:block}
</style>
