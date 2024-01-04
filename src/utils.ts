import { exec, execSync } from "child_process"

export const execAsync = (cmd: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout.toString())
    })
  })
}

export const getCurrentPackage = async () => {
  const output = await execAsync(`adb shell dumpsys activity top | grep "ACTIVITY" | tail -n 1 | awk '{print $2}' | cut -d '/' -f1`)
  return output.trim()
}

export const stopApp = (packageName: string) => {
  adb(`shell am force-stop ${packageName}`)
}

export const adb = (cmd: string, deviceIds?: string[]) => {
  if (deviceIds && deviceIds.length > 1) {
    return exec(`adb -s ${deviceIds.join(' -s ')} ${cmd}`)
  }
  return exec(`adb ${cmd}`)
}

export const adbAsync = (cmd: string, deviceIds?: string[]) => {
  if (deviceIds && deviceIds.length > 1) {
    return execAsync(`adb -s ${deviceIds.join(' -s ')} ${cmd}`)
  }
  return execAsync(`adb ${cmd}`)
}

export const isAdbConnected = () => {
  try {
    const output = execSync('adb devices | tail -n +2 | cut -sf 1')
    return output.toString().trim().length > 0
  } catch (error) {
    return false
  }
}