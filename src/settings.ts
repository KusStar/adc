
import { execSync } from 'child_process'
import { outro, select, isCancel } from '@clack/prompts';

const LOCALE_SETTINGS = `adb shell am start -a android.settings.LOCALE_SETTINGS`

export const settings = async (cmd: string) => {
  let selected
  if (cmd === 'locale' || cmd === 'language') {
    selected = cmd
  } else {
    selected = await select({
      message: 'Qucik Settings',
      options: [
        {
          value: 'language',
          label: 'language',
          hint: 'Open locale language settings'
        },
      ]
    })
  }

  if (isCancel(selected)) return outro('cancelled')

  if (selected === 'language' || selected === 'locale') {
    execSync(LOCALE_SETTINGS)
  }

  outro('done')
}