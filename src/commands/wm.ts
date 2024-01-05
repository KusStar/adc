import path from 'node:path'
import { fileURLToPath } from 'node:url'
import storage from 'node-persist'
import { isCancel, log, outro, select, text } from '@clack/prompts'
import prompts from 'prompts'
import { adb } from '../utils'

interface Config {
  name: string
  value: string
}

type Option = {
  value: Config
  label: string
  hint?: string
} | {
  value: string
  label: string
  hint?: string
}

// eslint-disable-next-line no-restricted-syntax
const enum Op {
  SEPARATOR = 'separator',
  CREATE = 'create',
  RESET = 'reset',
  DUMP = 'dump',
  EDIT = 'edit',
  DELETE = 'delete',
  IMPORT = 'import',
  BACK = 'back',
}

function runConfig(config = '', device?: string) {
  const sets = config.split(',').map(it => it.trim())

  sets.forEach((it) => {
    adb(`shell wm ${it}`, device)
  })
  try {
    adb('shell am force-stop  com.miui.home', device)
  } catch (e) {
    log.error(String(e))
  }
  outro(`Run shell done!`)
}

async function saveConfig(wmConfigs: Config[], newConfig: string, newConfigValue: string) {
  wmConfigs.push({
    name: newConfig,
    value: newConfigValue,
  })
  await storage.setItem('config', wmConfigs)
  outro('new config created')
}

async function createConfig(wmConfigs: Config[]) {
  const newConfig = await text({
    message: 'Enter your new config name',
    validate: (val) => {
      if (val.length < 0) {
        return 'config name cannot be empty'
      }
    },
  })
  if (isCancel(newConfig)) {
    return outro('No config name entered')
  }

  const newConfigValue = await text({
    message: 'Enter your new config value',
    placeholder: 'size 1080x1920, density 160',
    validate: (val) => {
      if (val.length < 0) {
        return 'config name cannot be empty'
      }
    },
  })
  if (isCancel(newConfigValue)) {
    return outro('No config value entered')
  }

  await saveConfig(wmConfigs, newConfig, newConfigValue)
  runConfig(newConfigValue)
}

async function editConfig(wmConfigs: Config[]) {
  const editedConfig = await select({
    message: 'Which wm config to edit',
    options: wmConfigs.map(it => ({ value: it, label: it.name, hint: it.value })),
  })
  if (isCancel(editedConfig)) {
    return outro('No config selected')
  }

  const newConfigValue = await text({
    message: 'Enter your new config value',
    placeholder: 'size 1080x1920, density 160',
    validate: (val) => {
      if (val.length < 0) {
        return 'config name cannot be empty'
      }
    },
  })
  if (isCancel(newConfigValue)) {
    return outro('No config value entered')
  }

  const newConfigs = wmConfigs.map((it) => {
    if (it.name === editedConfig) {
      return {
        name: it.name,
        value: newConfigValue,
      }
    }
    return it
  })
  await storage.setItem('config', newConfigs)
  outro('config edited')
}

async function importConfig() {
  const importConfig = await text({
    message: 'Enter your config json',
    validate: (val) => {
      if (val.length < 0) {
        return 'config json cannot be empty'
      }
    },
  }) as string
  try {
    const json = JSON.parse(importConfig)
    if (!Array.isArray(json)) {
      outro('Invalid json')
      return
    }
    await storage.setItem('config', json)
    outro('Import config done')
  } catch (e) {
    outro(`Invalid json${e}`)
  }
}

async function dumpConfig(wmConfigs: Config[], device?: string) {
  const newSize = adb('shell wm size', device).toString().trim().match(/Override size: (?<size>\d+x\d+)/)?.groups?.size
  const newDensity = adb('shell wm density', device)
    .toString()
    .trim()
    .match(/Override density: (?<density>\d+)/)?.groups?.density
  if (!newSize || !newDensity) {
    outro('Invalid dump')
    return
  }
  const newConfigValue = `size ${newSize}, density ${newDensity}`
  const newConfig = await text({
    message: 'Enter your new config name',
    validate: (val) => {
      if (val.length < 0) {
        return 'config name cannot be empty'
      }
    },
  }) as string
  await saveConfig(wmConfigs, newConfig, newConfigValue)
  outro(`Dump config done, ${newConfigValue}`)
}

async function deleteConfig(wmConfigs: Config[]) {
  const deletedConfig = await select({
    message: 'Which wm config to delete',
    options: wmConfigs.map(it => ({ value: it, label: it.name, hint: it.value })),
  }) as Config
  if (isCancel(deletedConfig)) {
    return outro('No config selected')
  }

  const newConfigs = wmConfigs.filter(it => it.name !== deletedConfig.value)
  await storage.setItem('config', newConfigs)
  outro('config deleted')
}

export async function wm(device: string | undefined, goBack: () => void) {
  const PERSIST_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../storage')

  await storage.init({
    dir: PERSIST_DIR,
  })

  const wmConfigs: Config[] = (await storage.getItem('config')) || []

  const options: Option[] = wmConfigs.reverse().map(it => ({ value: it, label: it.name, hint: it.value }))

  options.push(
    { value: Op.SEPARATOR, label: '------------' },
    { value: Op.CREATE, label: 'create', hint: 'create new wm config' },
    { value: Op.RESET, label: 'reset', hint: 'reset wm to default' },
  )

  if (wmConfigs.length > 0) {
    options.push(
      { value: Op.DUMP, label: 'dump', hint: 'dump from current' },
      { value: Op.EDIT, label: 'edit', hint: 'edit wm config' },
      { value: Op.DELETE, label: 'delete', hint: 'delete wm config' },
      { value: Op.BACK, label: 'back', hint: 'go back' },
    )
  } else {
    options.push({ value: Op.IMPORT, label: 'import config', hint: 'from json' })
  }

  const { value: selectedConfig } = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: 'Select wm config',
    choices: options.map(it => (
      {
        title: it.label,
        value: it.value,
        description: it.hint,
      }
    )),
    suggest: (input, choices) =>
      Promise.resolve(choices
        .filter(it => it.title.includes(input)),
      ),
  })

  if (typeof selectedConfig === 'string') {
    switch (selectedConfig) {
      case Op.CREATE:
        createConfig(wmConfigs)
        break

      case Op.EDIT:
        editConfig(wmConfigs)
        break

      case Op.DELETE:
        deleteConfig(wmConfigs)
        break

      case Op.SEPARATOR:
        outro('Just a separator')
        wm(device, goBack)
        break

      case Op.RESET:
        adb('shell wm reset', device)
        break

      case Op.IMPORT:
        importConfig()
        break

      case Op.DUMP:
        dumpConfig(wmConfigs)
        break

      case Op.BACK:
        goBack()
        break

      default:
        // logic for unknown operation
        outro('Unknown operation')
        break
    }
  } else {
    if (isCancel(selectedConfig)) {
      outro('No config selected')
      return
    }
    runConfig(selectedConfig.value, device)
  }
}
