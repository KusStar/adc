import { isCancel, outro } from '@clack/prompts'
import { adb, goBack, prompts2 } from '../utils'

export async function uimode(device: string | undefined) {
  const { selected } = await prompts2({
    type: 'autocomplete',
    name: 'selected',
    message: 'select a mode',
    choices: [
      {
        title: 'auto',
        value: 'auto',
      },
      {
        title: 'day',
        value: 'day',
      },
      {
        title: 'night',
        value: 'night',
      },
      {
        title: 'back',
        value: 'back',
      },
    ],
  })

  if (isCancel(selected) || selected === 'back') {
    return goBack()
  }

  const value = selected === 'auto' ? 'auto' : selected === 'day' ? 'no' : 'yes'

  adb(`shell cmd uimode night ${value}`, device)

  outro(`uimode set to ${selected}`)
}
