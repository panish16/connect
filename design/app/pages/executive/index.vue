<template>
  <div v-if="doc" class="executive-landing" data-testid="doc-page-content">
    <!-- High-Impact Bespoke Hero Section -->
    <section class="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-16 md:py-24" aria-label="Executive Hero">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Category Badge -->
        <div 
          v-if="doc.hero?.badge" 
          data-testid="hero-badge"
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-[#FCBA19] text-[#003366] dark:text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          {{ doc.hero.badge }}
        </div>

        <!-- Main Headline -->
        <h1 
          v-if="doc.hero?.headline" 
          class="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight max-w-4xl mb-6 leading-tight"
        >
          {{ doc.hero.headline }}
        </h1>

        <!-- Sub-headline -->
        <p 
          v-if="doc.hero?.description" 
          class="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mb-8 leading-relaxed"
        >
          {{ doc.hero.description }}
        </p>

        <!-- CTA Action Group -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16">
          <NuxtLink 
            v-if="doc.hero?.primaryCta" 
            :to="doc.hero.primaryCta.to" 
            class="inline-flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-md text-white bg-[#003366] hover:bg-[#002244] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003366] dark:focus-visible:ring-white shadow-sm transition-colors"
          >
            {{ doc.hero.primaryCta.label }}
          </NuxtLink>
          <NuxtLink 
            v-if="doc.hero?.secondaryCta" 
            :to="doc.hero.secondaryCta.to" 
            class="inline-flex justify-center items-center px-6 py-3.5 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#003366] dark:focus-visible:ring-white shadow-sm transition-colors"
          >
            {{ doc.hero.secondaryCta.label }}
          </NuxtLink>
        </div>

        <!-- Trust / Key Metrics Bar -->
        <div v-if="doc.metrics?.length" class="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-800 pt-10">
          <div 
            v-for="(metric, idx) in doc.metrics" 
            :key="idx" 
            class="p-5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xs"
          >
            <div class="text-2xl md:text-3xl font-bold text-[#003366] dark:text-blue-400 mb-1.5">{{ metric.value }}</div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-300 leading-snug">{{ metric.label }}</div>
          </div>
        </div>

      </div>
    </section>

    <!-- Markdown Body Content (Matrix, Onboarding Steps, etc.) -->
    <section id="capabilities" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-primary dark:prose-invert max-w-none" aria-label="Capabilities and Details">
      <ContentRenderer :value="doc" />
    </section>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

definePageMeta({
  layout: 'connect-auth'
})

const { data: doc } = await useAsyncData(() => `executive-${locale.value}`, () => {
  return queryCollection('content').path(toContentPath('/executive', locale.value)).first()
})

// SEO / Meta Tags
useHead({
  title: doc.value?.title ? `${doc.value.title} | Connect Docs` : 'Connect Platform – Executive Overview',
  meta: [
    { 
      name: 'description', 
      content: doc.value?.hero?.description || doc.value?.description || 'Turn-key infrastructure, pre-built business capabilities, and automated compliance for BC Government digital services.' 
    }
  ]
})
</script>
