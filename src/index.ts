import process from 'node:process'
import { cancel, intro, isCancel, outro, select } from '@clack/prompts'
import { wm } from './wm'
import { ime } from './ime'
import { monkey } from './monkey'
import { amStart } from './am-start'
import { amStop } from './am-stop'
import { isAdbConnected } from './utils'

const args = process.argv.slice(2)

const COMMANDS = [
  {
    value: 'am-start',
    hint: 'activity manager start actions',
  },
  {
    value: 'am-stop',
    hint: 'activity manager stop actions',
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

async function openCmd(cmd?: string) {
  if (!isAdbConnected()) {
    intro('adc - adb helper')
    return cancel('adb not connected')
  }

  if (cmd === 'wm') {
    intro('adb wm helper')
    wm(goBack)
  }
  else if (cmd === 'ime') {
    intro('adb ime helper')
    ime(goBack)
  }
  else if (cmd === 'monkey') {
    intro('adb monkey helper')
    monkey(goBack, args[1])
  }
  else if (cmd === 'am-start') {
    intro('adb am start helper')
    amStart(goBack)
  }
  else if (cmd === 'am-stop') {
    intro('adb am stop helper')
    amStop(goBack)
  }
  else if (cmd === 'exit') {
    outro('exited')
  }
  else {
    const options = COMMANDS.map(it => ({ value: it.value, label: it.value, hint: it.hint }))
    const selected = await select({
      message: 'adc',
      options,
    }) as string
    if (isCancel(selected))
      return outro('No command selected')
    openCmd(selected)
  }
}

export function startCli() {
  openCmd(args[0])
}
