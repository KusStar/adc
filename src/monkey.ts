import { execSync } from 'child_process'
import { outro, select, isCancel, confirm, note } from '@clack/prompts';
import { getCurrentPackage } from './utils';

const START_CMD = (packageName: string) => `adb shell "monkey -p ${packageName} -v -v -v -s 1000 --ignore-crashes --ignore-timeouts --ignore-security-exceptions --ignore-native-crashes --kill-process-after-error --pct-appswitch 30 --pct-touch 45 --pct-syskeys 0 --pct-motion 10 --pct-anyevent 10 --pct-flip 5 --pct-trackball 0 --pct-pinchzoom 0 --pct-nav 0 --pct-majornav 0 --pct-permission 0 --throttle 500 1200000000 2>&1 | tee /sdcard/logcat/monkey.log.txt "`

const STOP_CMD = "adb shell kill $(adb shell pgrep monkey)"


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

const listenExit = () => {
  const events = [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`]
  events.forEach((eventType) => {
    process.on(eventType, exitHandler)
  })
  return () => {
    events.forEach((eventType) => {
      process.removeListener(eventType, exitHandler)
    })
  }
}

export const monkey = async (goBack: () => void, cmd?: string) => {
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
        },
        {
          value: 'back',
          label: 'back',
          hint: 'back to main menu'
        }
      ]
    })
  }

  if (isCancel(selected)) return outro('cancelled')

  const removeListeners = listenExit()

  if (selected === 'start') {
    const packageName = await getCurrentPackage()
    note(`start monkey test for ${packageName}`);
    execSync(START_CMD(packageName))
  } else if (selected === 'stop') {
    once = true
    try {
      execSync(STOP_CMD, {
        stdio: 'ignore'
      })
    } catch (error) { }
    outro('monkey stopped')
  } else if (selected === 'back') {
    removeListeners()
    goBack()
  }
}