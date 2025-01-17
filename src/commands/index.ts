export { wm } from './wm'
export { ime } from './ime'
export { monkey } from './monkey'
export { amStart } from './am-start'
export { amStop } from './am-stop'
export { installOrUninstall } from './install-or-uninstall'
export { rotation } from './rotation'
export { input } from './input'
export { screencap } from './screencap'
export { props } from './props'
export { uimode } from './uimode'

export type CmdValue = 'am-start'
  | 'am-stop'
  | 'install/uninstall'
  | 'input'
  | 'ime'
  | 'monkey'
  | 'props'
  | 'rotation'
  | 'screencap'
  | 'uimode'
  | 'wm'
  | 'exit'

export const COMMANDS: {
  value: CmdValue
  hint?: string
}[] = [
  {
    value: 'am-start',
    hint: 'activity manager start actions',
  },
  {
    value: 'am-stop',
    hint: 'activity manager stop actions',
  },
  {
    value: 'install/uninstall',
    hint: 'install or uninstall apk',
  },
  {
    value: 'input',
    hint: 'send input event',
  },
  {
    value: 'ime',
    hint: 'manage input method, keyboard, etc',
  },
  {
    value: 'monkey',
    hint: 'start or stop monkey test',
  },
  {
    value: 'props',
    hint: 'get or set prop',
  },
  {
    value: 'rotation',
    hint: 'manage screen rotation',
  },
  {
    value: 'screencap',
    hint: 'take screenshot',
  },
  {
    value: 'uimode',
    hint: 'manage ui mode, day/night/auto',
  },
  {
    value: 'wm',
    hint: 'manage window manager config, size, density, etc',
  },
  {
    value: 'exit',
  },
]
