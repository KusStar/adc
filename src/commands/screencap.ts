import { outro } from '@clack/prompts'
import { adb, goBack, prompts2 } from '../utils'

export async function screencap(device: string | undefined) {
  const { path, cancelled } = await prompts2({
    type: 'text',
    name: 'path',
    message: 'Save to:',
    initial: './screencap.png',
  })

  if (cancelled) {
    return goBack()
  }

  adb('shell screencap -p /sdcard/screencap.png', device)
  adb(`pull /sdcard/screencap.png ${path}`, device)
  adb('shell rm /sdcard/screencap.png', device)

  outro(`saved to ${path}`)
}
