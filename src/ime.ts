import { isCancel, outro, select } from '@clack/prompts'
import { adb, checkDevices } from './utils'

export async function ime(devices: string[], goBack: () => void) {
  const device = await checkDevices(devices)

  const imes = adb('shell ime list -s', device).toString().trim().split('\n')

  const options = imes.map(it => ({ value: it, label: it }))

  options.push({
    value: 'back',
    label: 'back',
    hint: 'go back',
  } as any)

  const selected = await select({
    message: 'Select a ime',
    options,
  })

  if (isCancel(selected)) {
    return outro('No ime selected')
  }

  if (selected === 'back') {
    return goBack()
  }

  adb(`shell ime set ${selected}`, device)

  outro(`ime set to ${selected}`)
}
