import { outro, spinner } from '@clack/prompts'
import { adbAsync, deviceArg, getCurrentPackage, goBack, prompts2, stopApp } from '../utils'

async function getRunningPackages(device?: string) {
  const output = (await adbAsync(`${deviceArg(device)} shell ps`)).toString().trim()
  const lines = output.split('\n')
    .filter(it => it.includes('u0_'))
    .map(it => it.trim().split(' '))

  return lines.map(it => it[it.length - 1]).filter(it => it !== 'system' && !it.startsWith('.'))
}

export async function amStop(device: string | undefined) {
  const spin = spinner()
  spin.start('Getting running packages')
  const currentPackage = await getCurrentPackage(device)
  const runningPackages = await getRunningPackages(device)
  spin.stop(currentPackage)

  const { value, cancelled } = await prompts2({
    type: 'autocomplete',
    name: 'value',
    message: 'am stop...',
    choices: runningPackages
      .map(it => ({ title: it, value: it }))
      .concat([
        {
          title: 'back',
          value: 'back',
          description: 'go back',
        } as any,
      ]),
    initial: currentPackage,
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

  stopApp(value, device)

  outro('done')
}
