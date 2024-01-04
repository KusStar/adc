import { execSync } from 'child_process'
import { outro, select, isCancel } from '@clack/prompts';

export const ime = async (goBack: () => void) => {
  const imes = execSync('adb shell ime list -s').toString().trim().split('\n')

  const options = imes.map(it => ({ value: it, label: it }))

  options.push({
    value: 'back',
    label: 'back',
    hint: 'go back',
  } as any)

  const selected = await select({
    message: 'Select a ime',
    options
  })

  if (isCancel(selected)) return outro('No ime selected')

  if (selected === 'back') return goBack()
  
  execSync(`adb shell ime set ${selected}`)

  outro(`ime set to ${selected}`)
}
