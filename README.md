# adc

An interactive ADB CLI tool for Android Development.

![Alt text](adc.gif)

## Usage

```bash
npm install -g @kuss/adc

adc
```

Or Just use npx

```bash
npx @kuss/adc
```

Example:

```bash
?? adc ›
❯   am-start - activity manager start actions
    am-stop - activity manager stop actions
    install/uninstall - install or uninstall apk
    input - send input event
    ime - manage input method, keyboard, etc
    monkey - start or stop monkey test
    props - get or set prop
    rotation - manage screen rotation
    screencap - take screenshot
    uimode - manage ui mode, day/night/auto
    wm - manage window manager config, size, density, etc
    exit
```

## Development

```bash
git clone https://github.com/KusStar/adc

cd adc

# install pnpm first, then
pnpm install

pnpm dev
# or pnpm build

npm i -g .

# test locally
adc
```
