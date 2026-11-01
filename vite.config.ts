import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom plugin to ensure MEMES folder is synced and served
function syncMemesPlugin() {
  return {
    name: 'sync-memes',
    buildStart() {
      const srcDir = path.resolve(__dirname, 'MEMES')
      const targetDir = path.resolve(__dirname, 'public/MEMES')

      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true })
        }
        const files = fs.readdirSync(srcDir)
        files.forEach((file) => {
          const from = path.join(srcDir, file)
          const to = path.join(targetDir, file)
          try {
            fs.copyFileSync(from, to)
          } catch {}
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), syncMemesPlugin()],
})
