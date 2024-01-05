# adc

An interactive ADB CLI tool for Android Development.

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
? adc ›
❯   am-start - activity manager start actions
    am-stop - activity manager stop actions
    install/uninstall - install or uninstall apk
    ime - manage input method, keyboard, etc
    monkey - start or stop monkey test
    rotation - manage screen rotation
    wm - manage window manager config, size, density, etc
    exit
```

## Development

```bash
git clone ...

cd adc

# install pnpm first, then
pnpm install

pnpm dev

npm i -g .

# test locally
adc
```
