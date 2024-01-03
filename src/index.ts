import { outro, select, isCancel, intro } from '@clack/prompts';
import { wm } from './wm'
import { ime } from './ime';
import { monkey } from './monkey';

const args = process.argv.slice(2)

const COMMANDS = [
  {
    value: 'wm',
    hint: 'manage window manager config, size, density, etc'
  },
  {
    value: 'ime',
    hint: 'manage input method, keyboard, etc'
  },
  {
    value: 'monkey',
    hint: 'start or stop monkey test'
  },
]

const openCmd = async (cmd: string) => {
  if (cmd == 'wm') {
    intro('adb wm helper')
    wm()
  } else if (cmd == "ime") {
    intro('adb ime helper')
    ime()
  }
  else if (cmd == "monkey") {
    intro('adb monkey helper')
    monkey(args[1])
  }
  else {
    const options = COMMANDS.map(it => ({ value: it.value, label: it.value, hint: it.hint }))
    const selected = await select({
      message: 'Select a command',
      options
    }) as string
    if (isCancel(selected)) return outro('No command selected')
    openCmd(selected)
  }
}

export const startCli = () => {
  openCmd(args[0])
}