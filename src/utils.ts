import process from 'node:process'
import { exec, execSync } from 'node:child_process'
import { isCancel, note, select } from '@clack/prompts'
import prompts from 'prompts'

export const IS_MACOS = process.platform === 'darwin'

export const ctx = {
  goBack: () => {},
}

// avoid circular dependency
export function goBack() {
  ctx.goBack?.()
}

function promptsOnCancel(prompt: any, answers: any) {
  answers._cancelled = true
  return false
}

export async function prompts2<T extends string = string>(
  questions: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>,
  options?: prompts.Options,
) {
  const { _cancelled, ...rest } = await prompts(questions, {
    onCancel: promptsOnCancel,
    ...options,
  }) as any

  return {
    cancelled: _cancelled,
    ...rest,
  } as {
    cancelled: boolean
    [key: string]: any
  }
}

export const deviceArg = (device?: string) => device ? ` -s ${device}` : ''

export function execAsync(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout) => {
      if (error) {
        reject(error)
      }

      resolve(stdout.toString())
    })
  })
}

export function getInstalledPackages(device?: string, onlyUser?: boolean) {
  return adb(`shell pm list packages ${onlyUser ? '-3' : ''}`, device)
    .toString()
    .trim()
    .split('\n')
    .map(it => it.replace('package:', ''))
}

export async function getCurrentPackage(device?: string) {
  const output = (await execAsync(`adb${deviceArg(device)} shell dumpsys activity top`)).trim()
  const lines = output.split('\n')
  const activityLine = lines.reverse().find(line => line.includes('ACTIVITY'))

  if (activityLine) {
    const componentName = activityLine.split(' ').filter(it => it.length > 0)[1]

    const packageActivity = componentName.split('/', 2)[0]

    return packageActivity
  }
}

export function stopApp(packageName: string, device?: string) {
  adb(`shell am force-stop ${packageName}`, device)
}

function execSync2(cmd: string, print = true) {
  if (print) {
    note(cmd)
  }
  return execSync(cmd)
}

export function execAsync2(cmd: string, print = true) {
  if (print) {
    note(cmd)
  }
  return execAsync(cmd)
}

export function adb(cmd: string, device?: string[] | string) {
  let finalCmd: string = `adb ${cmd}`
  if (typeof device === 'string') {
    finalCmd = `adb -s ${device} ${cmd}`
  } else {
    if (device && device.length > 1) {
      finalCmd = `adb -s ${device.join(' -s ')} ${cmd}`
    } else if (device && device.length === 1) {
      finalCmd = `adb -s ${device[0]} ${cmd}`
    }
  }
  return execSync2(finalCmd)
}

export function adbAsync(cmd: string, device?: string[] | string) {
  let finalCmd: string = `adb ${cmd}`
  if (typeof device === 'string') {
    finalCmd = `adb -s ${device} ${cmd}`
  } else {
    if (device && device.length > 1) {
      finalCmd = `adb -s ${device.join(' -s ')} ${cmd}`
    } else if (device && device.length === 1) {
      finalCmd = `adb -s ${device[0]} ${cmd}`
    }
  }
  return execAsync2(finalCmd)
}

export function getAdbDevices() {
  try {
    const output = execSync('adb devices').toString().trim()
    if (output.includes('List of devices attached')) {
      return output.split('\n').slice(1).map(line => line.split('\t')[0])
    }
    return []
  } catch (error) {
    return []
  }
}

export async function checkDevices(device: string[] | string) {
  if (typeof device === 'string') {
    return device
  } else {
    if (device.length > 1) {
      const selectedDevice = await select({
        message: 'multiple devices detected, select a device to execute',
        options: device.map(it => ({ label: it, value: it })),
      }) as string
      if (isCancel(selectedDevice)) {
        return
      }
      return selectedDevice
    }
    return device[0]
  }
}
