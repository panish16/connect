import { defineConfig } from '@nuxtjs/mdc/config'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

export default defineConfig({
  unified: {
    remark: (processor) => {
      processor.use(remarkMath)
    },
    rehype: (processor) => {
      processor.use(rehypeKatex)
    }
  }
})
