import process from 'node:process'
import { cancel, intro, log, outro } from '@clack/prompts'
import prompts from 'prompts'
import {
  COMMANDS,
  type CmdValue,
  amStart,
  amStop,
  ime,
  installOrUninstall,
  monkey,
  rotation,
  wm,
} from './commands'
import { checkDevices, getAdbDevices, setGoBack } from './utils'

const args = process.argv.slice(2)

let lastCmd: CmdValue | undefined

export async function openCmd(cmd?: CmdValue) {
  const devices = getAdbDevices()
  if (devices.length === 0) {
    intro('adc - adb helper')
    return cancel('adb not connected')
  }
  const device = await checkDevices(devices)

  switch (cmd) {
    case 'wm':
      wm(device)
      break
    case 'ime':
      ime(device)
      break
    case 'monkey':
      monkey(device, args[1])
      break
    case 'am-start':
      amStart(device)
      break
    case 'am-stop':
      amStop(device)
      break
    case 'exit':
      outro('exited')
      break
    case 'install/uninstall':
      installOrUninstall(device)
      break
    case 'rotation':
      rotation(device)
      break
    default:
      {
        const options = COMMANDS.map(it => ({
          value: it.value as string,
          title: it.value as string,
          description: it.hint,
        }))
        const { value } = await prompts({
          type: 'autocomplete',
          name: 'value',
          message: 'adc',
          choices: options,
          initial: lastCmd,
        })

        if (!value) {
          return outro('No command selected')
        }

        lastCmd = value

        openCmd(value)
      }
      break
  }
}

function goBack() {
  log.warn('back\n')
  openCmd()
}

export function startCli() {
  setGoBack(goBack)
  openCmd(args[0] as any)
}
