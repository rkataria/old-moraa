import { createRequire } from 'node:module'
import path from 'node:path'

import { sentryVitePlugin } from '@sentry/vite-plugin'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, normalizePath, Plugin } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const require = createRequire(import.meta.url)
const cMapsDir = normalizePath(
  path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps')
)
const standardFontsDir = normalizePath(
  path.join(
    path.dirname(require.resolve('pdfjs-dist/package.json')),
    'standard_fonts'
  )
)

const warningsToIgnore = [
  ['SOURCEMAP_ERROR', "Can't resolve original location of error"],
]

export const muteWarningsPlugin = (): Plugin => {
  const mutedMessages = new Set()

  return {
    name: 'mute-warnings',
    enforce: 'pre',
    config: (userConfig) => ({
      build: {
        rollupOptions: {
          onwarn(warning, defaultHandler) {
            if (warning.code) {
              const muted = warningsToIgnore.find(
                ([code, message]) =>
                  code === warning.code && warning.message.includes(message)
              )

              if (muted) {
                mutedMessages.add(muted.join())

                return
              }
            }

            if (userConfig.build?.rollupOptions?.onwarn) {
              userConfig.build.rollupOptions.onwarn(warning, defaultHandler)
            } else {
              defaultHandler(warning)
            }
          },
        },
      },
    }),
    closeBundle() {
      const diff = warningsToIgnore.filter((x) => !mutedMessages.has(x.join()))
      if (diff.length > 0) {
        this.warn(
          'Some of your muted warnings never appeared during the build process:'
        )
        diff.forEach((m) => this.warn(`- ${m.join(': ')}`))
      }
    },
  }
}

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    sentryVitePlugin({
      org: 'moraa-inc',
      project: 'frontend-app-sentry',
    }),
    muteWarningsPlugin(),
    viteStaticCopy({
      targets: [
        { src: cMapsDir, dest: '' },
        { src: standardFontsDir, dest: '' },
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    sourcemap: false,
  },
})
