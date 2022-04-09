# master-styles-group

A plugin for [Master Styles](https://github.com/master-co/styles) to group up styles and add selectors.

### THIS PROJECT IS IN BETA

This project may contain bugs and have not being tested at all. Use under your own risk, but feel free to test, make pull request and improve this project.

## Features

- Group up master styles
- Add a [Selector](https://docs.master.co/styles/selectors) / [Breakpoints](https://docs.master.co/styles/breakpoints) / [Media Queries](https://docs.master.co/styles/media-queries), etc. for all styles inside a group in one-line.
- Support for adding selectors in front of style group

## Install

> ⚗️  **Experimental**
```
npm install master-styles-group
```

```
yarn add master-styles-group
```

### CDN

```html
<script src="https://unpkg.com/master-styles-group"></script>
```

## Setup

```js
import "master-styles-group";
```

## Usage

- Use `{}` to group up styles
- Use `;_` to separate each style
- Optional put a selector at start or end

### Examples

```html
<div class="{m:2;_p:2;4;_f:red}@"></div>
<!-- equals -->
<div class="m:2 p:2;4 f:red"></div>
```

```html
<div class="{m:2;_p:2;4;_f:red}@xs"></div>
<!-- equals -->
<div class="@xs{m:2;_p:2;4;_f:red}"></div>
<!-- equals -->
<div class="m:2@xs p:2;4@xs f:red@xs"></div>
```

## License

MIT License
