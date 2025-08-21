# Futoast - A Lightweight, Customizable Toast Notification Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Overview

**Futoast** is a lightweight and customizable JavaScript alert & toast notification library. Easily show success, error, info, or loading messages with rich UI options, animation, and full control. Perfect for frontend developers who want beautiful, non-blocking notifications.

## 📦 Installation

### Via CDN (Easiest)

```html
<!-- Just before </body> -->
<script src="https://cdn.jsdelivr.net/npm/futoast@3.1.0/dist/futoast.min.js"></script>
```

### Via NPM (Recommended for Modern Projects)

```bash
npm install futoast
```

### Via Yarn

```bash
yarn add futoast
```

---

## ✅ Key Features

- 🚀 Lightweight (Only 12kb gzipped)
- 🌈 Customizable themes (Light/Dark mode support)
- 🎨 Multiple notification types (Success, Error, Warning, Info, etc.)
- 📱 Fully responsive (Works on all device sizes)
- 🎭 Beautiful animations (10+ built-in animations)
- ⏳ Progress bar for timed notifications
- 🖱️ Interactive elements (Buttons, click handlers)
- 🔔 Sound notifications (Optional)
- 📦 Framework support (React, Vue, Angular, Django, Vanilla JS)
- ♿ Accessibility (ARIA compliant)

---

## 🛠️ Usage Examples

### Simple Alert

```js
// Show a simple toast
Futoast.show("Hello World!");

// Show different types of toasts
Futoast.success("Operation completed successfully!");
Futoast.error("Something went wrong!");
Futoast.warning("This action cannot be undone");
Futoast.info("New update available");

// Demo Buttons
<button onclick="Futoast.primary('Primary Alert')"> Primary </button>
<button onclick="Futoast.secondary('Secondary Alert')"> Secondary </button>
<button onclick="Futoast.success('Success!')"> Success </button>
<button onclick="Futoast.error('Error!')"> Error </button>
<button onclick="Futoast.warning('Warning!')"> Warning </button>
<button onclick="Futoast.info('Info!')"> Info </button>
<button onclick="Futoast.question('Are you sure?')"> Question </button>
<button onclick="Futoast.loading('Please wait...')"> Loading</button>
```

### Custom Alert with Options

```js
Futoast.show("Custom toast", {
  type: "primary",
  timeout: 3000,
  position: "top-center",
  animationIn: "zoomIn",
});
```

---

## 🔧 Options Reference

```js
// Basic usage with all new options
Futoast.info("Custom message", {
  position: "top-right",
  timeout: 4000,
  type: "info",
  themeMode: "auto",
  icon: "<svg>...</svg>",
  closeButton: true,
  pauseOnHover: true,
  draggable: false,
  progressBar: true,
  sound: true,
  html: false,
  animationIn: "fadeIn",
  animationOut: "fadeOut",
  buttons: [
    {
      text: "Retry",
      action: retryFunction,
      style: "background: #4CAF50;",
      class: "retry-btn",
    },
  ],
  onShow: () => console.log("Alert appeared"),
  onClick: (e) => saveChanges(),
  onClose: () => console.log("Alert closed"),
  onTimeout: () => autoSave(),
});

// Auto dark/light mode detection
Futoast.success("Theme detected automatically", {
  themeMode: "auto",
});

// With custom sound
Futoast.error("Critical error!", {
  sound: true,
  customSound: "/sounds/alert.mp3",
});

// With action buttons
Futoast.show("Confirm deletion?", {
  buttons: [
    { text: "Cancel", action: () => {} },
    { text: "Delete", action: deleteItem, style: "background: #f44336;" },
  ],
  timeout: 0, // Requires manual close
});
```

---

## Animation Types

```js
// Available animations:
futoast-fadeIn ,futoast-fadeOut ,futoast-zoomIn ,futoast-slideInRight ,futoast-slideInLeft ,futoast-bounce ,futoast-flip ,futoast-pulse ,futoast-spinner
```

---

## 🚀 Toast Methods

| Method      | Description                  | Example                             |
|-------------|------------------------------|-------------------------------------|
| `show()`    | Show a basic toast           | `Futoast.show("Hello")`             |
| `primary()` | Primary style toast          | `Futoast.primary("Info")`           |
| `success()` | Success style toast          | `Futoast.success("Done!")`          |
| `error()`   | Error style toast            | `Futoast.error("Failed!")`          |
| `warning()` | Warning style toast          | `Futoast.warning("Careful!")`       |
| `info()`    | Info style toast             | `Futoast.info("FYI")`               |
| `question()`| Question style toast         | `Futoast.question("Sure?")`         |
| `loading()` | Loading indicator (no timeout)| `Futoast.loading("Processing...")` |
| `clear()`   | Remove all toasts            | `Futoast.clear()`                   |

---

## ⚙️ Configuration Options

| Option           | Type      | Default                  | Description |
|------------------|-----------|--------------------------|-------------|
| `position`        | `string`  | `'top-right'`            | Position of toast (e.g. `top-right`, `bottom-center`) |
| `timeout`         | `number`  | `5000`                   | Auto-close time in ms (`0` = no timeout) |
| `type`            | `string`  | `'primary'`              | Toast type |
| `theme`           | `string`  | `'light'`                | `light` or `dark` theme |
| `icon`            | `string`  | `null`                   | Custom icon (text, HTML, or image URL) |
| `closeButton`     | `boolean` | `true`                   | Show close button |
| `pauseOnHover`    | `boolean` | `true`                   | Pause timer on hover |
| `draggable`       | `boolean` | `false`                  | Allow drag to dismiss |
| `progressBar`     | `boolean` | `true`                   | Show progress bar |
| `sound`           | `boolean` | `false`                  | Play sound |
| `html`            | `boolean` | `false`                  | Enable HTML in message |
| `animationIn`     | `string`  | `'fadeIn'`               | Show animation (`fadeIn`, `zoomIn`, etc.) |
| `animationOut`    | `string`  | `'fadeOut'`              | Hide animation (`fadeOut`, `zoomOut`) |
| `onClick`         | `function`| `null`                   | Click event handler |
| `onClose`         | `function`| `null`                   | Called when toast closes |
| `onShow`          | `function`| `null`                   | Called when toast shows |
| `onTimeout`       | `function`| `null`                   | Called on timeout |
| `rtl`             | `boolean` | `false`                  | Enable RTL layout |
| `css`             | `string`  | `''`                     | Extra inline CSS |
| `queue`           | `boolean` | `true`                   | Queue multiple toasts |
| `zIndex`          | `number`  | `999999`                 | z-index for toast |
| `overlay`         | `boolean` | `false`                  | Show overlay |
| `overlayClose`    | `boolean` | `false`                  | Click overlay to close |
| `overlayColor`    | `string`  | `'rgba(0,0,0,0.5)'`       | Overlay color |
| `customIcon`      | `string`  | `null`                   | Custom HTML icon |
| `customSound`     | `string`  | `null`                   | URL for custom sound |
| `buttons`         | `array`   | `null`                   | Action buttons on toast |
| `focus`           | `boolean` | `true`                   | Autofocus toast |
| `fontFamily`      | `string`  | `''`                     | Custom font family |
| `fontSize`        | `string`  | `''`                     | Custom font size |
| `maxWidth`        | `string`  | `'350px'`                | Max toast width |
| `minWidth`        | `string`  | `'300px'`                | Min toast width |
| `mobilePosition`  | `string`  | `'top'`                  | Mobile toast position (`top`, `bottom`, `same`) |
| `mobileMaxWidth`  | `string`  | `'90%'`                  | Max mobile toast width |
| `mobileMinWidth`  | `string`  | `'80%'`                  | Min mobile toast width |
| `ariaLive`        | `string`  | `'assertive'`            | ARIA live (`polite`, `assertive`, `off`) |

---

## 🛠️ Utility Methods

| Method             | Description                              | Example |
|--------------------|------------------------------------------|---------|
| `applyTheme()`     | Apply custom theme colors                | `Futoast.applyTheme({ primary: '#ff0000' })` |
| `setIcons()`       | Set default icons                        | `Futoast.setIcons({ success: '✔️' })` |
| `setThemeMode()`   | Set dark/light mode                      | `Futoast.setThemeMode('dark')` |
| `setFont()`        | Set custom font                          | `Futoast.setFont('Roboto', '14px')` |

---

## Advanced Examples

### Custom Theme
```js
Futoast.applyTheme({
  primary: '#4a6bdf',
  success: '#3ac569',
  error: '#f54242',
  warning: '#f5a742',
  info: '#42b0f5',
  bg: '#ffffff',
  text: '#2d3748'
});

Futoast.setThemeMode('dark'); 
```
### Action Buttons
```js
Futoast.show("Item deleted", {
  type: 'error',
  buttons: [
    {
      text: 'Undo',
      action: () => undoDelete(),
      style: 'background: #4a6bdf; color: white;',
      closeOnClick: false
    },
    {
      text: 'Dismiss',
      action: () => {},
      class: 'dismiss-btn'
    }
  ]
});
```
---

## ⚙️ Framework-Specific Usage

### ✅ HTML
- Use via <script> as shown in CDN setup.

### ✅ React
```jsx
import React from 'react';
import Futoast from 'futoast';
import { useFutoast, FutoastContainer } from 'futoast';

function MyComponent() {
  const toast = useFutoast();
  
  const handleClick = () => {
    toast.success("React toast notification!", {
      timeout: 3000,
      position: 'top-center'
    });
  };
  
  return (
    <div>
      <FutoastContainer />
      <button onClick={handleClick}>Show Toast</button>
    </div>
  );
}
```
### ✅ Vue
```js
// main.js
import Vue from 'vue';
import Futoast from 'futoast';

Vue.use(Futoast.Vue, {
  inject: true // Inject $futoast in all components
});

// Component
export default {
  methods: {
    showToast() {
      this.$futoast.info('Vue toast!', {
        position: 'bottom-right'
      });
    }
  }
}
```

### Angular
```ts
import { Component } from '@angular/core';
import { Futoast } from 'futoast';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="showSuccess()">Success</button>
    <button (click)="showError()">Error</button>
  `
})
export class AppComponent {
  showSuccess() {
    Futoast.success('Angular success toast!');
  }
  
  showError() {
    Futoast.error('Something went wrong!');
  }
}
```
---

## 🏷️ Keywords

`Futoast`, `toast message`, `JavaScript alerts`, `alert library`, `custom alerts`, `JS notification`, `success alert`, `error alert`, `info alert`, `notification library`, `toast notification`, `UI alerts`, `frontend toast`

---

## Author

Created with ❤️ by Rajkumar Nimod.

Connect with me on [LinkedIn](https://www.linkedin.com/in/rajkumar-nimod)
📫 rajkumar221299@gmail.com

---
## 🙏 Credits

We'd like to thank all the people who contributed to this project.

👉 [View full contributors list →](CONTRIBUTORS.md)

---

## 📄 License

MIT License – Free for personal and commercial use.

---

## 🌟 Support the Project

If you find Futoast useful:

- ⭐ Star the repo
- 🗣 Share with fellow developers
- 📢 Mention it in blogs, videos, or tutorials
