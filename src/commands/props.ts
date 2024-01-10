import { outro } from '@clack/prompts'
import { adb, goBack, prompts2 } from '../utils'

/**
 * [xxx] to xxx
 * @param it
 */
function formatProp(it: string) {
  return it.slice(1, -1)
}

export async function props(device: string | undefined) {
  const { choice, cancelled } = await prompts2({
    type: 'autocomplete',
    name: 'choice',
    message: 'Get or set prop',
    choices: [
      {
        value: 'get',
        title: 'get',
        description: 'get prop',
      },
      {
        value: 'set',
        title: 'set',
        description: 'set prop',
      },
      {
        value: 'back',
        title: 'back',
        description: 'go back',
      },
    ],
  })

  if (cancelled || choice === 'back') {
    return goBack()
  }

  if (choice === 'get') {
    const allProps = adb('shell getprop', device)
      .toString()
      .trim()
      .split('\n')
      .map((it) => {
        return it.split(': ').map(formatProp)
      })

    const { value, cancelled } = await prompts2({
      type: 'autocomplete',
      name: 'value',
      message: 'Get a prop',
      choices: allProps.map(it => ({ value: it[1], title: it[0], description: it[1] })),
      suggest: (input, choices) => Promise.resolve(choices.filter(it => it.title.includes(input))),
    })

    if (cancelled) {
      return props(device)
    }

    outro(value)
  }

  if (choice === 'set') {
    const { key, cancelled } = await prompts2({
      type: 'text',
      name: 'key',
      message: 'Prop key',
    })

    if (cancelled) {
      return props(device)
    }

    const { value, cancelled: cancelled2 } = await prompts2({
      type: 'text',
      name: 'value',
      message: 'Prop value',
    })

    if (cancelled2) {
      return props(device)
    }

    adb(`shell setprop ${key} ${value}`, device)

    outro(`set prop [${key}]: [${value}]`)
  }
}
