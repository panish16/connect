<script setup lang="ts">
const { locale } = useI18n()

const { data: page } = await useAsyncData(() => `index-${locale.value}`, () => {
  return queryCollection('content').path(toContentPath('/', locale.value)).first()
})

useHead({
  title: page.value?.title || 'Connect Design'
})

definePageMeta({
  layout: 'connect-auth'
})
</script>

<template>
  <div v-if="page" class="flex flex-col items-center" data-testid="doc-page-content">
    <div class="w-full max-w-4xl">
      <UPageHero
        :title="page.title"
        :description="page.description"
        align="center"
      >
        <template #top>
          <img src="/img/design-hero.svg" alt="Connect Architecture Platform Framework" class="block mx-auto mt-12 mb-8 w-full max-w-xl">
        </template>
      </UPageHero>

      <UPageBody :ui="{ base: 'px-6 sm:px-8' }">
        <div v-if="page.pathways" class="mb-16">
          <div class="mb-8">
            <h2 class="text-3xl font-bold tracking-tight text-highlighted mb-4 text-center sm:text-left">
              {{ page.pathwayTitle }}
            </h2>
            <p class="text-lg text-muted text-center sm:text-left">
              {{ page.pathwayDescription }}
            </p>
          </div>
          
          <UPageGrid :ui="{ base: 'sm:grid-cols-3 lg:grid-cols-3' }">
            <UPageCard
              v-for="item in page.pathways"
              :key="item.title"
              v-bind="item"
              spotlight
            />
          </UPageGrid>
        </div>

        <div class="prose prose-primary dark:prose-invert max-w-none">
          <ContentRenderer :value="page" />
        </div>
      </UPageBody>
    </div>
  </div>
</template>
