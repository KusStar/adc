import process from 'node:process'
import { cancel, intro, log, outro } from '@clack/prompts'
import {
  COMMANDS,
  type CmdValue,
  amStart,
  amStop,
  ime,
  input,
  installOrUninstall,
  monkey,
  props,
  rotation,
  screencap,
  uimode,
  wm,
} from './commands'
import { checkDevices, getAdbDevices, prompts2, setGoBack } from './utils'

export * from './commands'

const args = process.argv.slice(2)

let lastCmd: CmdValue | undefined

export async function openCmd(cmd?: CmdValue) {
  const devices = getAdbDevices()
  if (devices.length === 0) {
    intro('adc - adb helper')
    return cancel('no device connected')
  }
  const device = await checkDevices(devices)

  switch (cmd) {
    case 'wm':
      wm(device)
      break
    case 'input':
      input(device)
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
    case 'screencap':
      screencap(device)
      break
    case 'props':
      props(device)
      break
    case 'uimode':
      uimode(device)
      break
    default:
      {
        const options = COMMANDS.map(it => ({
          value: it.value as string,
          title: it.value as string,
          description: it.hint,
        }))
        const { value, cancelled } = await prompts2({
          type: 'autocomplete',
          name: 'value',
          message: 'adc',
          choices: options,
          initial: lastCmd,
          limit: COMMANDS.length,
        })

        if (cancelled) {
          return outro('cancelled')
        }
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
