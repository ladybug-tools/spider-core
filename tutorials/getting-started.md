# Getting Started

The spider-core package aims to provide a data manipulation layer from which users can build 3D visualisation tools as well as general 3D model debugging applications.

To do so you will need to start a node project, create an index.js file and then write some code that uses the Spider-Core package.

### 1. Create a NodeJS project
Create a directory for your project, run npm init and follow the steps:
```console
mkdir my-cool-project
cd my-cool-project
npm init
```

### 2. Write Some Code
Write some code in index.js and run it. Copy paste the code below into `index.js`, replacing `'/path/to/file.gbxml'` with an actual path to a gbXML file.

```javascript
const fs = require('fs');
const Spider = require('@ladybug-tools/spider-core');

const gbXMLString = fs.readFileSync('/path/to/file.gbxml');

const gbXMLJson = Spider.gbXMLParser.parseFileXML(gbXMLString);

console.log(JSON.stringify(gbXMLJson, null, 2));
```

Test out the code!

```console
node index.js
```

It should print a massive JSON file in your command line.