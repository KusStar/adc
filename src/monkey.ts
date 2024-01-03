import { exec, execSync } from 'child_process'
import { outro, select, isCancel, confirm, note } from '@clack/prompts';

const START_CMD = (packageName: string) => `adb shell "monkey -p ${packageName} -v -v -v -s 1000 --ignore-crashes --ignore-timeouts --ignore-security-exceptions --ignore-native-crashes --kill-process-after-error --pct-appswitch 30 --pct-touch 45 --pct-syskeys 0 --pct-motion 10 --pct-anyevent 10 --pct-flip 5 --pct-trackball 0 --pct-pinchzoom 0 --pct-nav 0 --pct-majornav 0 --pct-permission 0 --throttle 500 1200000000 2>&1 | tee /sdcard/logcat/monkey.log.txt "`

const STOP_CMD = "adb shell kill $(adb shell pgrep monkey)"

const getFocusedPackage = () => {
  return execSync(`adb shell dumpsys activity top | grep "ACTIVITY" | tail -n 1 | awk '{print $2}' | cut -d '/' -f1`)
}

let once = false

const exitHandler = async () => {
  if (once) return
  once = true
  const value = await confirm({
    message: 'Try to exit, stop the monkey test?',
    initialValue: true
  })
  if (value) {
    execSync(STOP_CMD)
    outro('monkey stopped')
  }
  outro('exited')
}

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
  process.on(eventType, exitHandler)
})

export const monkey = async (cmd?: string) => {
  let selected
  if (cmd === 'start' || cmd === 'stop') {
    selected = cmd
  } else {
    selected = await select({
      message: 'Monkey Test',
      options: [
        {
          value: 'start',
          label: 'start',
          hint: 'start monkey test'
        },
        {
          value: 'stop',
          label: 'stop',
          hint: 'stop monkey test'
        }
      ]
    })
  }

  if (isCancel(selected)) return outro('cancelled')

  if (selected === 'start') {
    const packageName = getFocusedPackage().toString().trim()
    note(`start monkey test for ${packageName}`);
    execSync(START_CMD(packageName))
  } else if (selected === 'stop') {
    once = true
    try {
      execSync(STOP_CMD, {
        stdio: 'ignore'
      })
    } catch (error) {}
    outro('monkey stopped')
  }
}