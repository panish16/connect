<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()
const navigation = inject<Ref<unknown[]>>('navigation')

definePageMeta({
  layout: 'connect-auth'
})

const { data: page } = await useAsyncData('page-' + route.path, () => {
  if (route.path === '/') return null
  return queryCollection('content').path(toContentPath(route.path, locale.value)).first()
})

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('content', toContentPath(route.path, locale.value))
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useHead({
  title: page.value ? `${page.value.title || 'Documentation'} | Connect Docs` : 'Connect Docs'
})
</script>

<template>
  <UMain as="div" class="flex-1 w-full py-8">
    <UPage v-if="page" data-testid="doc-page-content">
      <template #left>
        <UPageAside :ui="{ root: 'lg:-ms-0' }">
          <UContentNavigation :navigation="navigation" />
        </UPageAside>
      </template>

      <UPageHeader :title="page.title || 'Documentation'" :description="page.description" :ui="{ container: 'px-6 sm:px-8' }" />

      <UPageBody :ui="{ base: 'px-6 sm:px-8' }">
        <ContentRenderer :value="page" />

        <USeparator class="my-8" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template #right>
        <UContentToc v-if="page.body?.toc?.links" :links="page.body.toc.links" />
      </template>
    </UPage>
  </UMain>
</template>
