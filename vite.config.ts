import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readdirSync, existsSync } from 'fs'
import { resolve } from 'path'
import type { Plugin } from 'vite'

const PHOTO_FOLDERS = ['01-date', '02-swipe', '03-puzzle', '04-missoshiro', '05-future', 'moments']
const PHOTO_EXTENSIONS = /\.(webp|jpg|jpeg|png|gif)$/i

function photoManifestPlugin(): Plugin {
  const VIRTUAL_ID = 'virtual:photo-manifest'
  const RESOLVED_ID = '\0' + VIRTUAL_ID

  function buildManifest(root: string): Record<string, string[]> {
    const photosDir = resolve(root, 'public/photos')
    const manifest: Record<string, string[]> = {}

    for (const folder of PHOTO_FOLDERS) {
      const dir = resolve(photosDir, folder)
      manifest[folder] = existsSync(dir)
        ? readdirSync(dir)
            .filter(f => PHOTO_EXTENSIONS.test(f))
            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
            .map(f => `/photos/${folder}/${f}`)
        : []
    }

    return manifest
  }

  return {
    name: 'photo-manifest',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      const manifest = buildManifest(process.cwd())
      return `export default ${JSON.stringify(manifest)}`
    },
    configureServer(server) {
      // Recarrega o módulo quando arquivos de foto são adicionados/removidos
      const photosDir = resolve(process.cwd(), 'public/photos')
      server.watcher.add(photosDir)
      server.watcher.on('add', invalidate)
      server.watcher.on('unlink', invalidate)

      function invalidate(file: string) {
        if (!PHOTO_EXTENSIONS.test(file)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.hot.send({ type: 'full-reload' })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), photoManifestPlugin()],
})
