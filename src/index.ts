import { outro, select, isCancel, intro } from '@clack/prompts';
import { wm } from './wm'
import { ime } from './ime';

const COMMANDS = [
  {
    value: 'wm',
    hint: 'manage window manager config, size, density, etc'
  },
  {
    value: 'ime',
    hint: 'manage input method, keyboard, etc'
  },
]

const openCmd = async (cmd: string) => {
  if (cmd == 'wm') {
    intro('adb wm helper')
    wm()
  } else if (cmd == "ime") {
    intro('adb ime helper')
    ime()
  } else {
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
  const args = process.argv.slice(2)
  openCmd(args[0])
}