import { confirm, log, outro } from '@clack/prompts'
import prompts from 'prompts'
import { adb, getInstalledPackages, prompts2, stopApp } from '../utils'

const stopSetting = (device?: string) => stopApp('com.android.settings', device)

interface StartItem {
  value: string
  label: string
  hint: string
  cmd: string
}

const START_LIST: StartItem[] = [
  {
    value: 'app',
    label: 'installed app',
    hint: 'Open application by package name',
    cmd: '',
  },
  {
    value: 'accessibility',
    label: 'settings - accessibility',
    hint: 'Open accessibility settings',
    cmd: '-a android.settings.ACCESSIBILITY_SETTINGS',
  },
  {
    value: 'action-notification-listener',
    label: 'settings - action-notification-listener',
    hint: 'Open notification listener settings',
    cmd: '-a android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS',
  },
  {
    value: 'application-development',
    label: 'settings - application-development',
    hint: 'Open application development settings',
    cmd: '-a android.settings.APPLICATION_DEVELOPMENT_SETTINGS',
  },
  {
    value: 'application-settings',
    label: 'settings - application-settings',
    hint: 'Open application settings',
    cmd: '-a android.settings.APPLICATION_SETTINGS',
  },
  {
    value: 'bluetooth',
    label: 'settings - bluetooth',
    hint: 'Open bluetooth settings',
    cmd: '-a android.settings.BLUETOOTH_SETTINGS',
  },
  {
    value: 'device-info',
    label: 'settings - device-info',
    hint: 'Open device info settings',
    cmd: '-a android.settings.DEVICE_INFO_SETTINGS',
  },
  {
    value: 'display',
    label: 'settings - display',
    hint: 'Open display settings',
    cmd: '-a android.settings.DISPLAY_SETTINGS',
  },
  {
    value: 'input-method',
    label: 'settings - input-method',
    hint: 'Open input method settings',
    cmd: '-a android.settings.INPUT_METHOD_SETTINGS',
  },
  {
    value: 'locale',
    label: 'settings - locale',
    hint: 'Open locale settings',
    cmd: '-a android.settings.LOCALE_SETTINGS',
  },
  {
    value: 'location',
    label: 'settings - location',
    hint: 'Open location settings',
    cmd: '-a android.settings.LOCATION_SOURCE_SETTINGS',
  },
  {
    value: 'manage-app',
    label: 'settings - manage-app',
    hint: 'Open manage applications settings',
    cmd: '-a android.settings.MANAGE_APPLICATIONS_SETTINGS',
  },
  {
    value: 'sound',
    label: 'settings - sound',
    hint: 'Open sound settings',
    cmd: '-a android.settings.SOUND_SETTINGS',
  },
  {
    value: 'wifi',
    label: 'settings - wifi',
    hint: 'Open wifi settings',
    cmd: '-a android.settings.WIFI_SETTINGS',
  },
  {
    value: 'wireless',
    label: 'settings - wireless',
    hint: 'Open wireless settings',
    cmd: '-a android.settings.WIRELESS_SETTINGS',
  },
]

async function startPackage(device: string | undefined, goBack: () => void) {
  const packages = getInstalledPackages(device)
  const { value } = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: 'Select package',
    choices: packages
      .map(it => ({ title: it, value: it }))
      .concat([
        {
          title: 'back',
          value: 'back',
        },
      ]),
    suggest: (input, choices) =>
      Promise.resolve(choices.filter(it => it.title.includes(input))),
  })
  if (!value) {
    return outro('cancelled')
  }
  if (value === 'back') {
    return goBack()
  }

  try {
    adb(`shell monkey -p ${value} -c android.intent.action.MAIN -c android.intent.category.LAUNCHER 1`, device)

    outro('done')
  } catch (error) {
    log.error(`cannot start ${value}`)
    const yes = await confirm({
      message: 'Do you want to continue?',
      initialValue: true,
    })
    if (yes) {
      startPackage(device, goBack)
    } else {
      outro('exited')
    }
  }
}

export async function amStart(device: string | undefined, goBack: () => void) {
  const { value, cancelled } = await prompts2<string>({
    type: 'autocomplete',
    name: 'value',
    message: 'am start...',
    choices: START_LIST
      .map(it => ({ title: it.label, value: it.value, description: it.hint }))
      .concat([
        {
          title: 'back',
          value: 'back',
          description: 'go back',
        },
      ]),
    suggest: (input, choices) => Promise.resolve(choices.filter(it => it.title.includes(input))),
  })

  if (cancelled) {
    goBack()
    return
  }

  if (!value) {
    return outro('cancelled')
  }

  if (value === 'back') {
    return goBack()
  }

  if (value === 'app') {
    startPackage(device, goBack)
    return
  }

  const selectedCmd = START_LIST.find(it => it.value === value)
  if (!selectedCmd) {
    return outro('cancelled')
  }

  stopSetting(device)
  adb(`shell am start ${selectedCmd.cmd}`, device)

  outro('done')
}
