import { isCancel, outro, select } from '@clack/prompts'
import { adb, goBack } from '../utils'

export async function ime(device: string | undefined) {
  const imes = adb('shell ime list -s', device).toString().trim().split('\n')

  const options = imes.map(it => ({ value: it, label: it }))

  options.push({
    value: 'back',
    label: 'back',
    hint: 'go back',
  } as any)

  const selected = await select({
    message: 'select a ime',
    options,
  })

  if (isCancel(selected) || selected === 'back') {
    return goBack()
  }

  adb(`shell ime set ${selected}`, device)

  outro(`ime set to ${selected}`)
}
