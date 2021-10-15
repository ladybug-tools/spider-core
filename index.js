const gbXMLParser = require('./lib/gbXMLParser');
const threeGenerator = require('./lib/threeGenerator');
const Spider = require('./lib/spider');
// /**
//  * Spider Module
//  * @module Spider
//  */

module.exports = Spider;

const fs = require('fs');
//const Spider = require('@ladybug-tools/spider-core');

const gbXMLString = fs.readFileSync('london-office.xml');

const gbXMLJson = Spider.gbXMLParser.parseFileXML(gbXMLString);

console.log(JSON.stringify(gbXMLJson, null, 2));
