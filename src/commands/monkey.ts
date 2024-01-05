import process from 'node:process'
import { confirm, isCancel, note, outro, select } from '@clack/prompts'
import { adb, getCurrentPackage } from '../utils'

function START_CMD(packageName: string) {
  // eslint-disable-next-line style/max-len
  return `shell "monkey -p ${packageName} -v -v -v -s 1000 --ignore-crashes --ignore-timeouts --ignore-security-exceptions --ignore-native-crashes --kill-process-after-error --pct-appswitch 30 --pct-touch 45 --pct-syskeys 0 --pct-motion 10 --pct-anyevent 10 --pct-flip 5 --pct-trackball 0 --pct-pinchzoom 0 --pct-nav 0 --pct-majornav 0 --pct-permission 0 --throttle 500 1200000000 2>&1 | tee /sdcard/logcat/monkey.log.txt "`
}

const STOP_CMD = 'shell kill $(adb shell pgrep monkey)'

let once = false

async function exitHandler(device?: string) {
  if (once) {
    return
  }

  once = true
  const value = await confirm({
    message: 'Try to exit, stop the monkey test?',
    initialValue: true,
  })
  if (value) {
    adb(STOP_CMD, device)
    outro('monkey stopped')
  } else {
    outro('exited')
  }
}

function listenExit(device?: string) {
  const events = [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`]
  events.forEach((eventType) => {
    process.on(eventType, () => exitHandler(device))
  })
  return () => {
    events.forEach((eventType) => {
      process.removeListener(eventType, () => exitHandler(device))
    })
  }
}

export async function monkey(device: string | undefined, goBack: () => void, cmd?: string) {
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
          hint: 'start monkey test',
        },
        {
          value: 'stop',
          label: 'stop',
          hint: 'stop monkey test',
        },
        {
          value: 'back',
          label: 'back',
          hint: 'back to main menu',
        },
      ],
    })
  }

  if (isCancel(selected)) {
    return outro('cancelled')
  }

  const removeListeners = listenExit(device)

  if (selected === 'start') {
    const packageName = await getCurrentPackage()
    note(`running monkey test for ${packageName}`)
    if (!packageName) {
      return outro('no package name found')
    }
    adb(START_CMD(packageName), device)
  } else if (selected === 'stop') {
    once = true
    try {
      adb(STOP_CMD, device)
    } catch (error) { }
    outro('monkey stopped')
  } else if (selected === 'back') {
    removeListeners()
    goBack()
  }
}
