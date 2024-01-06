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
import { checkDevices, getAdbDevices } from './utils'

const args = process.argv.slice(2)

function goBack() {
  log.warn('back\n')
  openCmd()
}

let lastCmd: CmdValue | undefined

async function openCmd(cmd?: CmdValue) {
  const devices = getAdbDevices()
  if (devices.length === 0) {
    intro('adc - adb helper')
    return cancel('adb not connected')
  }
  const device = await checkDevices(devices)

  switch (cmd) {
    case 'wm':
      wm(device, goBack)
      break
    case 'ime':
      ime(device, goBack)
      break
    case 'monkey':
      monkey(device, goBack, args[1])
      break
    case 'am-start':
      amStart(device, goBack)
      break
    case 'am-stop':
      amStop(device, goBack)
      break
    case 'exit':
      outro('exited')
      break
    case 'install/uninstall':
      installOrUninstall(device, goBack)
      break
    case 'rotation':
      rotation(device, goBack)
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

export function startCli() {
  openCmd(args[0] as any)
}
