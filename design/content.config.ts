import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**',
      schema: z.object({
        pathwayTitle: z.string().optional(),
        pathwayDescription: z.string().optional(),
        pathways: z.array(z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string(),
          to: z.string()
        })).optional(),
        hero: z.object({
          badge: z.string().optional(),
          headline: z.string().optional(),
          description: z.string().optional(),
          primaryCta: z.object({
            label: z.string(),
            to: z.string()
          }).optional(),
          secondaryCta: z.object({
            label: z.string(),
            to: z.string()
          }).optional()
        }).optional(),
        metrics: z.array(z.object({
          value: z.string(),
          label: z.string()
        })).optional()
      })
    }),
  },
})
