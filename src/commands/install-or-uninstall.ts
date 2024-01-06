import { isCancel, log, outro, select, spinner } from '@clack/prompts'
import { getInstalledPackages, goBack, prompts2 } from '../utils'

export async function installOrUninstall(device: string | undefined) {
  const cancel = () => {
    log.warn('cancelled')
    installOrUninstall(device)
  }

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
    const { value, cancelled } = await prompts2({
      type: 'text',
      name: 'value',
      message: 'Input apk path',
    })
    if (cancelled) {
      cancel()
      return
    }
    if (!value) {
      outro('no input')
      return
    }
    const filename = value.split('/').pop()

    const s = spinner()
    s.start(`installing ${filename}`)
    // await adbAsync(`install -r ${value}`, device)
    s.stop(`installed ${filename}`)
  } else if (selected === 'uninstall') {
    const packages = getInstalledPackages(device, true)
    const { value, cancelled } = await prompts2({
      type: 'autocomplete',
      name: 'value',
      message: 'Select package to uninstall',
      choices: packages
        .map(it => ({ title: it, value: it }))
        .concat([
          {
            title: 'back',
            value: 'back',
          },
        ]),
      suggest: (input, choices) =>
        Promise.resolve(choices.filter(it => it.title.includes(input))),
    })
    if (cancelled) {
      cancel()
      return
    }
    if (!value) {
      outro('not selected')
      return
    }
    if (value === 'back') {
      goBack()
      return
    }
    const s = spinner()
    s.start(`uninstalling ${value}`)
    // await adbAsync(`uninstall ${value}`, device)
    s.stop(`uninstalling ${value}`)
  }
}
