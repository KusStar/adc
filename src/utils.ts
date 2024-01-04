import { execSync } from "child_process"

export const isAdbConnected = () => {
  try {
    const output = execSync('adb devices | tail -n +2 | cut -sf 1')
    return output.toString().trim().length > 0
  } catch (error) {
    return false
  }
}