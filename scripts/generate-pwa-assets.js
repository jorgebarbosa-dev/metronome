import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const svgBuffer = readFileSync(resolve(process.cwd(), 'public/icon.svg'))
const publicDir = resolve(process.cwd(), 'public')

// Generate standard icons
await sharp(svgBuffer)
  .resize(192, 192)
  .png()
  .toFile(resolve(publicDir, 'icon-192x192.png'))

await sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile(resolve(publicDir, 'icon-512x512.png'))

// Generate maskable icons with padding (safe zone for adaptive icons)
// Maskable icons need padding so the important content stays within the safe zone
const createMaskableIcon = async (size, outputName) => {
  const padding = Math.round(size * 0.1) // 10% padding on each side
  const iconSize = size - (padding * 2)
  
  const resizedIcon = await sharp(svgBuffer)
    .resize(iconSize, iconSize)
    .png()
    .toBuffer()
  
  // Create a background with the same blue color
  const background = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 59, g: 130, b: 246, alpha: 1 } // #3B82F6
    }
  })
    .png()
    .toBuffer()
  
  await sharp(background)
    .composite([{ input: resizedIcon, gravity: 'center' }])
    .png()
    .toFile(resolve(publicDir, outputName))
}

await createMaskableIcon(192, 'icon-maskable-192x192.png')
await createMaskableIcon(512, 'icon-maskable-512x512.png')

// Generate Apple touch icon (180x180)
await sharp(svgBuffer)
  .resize(180, 180)
  .png()
  .toFile(resolve(publicDir, 'apple-touch-icon.png'))

console.log('All PWA icons generated successfully!')
