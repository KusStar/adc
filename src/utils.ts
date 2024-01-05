import { exec, execSync } from 'node:child_process'

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

export async function getCurrentPackage() {
  const output = await execAsync(`adb shell dumpsys activity top | grep "ACTIVITY" | tail -n 1 | awk '{print $2}' | cut -d '/' -f1`)
  return output.trim()
}

export function stopApp(packageName: string) {
  adb(`shell am force-stop ${packageName}`)
}

export function adb(cmd: string, deviceIds?: string[]) {
  if (deviceIds && deviceIds.length > 1) {
    return execSync(`adb -s ${deviceIds.join(' -s ')} ${cmd}`)
  }

  return execSync(`adb ${cmd}`)
}

export function adbAsync(cmd: string, deviceIds?: string[]) {
  if (deviceIds && deviceIds.length > 1) {
    return execAsync(`adb -s ${deviceIds.join(' -s ')} ${cmd}`)
  }

  return execAsync(`adb ${cmd}`)
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
