import { outro } from '@clack/prompts';
import { adb, stopApp } from './utils';
import prompts from 'prompts';

const stopSetting = () => stopApp('com.android.settings')

type StartItem = {
  value: string,
  label: string,
  hint: string,
  cmd: string
}

const START_LIST: StartItem[] = [
  {
    value: 'accessibility',
    label: 'accessibility',
    hint: 'Open accessibility settings',
    cmd: '-a android.settings.ACCESSIBILITY_SETTINGS'
  },
  {
    value: 'action-notification-listener',
    label: 'action-notification-listener',
    hint: 'Open notification listener settings',
    cmd: '-a android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS'
  },
  {
    value: 'application-development',
    label: 'application-development',
    hint: 'Open application development settings',
    cmd: '-a android.settings.APPLICATION_DEVELOPMENT_SETTINGS'
  },
  {
    value: 'application',
    label: 'application',
    hint: 'Open application settings',
    cmd: '-a android.settings.APPLICATION_SETTINGS'
  },
  {
    value: 'bluetooth',
    label: 'bluetooth',
    hint: 'Open bluetooth settings',
    cmd: '-a android.settings.BLUETOOTH_SETTINGS'
  },
  {
    value: 'device-info',
    label: 'device-info',
    hint: 'Open device info settings',
    cmd: '-a android.settings.DEVICE_INFO_SETTINGS'
  },
  {
    value: 'display',
    label: 'display',
    hint: 'Open display settings',
    cmd: '-a android.settings.DISPLAY_SETTINGS'
  },
  {
    value: 'input-method',
    label: 'input-method',
    hint: 'Open input method settings',
    cmd: '-a android.settings.INPUT_METHOD_SETTINGS'
  },
  {
    value: 'locale',
    label: 'locale',
    hint: 'Open locale settings',
    cmd: '-a android.settings.LOCALE_SETTINGS'
  },
  {
    value: 'location',
    label: 'location',
    hint: 'Open location settings',
    cmd: '-a android.settings.LOCATION_SOURCE_SETTINGS'
  },
  {
    value: 'manage-app',
    label: 'manage-app',
    hint: 'Open manage applications settings',
    cmd: '-a android.settings.MANAGE_APPLICATIONS_SETTINGS'
  },
  {
    value: 'sound',
    label: 'sound',
    hint: 'Open sound settings',
    cmd: '-a android.settings.SOUND_SETTINGS'
  },
  {
    value: 'wifi',
    label: 'wifi',
    hint: 'Open wifi settings',
    cmd: '-a android.settings.WIFI_SETTINGS'
  },
  {
    value: 'wireless',
    label: 'wireless',
    hint: 'Open wireless settings',
    cmd: '-a android.settings.WIRELESS_SETTINGS'
  }
]

export const amStart = async (goBack: () => void) => {
  const { value } = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: 'am start...',
    choices: START_LIST
      .map(it => ({ title: it.label, value: it.value, description: it.hint }))
      .concat([
        {
          title: 'back',
          value: 'back',
          description: 'go back'
        }
      ]),
    suggest: (input, choices) => Promise.resolve(choices.filter(it => it.title.includes(input)))
  })

  if (!value) return outro('cancelled')

  if (value === 'back') return goBack()

  const selectedCmd = START_LIST.find(it => it.value === value)
  if (!selectedCmd) return outro('cancelled')

  stopSetting()
  adb(`shell am start ${selectedCmd.cmd}`)

  outro('done')
}