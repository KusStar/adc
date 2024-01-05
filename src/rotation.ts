import { isCancel, log, outro, select } from '@clack/prompts'
import { adb } from './utils'

export async function rotation(device: string | undefined, goBack: () => void) {
  const selected = await select({
    message: 'Select a rotation',
    options: [
      {
        value: '0',
        label: 'portrait(lock)',
        hint: 'lock the screen to portrait',
      },
      {
        value: '1',
        label: 'landscape(lock), 90 degrees',
        hint: 'lock the screen to landscape',
      },
      {
        value: '2',
        label: 'reverse-portrait(lock), 180 degrees',
        hint: 'lock the screen to reverse-portrait',
      },
      {
        value: '3',
        label: 'reverse-landscape(lock), 270 degrees',
        hint: 'lock the screen to reverse-landscape',
      },
      {
        value: 'reset',
        label: 'reset',
      },
      {
        value: 'back',
        label: 'back',
        hint: 'back to main menu',
      },
    ],
  })

  if (isCancel(selected)) {
    return outro('No ime selected')
  }

  if (selected === 'back') {
    return goBack()
  }

  if (selected === 'reset') {
    adb('shell settings put system user_rotation 0', device)
    adb('shell settings put system accelerometer_rotation 1', device)
  } else {
    log.message(`set rotation to ${selected}`)
    adb('shell settings put system accelerometer_rotation 0', device)
    adb(`shell settings put system user_rotation ${selected}`, device)
  }

  outro(`done`)
}
