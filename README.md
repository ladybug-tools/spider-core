 [![NPM](https://nodei.co/npm/@ladybug-tools/spider-core.png?downloads=true)](https://nodei.co/npm/@ladybug-tools/spider-core/)

 [![Build Status](https://travis-ci.org/ladybug-tools/spider-core.svg?branch=master)](https://travis-ci.org/ladybug-tools/spider-core)
[![npm](https://img.shields.io/npm/v/@ladybug-tools/spider-core.svg)](https://www.npmjs.com/package/@ladybug-tools/spider-core)
[![Download](https://img.shields.io/npm/v/@ladybug-tools/spider-core.svg?label=Download)](https://github.com/ladybug-tools/spider-core/tree/master/dist)
[![npm installs](https://img.shields.io/npm/dm/@ladybug-tools/spider-core.svg?label=npm%20installs)](https://www.npmjs.com/package/@ladybug-tools/spider-core)
[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](https://raw.githubusercontent.com/ladybug-tools/spider-core/master/LICENSE)


![Spider](https://raw.githubusercontent.com/ladybug-tools/artwork/master/icons_bugs/emoji/spider.png)

## Spider-Core
Lightweight JavaScript modules containing the core data parsing and rendering functions of Spider.

### Installation
```console
npm install --save @ladybug-tools/spider-core
```

### QuickStart

The spider-core package aims to provide a data manipulation layer from which users can build 3D visualisation tools as well as general 3D model debugging applications.

```javascript
const fs = require('fs');
const Spider = require('@ladybug-tools/spider-core');

const gbXMLString = fs.readFileSync('/path/to/file.gbxml').toString();

const gbXMLJson = Spider.gbXMLParser.parseFileXML(gbXMLString);

console.log(JSON.stringify(gbXMLJson, null, 2));
```

### Documentation
Full API documentation of the latest version of this package can be found [here](https://www.ladybug.tools/spider-core/docs/latest/).

### Contributing
Contributions are most welcome! Please refere to the [contributing guide](https://www.ladybug.tools/spider-core/docs/latest/tutorial-contributing.html) to help you get started.

### Releases
A list of releases and changes applied for each one can be found [here](https://github.com/ladybug-tools/spider-core/releases).