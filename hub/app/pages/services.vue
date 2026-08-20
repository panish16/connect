<script setup lang="ts">
const { t, locale } = useI18n()

useSeoMeta({
  title: () => t('serviceCatalog.seoTitle'),
  description: () => t('serviceCatalog.seoDescription')
})

useHead({
  htmlAttrs: {
    lang: () => locale.value || 'en-CA'
  }
})

definePageMeta({
  layout: 'connect-auth'
})

// Search, Filter and Sort State
const searchQuery = ref('')
const selectedSort = ref('A-Z')

interface FilterItem {
  type: 'status' | 'ministry' | 'category'
  value: string
}

interface ServiceItem {
  id?: number
  accountId?: number
  shortName: string
  longName: string
  description?: string
  logoUrl?: string
  monetized?: boolean
  primarySku?: string
  skuGrid?: unknown[]
  paymentMethods?: unknown[]
  callbackUrl?: string
  journalVoucher?: Record<string, unknown>
  accessControlType?: string
  openfgaSchema?: string
  servicePath?: string
  githubCodeowners?: string
  githubRepoUrl?: string
  deploymentTargets?: unknown[]
  gcpProjectId?: string
  platformServices?: unknown[]
  category?: string
  status?: string
  ministry?: string
  features?: string[]
  tags?: string[]
  icon?: string
  links?: {
    appUrl?: string
    homeUrl?: string
    userDocsUrl?: string
    devDocsUrl?: string
  }
}

const activeFilters = ref<FilterItem[]>([])

// Fetch services directly from DB API
const { data: servicesResponse } = await useFetch('/api/services', {
  lazy: true
})

const allServices = computed<ServiceItem[]>(() => {
  return servicesResponse.value?.data || []
})

// Unique ministries and categories for filter dropdowns
const availableMinistries = computed(() => {
  const set = new Set<string>()
  allServices.value.forEach((s) => {
    if (s.ministry) set.add(s.ministry)
  })
  return Array.from(set)
})

const availableCategories = computed(() => {
  const set = new Set<string>()
  allServices.value.forEach((s) => {
    if (s.category) set.add(s.category)
  })
  return Array.from(set)
})

// Filter Active Check & Toggle Helpers
const isFilterActive = (type: 'status' | 'ministry' | 'category', value: string) => {
  return activeFilters.value.some(f => f.type === type && f.value.toLowerCase() === value.toLowerCase())
}

const toggleFilter = (type: 'status' | 'ministry' | 'category', value: string) => {
  const existingIdx = activeFilters.value.findIndex(f => f.type === type && f.value.toLowerCase() === value.toLowerCase())
  if (existingIdx >= 0) {
    activeFilters.value.splice(existingIdx, 1)
  } else {
    activeFilters.value.push({ type, value })
  }
}

// Inline Filter Handlers
const onCategorySelect = (e: Event) => {
  const target = e.target as HTMLSelectElement
  const val = target.value
  if (val) {
    toggleFilter('category', val)
  }
  target.value = ''
}

const onStatusSelect = (e: Event) => {
  const target = e.target as HTMLSelectElement
  const val = target.value
  if (val) {
    toggleFilter('status', val)
  }
  target.value = ''
}

const onMinistrySelect = (e: Event) => {
  const target = e.target as HTMLSelectElement
  const val = target.value
  if (val) {
    toggleFilter('ministry', val)
  }
  target.value = ''
}

// Filter & Sort Logic
const filteredServices = computed(() => {
  let list = [...allServices.value]

  // Search Query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(s =>
      (s.longName && s.longName.toLowerCase().includes(q))
      || (s.shortName && s.shortName.toLowerCase().includes(q))
      || (s.description && s.description.toLowerCase().includes(q))
      || (s.ministry && s.ministry.toLowerCase().includes(q))
      || (s.category && s.category.toLowerCase().includes(q))
    )
  }

  // Active Filters (OR within same filter type, AND across different filter types)
  if (activeFilters.value.length > 0) {
    const filtersByType = activeFilters.value.reduce((acc, filter) => {
      if (!acc[filter.type]) acc[filter.type] = []
      acc[filter.type].push(filter.value)
      return acc
    }, {} as Record<string, string[]>)

    list = list.filter((s) => {
      return Object.entries(filtersByType).every(([type, values]) => {
        if (type === 'status') {
          return values.some(v => s.status && s.status.toLowerCase() === v.toLowerCase())
        } else if (type === 'ministry') {
          return values.some(v => s.ministry === v)
        } else if (type === 'category') {
          return values.some(v => s.category === v)
        }
        return true
      })
    })
  }

  // Sorting
  if (selectedSort.value === 'A-Z') {
    list.sort((a, b) => (a.longName || '').localeCompare(b.longName || ''))
  } else if (selectedSort.value === 'Z-A') {
    list.sort((a, b) => (b.longName || '').localeCompare(a.longName || ''))
  }

  return list
})

// Group Services by Category in Display Order
const groupedServices = computed(() => {
  const groups: Record<string, ServiceItem[]> = {}
  const categoryOrder = ['Government & BPS Services', 'Public Applications']

  filteredServices.value.forEach((service) => {
    const cat = service.category || t('serviceCatalog.categories.otherServices')
    if (!groups[cat]) groups[cat] = []
    groups[cat].push(service)
  })

  const result: Array<{ category: string, items: ServiceItem[], icon: string }> = []

  // Add ordered categories first
  categoryOrder.forEach((cat) => {
    if (groups[cat] && groups[cat].length > 0) {
      result.push({
        category: cat,
        items: groups[cat],
        icon: cat === 'Public Applications' ? 'i-lucide-globe' : 'i-lucide-building-2'
      })
      groups[cat] = []
    }
  })

  // Add remaining categories
  Object.keys(groups).forEach((cat) => {
    if (groups[cat].length > 0) {
      result.push({
        category: cat,
        items: groups[cat],
        icon: 'i-lucide-layers'
      })
    }
  })

  return result
})

const removeFilter = (index: number) => {
  activeFilters.value.splice(index, 1)
}
</script>

<template>
  <div
    data-testid="services-page-container"
    class="py-8 px-4 sm:px-6 lg:px-8 space-y-8 max-w-7xl mx-auto w-full"
  >
    <!-- Title & Subtitle Section -->
    <div class="text-center space-y-3 pt-2">
      <h1 class="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
        {{ $t('serviceCatalog.title') }}
      </h1>
      <p class="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-normal">
        {{ $t('serviceCatalog.subtitle') }}
      </p>
    </div>

    <!-- Search & Active Filter Controls -->
    <div class="max-w-4xl mx-auto space-y-4">
      <!-- Top Row: Search Input Box & Sort Dropdown -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <!-- Search Input Box -->
        <div class="relative flex-1 w-full">
          <UIcon
            name="i-lucide-search"
            class="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400 pointer-events-none"
          />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('serviceCatalog.searchPlaceholder')"
            class="w-full pl-11 pr-4 py-3 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-bc-blue shadow-sm"
          >
        </div>

        <!-- Sort Select Dropdown -->
        <div class="relative w-full sm:w-44">
          <select
            v-model="selectedSort"
            :aria-label="$t('serviceCatalog.sortLabel')"
            class="w-full appearance-none px-4 py-3 rounded-md bg-[#E5E7EB] dark:bg-zinc-800 text-sm font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none pr-10 border-0"
          >
            <option value="A-Z">
              {{ $t('serviceCatalog.sortAZ') }}
            </option>
            <option value="Z-A">
              {{ $t('serviceCatalog.sortZA') }}
            </option>
          </select>
          <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-zinc-600 dark:text-zinc-400">
            <UIcon
              name="i-lucide-arrow-up-down"
              class="size-3.5 mr-1"
            />
            <UIcon
              name="i-lucide-chevron-down"
              class="size-4"
            />
          </div>
        </div>
      </div>

      <!-- Active Filter Dropdowns Row (Category, Status, Ministry) -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <!-- Category Filter Dropdown -->
        <div class="relative w-full">
          <select
            :aria-label="$t('serviceCatalog.filterByCategory')"
            class="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-bc-blue pr-8 shadow-xs"
            @change="onCategorySelect"
          >
            <option value="">
              {{ $t('serviceCatalog.filterByCategory') }}
            </option>
            <option
              v-for="cat in availableCategories"
              :key="cat"
              :value="cat"
            >
              {{ isFilterActive('category', cat) ? `✓ ${cat}` : cat }}
            </option>
          </select>
          <UIcon
            name="i-lucide-chevron-down"
            class="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none"
          />
        </div>

        <!-- Status Filter Dropdown -->
        <div class="relative w-full">
          <select
            :aria-label="$t('serviceCatalog.filterByStatus')"
            class="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-bc-blue pr-8 shadow-xs"
            @change="onStatusSelect"
          >
            <option value="">
              {{ $t('serviceCatalog.filterByStatus') }}
            </option>
            <option value="Production">
              {{ isFilterActive('status', 'Production') ? `✓ ${$t('serviceCatalog.status.production')}` : $t('serviceCatalog.status.production') }}
            </option>
            <option value="Beta">
              {{ isFilterActive('status', 'Beta') ? `✓ ${$t('serviceCatalog.status.beta')}` : $t('serviceCatalog.status.beta') }}
            </option>
          </select>
          <UIcon
            name="i-lucide-chevron-down"
            class="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none"
          />
        </div>

        <!-- Ministry Filter Dropdown -->
        <div class="relative w-full">
          <select
            :aria-label="$t('serviceCatalog.filterByMinistry')"
            class="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-bc-blue pr-8 shadow-xs"
            @change="onMinistrySelect"
          >
            <option value="">
              {{ $t('serviceCatalog.filterByMinistry') }}
            </option>
            <option
              v-for="m in availableMinistries"
              :key="m"
              :value="m"
            >
              {{ isFilterActive('ministry', m) ? `✓ ${m}` : m }}
            </option>
          </select>
          <UIcon
            name="i-lucide-chevron-down"
            class="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none"
          />
        </div>
      </div>

      <!-- Active Filter Badges Line -->
      <div
        v-if="activeFilters.length > 0"
        class="flex flex-wrap items-center gap-2 text-xs sm:text-sm pt-1"
      >
        <span class="text-zinc-600 dark:text-zinc-400 font-medium">{{ $t('serviceCatalog.activeFiltersLabel') }}</span>

        <div
          v-for="(filter, idx) in activeFilters"
          :key="idx"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5E7EB] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium"
        >
          <span>{{ filter.value }}</span>
          <button
            :aria-label="$t('serviceCatalog.removeFilter')"
            class="hover:text-zinc-900 dark:hover:text-white transition-colors"
            @click="removeFilter(idx)"
          >
            <UIcon
              name="i-lucide-x"
              class="size-3.5"
            />
          </button>
        </div>

        <button
          class="text-xs text-bc-blue dark:text-blue-400 font-semibold hover:underline px-2 py-1"
          @click="activeFilters = []"
        >
          {{ $t('serviceCatalog.clearAllFilters') }}
        </button>
      </div>
    </div>

    <!-- Categorized Service Sections -->
    <div
      v-if="groupedServices.length > 0"
      class="space-y-10 pt-4"
    >
      <div
        v-for="group in groupedServices"
        :key="group.category"
        class="space-y-4"
      >
        <!-- Banner Section Header -->
        <div class="bg-[#E5EDF5] dark:bg-zinc-800/60 px-5 py-3.5 rounded-lg flex items-center gap-3">
          <UIcon
            :name="group.icon"
            class="size-5 text-bc-blue dark:text-blue-400 shrink-0"
          />
          <h2 class="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            {{ group.category }}
          </h2>
        </div>

        <!-- Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="service in group.items"
            :key="service.id || service.shortName"
            class="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div>
              <!-- Top Line: Icon, Title & Badges -->
              <div class="flex items-start justify-between gap-3 mb-4">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="w-12 h-12 rounded-lg bg-[#E0EDFB] dark:bg-blue-950/60 flex items-center justify-center text-bc-blue dark:text-blue-400 shrink-0">
                    <UIcon
                      :name="service.icon || 'i-lucide-app-window'"
                      class="size-6"
                    />
                  </div>
                  <h3 class="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug min-w-0 break-normal">
                    {{ service.longName }}
                  </h3>
                </div>

                <!-- Status & Tag Badges Stacked Vertically -->
                <div class="flex flex-col items-end gap-1.5 shrink-0">
                  <span
                    v-if="service.status === 'Production'"
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] whitespace-nowrap"
                  >
                    {{ $t('serviceCatalog.status.production') }}
                  </span>
                  <span
                    v-else-if="service.status === 'Beta'"
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF7E0] text-[#8C4600] border border-[#FEEFC3] whitespace-nowrap"
                  >
                    {{ $t('serviceCatalog.status.beta') }}
                  </span>

                  <!-- Tags (e.g. Leveraged) -->
                  <span
                    v-for="tag in (service.tags || [])"
                    :key="tag"
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FDF0D5] text-[#7A5200] border border-[#F7D89C] inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <UIcon
                      name="i-lucide-link-2"
                      class="size-3"
                    />
                    {{ tag }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <p class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                {{ service.description }}
              </p>

              <!-- Bullet Points -->
              <ul
                v-if="service.features && service.features.length"
                class="space-y-2 mb-6"
              >
                <li
                  v-for="(feat, fIdx) in service.features"
                  :key="fIdx"
                  class="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2"
                >
                  <span class="inline-block w-1.5 h-1.5 rounded-full bg-zinc-700 dark:bg-zinc-300 mt-1.5 shrink-0" />
                  <span>{{ feat }}</span>
                </li>
              </ul>
            </div>

            <!-- Footer Ministry Name & Action Link Buttons Grid -->
            <div class="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div class="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {{ service.ministry }}
              </div>

              <!-- Up to 4 Action Links Grid (Launch/View, Home Page, User Docs, Dev Docs) -->
              <div
                v-if="service.links && (service.links.appUrl || service.links.homeUrl || service.links.userDocsUrl || service.links.devDocsUrl)"
                class="grid grid-cols-2 gap-2 pt-1"
              >
                <!-- 1. Launch / View Service -->
                <a
                  v-if="service.links.appUrl"
                  :href="service.links.appUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-2.5 py-1.5 rounded bg-bc-blue text-white hover:bg-blue-900 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <UIcon
                    name="i-lucide-external-link"
                    class="size-3.5 shrink-0"
                  />
                  <span>{{ service.category === 'Government & BPS Services' ? $t('serviceCatalog.links.viewService') : $t('serviceCatalog.links.launchApp') }}</span>
                </a>

                <!-- 2. Home Page -->
                <a
                  v-if="service.links.homeUrl"
                  :href="service.links.homeUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-2.5 py-1.5 rounded bg-white dark:bg-zinc-800 text-bc-blue dark:text-blue-400 border border-bc-blue/30 dark:border-blue-400/30 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <UIcon
                    name="i-lucide-home"
                    class="size-3.5 shrink-0"
                  />
                  <span>{{ $t('serviceCatalog.links.homePage') }}</span>
                </a>

                <!-- 3. User Docs -->
                <a
                  v-if="service.links.userDocsUrl"
                  :href="service.links.userDocsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-2.5 py-1.5 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <UIcon
                    name="i-lucide-book-open"
                    class="size-3.5 shrink-0"
                  />
                  <span>{{ $t('serviceCatalog.links.userDocs') }}</span>
                </a>

                <!-- 4. Dev Docs -->
                <a
                  v-if="service.links.devDocsUrl"
                  :href="service.links.devDocsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-2.5 py-1.5 rounded bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors text-xs font-medium flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <UIcon
                    name="i-lucide-code-2"
                    class="size-3.5 shrink-0"
                  />
                  <span>{{ $t('serviceCatalog.links.devDocs') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4"
    >
      <UIcon
        name="i-lucide-search-x"
        class="size-12 mx-auto text-zinc-400"
      />
      <h3 class="text-lg font-bold text-zinc-900 dark:text-zinc-100">
        {{ $t('serviceCatalog.emptyTitle') }}
      </h3>
      <p class="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
        {{ $t('serviceCatalog.emptySubtitle') }}
      </p>
      <button
        class="px-4 py-2 bg-bc-blue text-white rounded-md text-sm font-medium hover:bg-blue-900 transition-colors"
        @click="activeFilters = []; searchQuery = ''"
      >
        {{ $t('serviceCatalog.resetFilters') }}
      </button>
    </div>
  </div>
</template>
