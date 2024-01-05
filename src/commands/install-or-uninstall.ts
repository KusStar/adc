import { isCancel, outro, select, spinner } from '@clack/prompts'
import prompts from 'prompts'
import { adb, adbAsync, getInstalledPackages } from '../utils'

export async function installOrUninstall(device: string | undefined, goBack: () => void) {
  const selected = await select({
    message: 'Select a command',
    options: [
      {
        value: 'install',
        label: 'install',
        hint: 'install apk',
      },
      {
        value: 'uninstall',
        label: 'uninstall',
        hint: 'uninstall apk',
      },
      {
        value: 'back',
        label: 'back',
        hint: 'go back',
      },
    ],
  })
  if (isCancel(selected)) {
    return outro('No command selected')
  }
  if (selected === 'back') {
    return goBack()
  }
  if (selected === 'install') {
    const { value } = await prompts({
      type: 'text',
      name: 'value',
      message: 'Input apk path',
    })
    if (!value) {
      return outro('not selected')
    }
    const filename = value.split('/').pop()

    const s = spinner()
    s.start(`installing ${filename}`)
    await adbAsync(`install -r ${value}`, device)
    s.stop(`installed ${filename}`)
  } else if (selected === 'uninstall') {
    const packages = getInstalledPackages(device, true)
    const { value } = await prompts({
      type: 'autocomplete',
      name: 'value',
      message: 'Select package to uninstall',
      choices: packages.map(it => ({ title: it, value: it })),
      suggest: (input, choices) =>
        Promise.resolve(choices.filter(it => it.title.includes(input))),
    })
    if (!value) {
      return outro('not selected')
    }
    const s = spinner()
    s.start(`uninstalling ${value}`)
    await adbAsync(`uninstall ${value}`, device)
    s.stop(`uninstalling ${value}`)
  }
}
