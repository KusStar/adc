import { execSync } from 'child_process'
import { outro, select, isCancel } from '@clack/prompts';

export const ime = async () => {
  const imes = execSync('adb shell ime list -s').toString().trim().split('\n')
  
  const options = imes.map(it => ({ value: it, label: it }))

  const selected = await select({
    message: 'Selec a ime',
    options
  })

  if (isCancel(selected)) return outro('No ime selected')

  execSync(`adb shell ime set ${selected}`)

  outro(`ime set to ${selected}`)
}
