<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'

const props = defineProps<{
  code: string
}>()

const svg = ref('')
const error = ref<string | null>(null)
const isLoading = ref(true)
const renderAttempts = ref(0)
const isDev = import.meta.dev

async function renderDiagram() {
  if (!import.meta.client) return
  
  renderAttempts.value++
  isLoading.value = true
  error.value = null
  
  console.log(`Mermaid: Starting render attempt ${renderAttempts.value}`)

  try {
    // Dynamic import
    console.log('Mermaid: Importing library...')
    const { default: mermaid } = await import('mermaid')
    console.log('Mermaid: Library loaded successfully')

    let theme = 'default'
    try {
      const colorMode = useColorMode()
      theme = colorMode.value === 'dark' ? 'dark' : 'default'
    } catch {
      console.warn('Mermaid: Could not detect color mode, using default')
    }

    mermaid.initialize({
      startOnLoad: false,
      theme: theme as 'default' | 'dark',
      securityLevel: 'loose',
    })

    const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`
    const cleanCode = props.code.trim()
    
    console.log('Mermaid: Rendering SVG string...')
    const { svg: svgContent } = await mermaid.render(id, cleanCode)
    
    console.log('Mermaid: Rendering complete')
    svg.value = svgContent
    isLoading.value = false
  } catch (err: unknown) {
    console.error('Mermaid: Error during rendering:', err)
    error.value = err instanceof Error ? err.message : 'Failed to render diagram'
    isLoading.value = false
  }
}

onMounted(() => {
  console.log('Mermaid: Component mounted')
  renderDiagram()
})

if (import.meta.client) {
  try {
    const colorMode = useColorMode()
    watch([() => props.code, () => colorMode.value], () => {
      console.log('Mermaid: Code or color mode changed, re-rendering...')
      renderDiagram()
    })
  } catch {
    watch(() => props.code, () => {
      renderDiagram()
    })
  }
}
</script>

<template>
  <div class="mermaid-wrapper my-8 min-h-[100px] flex flex-col items-center w-full">
    <!-- Debug Info (Dev Only) -->
    <div v-if="isDev" class="text-[9px] text-gray-400 mb-2 uppercase flex gap-4">
      <span>Attempt: {{ renderAttempts }}</span>
      <span v-if="isLoading" class="text-blue-500 animate-pulse">Processing...</span>
      <span v-else-if="error" class="text-red-500">Error</span>
      <span v-else class="text-green-500">Success</span>
    </div>

    <!-- Error State -->
    <div v-if="error" class="w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-600 dark:text-red-400 font-medium mb-2">Mermaid Error</p>
      <pre class="text-[10px] overflow-auto p-2 bg-white/50 dark:bg-black/20 rounded">{{ code }}</pre>
    </div>
    
    <!-- Loading State (only if no SVG yet) -->
    <div v-else-if="isLoading && !svg" class="w-full flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
      <div class="w-8 h-8 border-2 border-gray-300 border-t-primary animate-spin rounded-full mb-4" />
      <p class="text-sm text-gray-500">Loading diagram...</p>
    </div>

    <!-- Output State -->
    <div v-if="svg" class="w-full flex justify-center overflow-x-auto py-4" v-html="svg" />
  </div>
</template>

<style scoped>
.mermaid-wrapper :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
