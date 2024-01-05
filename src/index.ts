import process from 'node:process'
import { cancel, intro, isCancel, outro, select } from '@clack/prompts'
import { wm } from './wm'
import { ime } from './ime'
import { monkey } from './monkey'
import { amStart } from './am-start'
import { amStop } from './am-stop'
import { checkDevices, getAdbDevices } from './utils'
import { installOrUninstall } from './install-or-uninstall'
import { rotation } from './rotation'

const args = process.argv.slice(2)

type CmdValue = 'am-start'
  | 'am-stop'
  | 'install/uninstall'
  | 'ime'
  | 'monkey'
  | 'rotation'
  | 'wm'
  | 'exit'

const COMMANDS: {
  value: CmdValue
  hint?: string
}[] = [
  {
    value: 'am-start',
    hint: 'activity manager start actions',
  },
  {
    value: 'am-stop',
    hint: 'activity manager stop actions',
  },
  {
    value: 'install/uninstall',
    hint: 'install or uninstall apk',
  },
  {
    value: 'ime',
    hint: 'manage input method, keyboard, etc',
  },
  {
    value: 'monkey',
    hint: 'start or stop monkey test',
  },
  {
    value: 'rotation',
    hint: 'manage screen rotation',
  },
  {
    value: 'wm',
    hint: 'manage window manager config, size, density, etc',
  },
  {
    value: 'exit',
  },
]

function goBack() {
  openCmd()
}

async function openCmd(cmd?: CmdValue) {
  const devices = getAdbDevices()
  if (devices.length === 0) {
    intro('adc - adb helper')
    return cancel('adb not connected')
  }
  const device = await checkDevices(devices)

  if (cmd === 'wm') {
    intro('adb wm helper')
    wm(device, goBack)
  } else if (cmd === 'ime') {
    intro('adb ime helper')
    ime(device, goBack)
  } else if (cmd === 'monkey') {
    intro('adb monkey helper')
    monkey(device, goBack, args[1])
  } else if (cmd === 'am-start') {
    intro('adb am start helper')
    amStart(device, goBack)
  } else if (cmd === 'am-stop') {
    intro('adb am stop helper')
    amStop(device, goBack)
  } else if (cmd === 'exit') {
    outro('exited')
  } else if (cmd === 'install/uninstall') {
    installOrUninstall(device, goBack)
  } else if (cmd === 'rotation') {
    rotation(device, goBack)
  } else {
    const options = COMMANDS.map(it => ({ value: it.value, label: it.value, hint: it.hint }))
    const selected = await select({
      message: 'adc',
      options,
    }) as CmdValue
    if (isCancel(selected)) {
      return outro('No command selected')
    }

    openCmd(selected)
  }
}

export function startCli() {
  openCmd(args[0] as any)
}
