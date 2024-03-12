import { execSync } from 'node:child_process'
import { isCancel, log, outro, select, spinner } from '@clack/prompts'
import { IS_MACOS, adbAsync, getInstalledPackages, goBack, prompts2 } from '../utils'

export async function installOrUninstall(device: string | undefined) {
  const cancel = () => {
    log.warn('cancelled')
    installOrUninstall(device)
  }

  const selected = await select({
    message: 'select a command',
    options: [
      IS_MACOS && {
        value: 'install-picker',
        label: 'install by file picker',
        hint: 'install apk by file picker',
      },
      {
        value: 'install-path',
        label: 'install by apk path',
        hint: 'install apk by input apk path',
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
    ].filter(Boolean) as any[],
  })
  if (isCancel(selected) || selected === 'back') {
    return goBack()
  }
  if (selected === 'install-path') {
    const { value, cancelled } = await prompts2({
      type: 'text',
      name: 'value',
      message: 'input apk path',
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
    await adbAsync(`install -r ${value}`, device)
    s.stop(`installed ${filename}`)
  } else if (selected === 'install-picker') {
    let pickResult: string | undefined
    try {
      pickResult = execSync(
        // eslint-disable-next-line style/max-len
        `osascript -l JavaScript -e 'a=Application.currentApplication();a.includeStandardAdditions=true;a.chooseFile({withPrompt:"Please select a file to process: ", ofType:["apk"]}).toString()'`,
      )
        .toString()
    } catch (_) {
      log.error('file picker error')
    }
    if (!pickResult) {
      outro('no file selected')
      return
    }
    const path = pickResult.toString().trim()
    const filename = path.split('/').pop()
    const s = spinner()
    s.start(`installing ${filename}`)
    await adbAsync(`install -r ${path}`, device)
    s.stop(`installed ${filename}`)
  } else if (selected === 'uninstall') {
    const packages = getInstalledPackages(device, true)
    const { value, cancelled } = await prompts2({
      type: 'autocomplete',
      name: 'value',
      message: 'select package to uninstall',
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
    await adbAsync(`uninstall ${value}`, device)
    s.stop(`uninstalling ${value}`)
  }
}
