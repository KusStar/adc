import { log, outro } from '@clack/prompts'
import prompts from 'prompts'
import { adb } from '../utils'

export async function rotation(device: string | undefined, goBack: () => void) {
  const { value } = await prompts({
    type: 'autocomplete',
    message: 'Select a rotation',
    name: 'value',
    choices: [
      {
        value: '0',
        title: 'portrait(lock)',
        description: 'lock the screen to portrait',
      },
      {
        value: '1',
        title: 'landscape(lock), 90 degrees',
        description: 'lock the screen to landscape',
      },
      {
        value: '2',
        title: 'reverse-portrait(lock), 180 degrees',
        description: 'lock the screen to reverse-portrait',
      },
      {
        value: '3',
        title: 'reverse-landscape(lock), 270 degrees',
        description: 'lock the screen to reverse-landscape',
      },
      {
        value: 'reset',
        title: 'reset',
      },
      {
        value: 'back',
        title: 'back',
        description: 'back to main menu',
      },
    ],
  })

  if (!value) {
    return outro('No ime selected')
  }

  if (value === 'back') {
    return goBack()
  }

  if (value === 'reset') {
    adb('shell settings put system user_rotation 0', device)
    adb('shell settings put system accelerometer_rotation 1', device)
  } else {
    log.message(`set rotation to ${value}`)
    adb('shell settings put system accelerometer_rotation 0', device)
    adb(`shell settings put system user_rotation ${value}`, device)
  }

  outro(`done`)
}
