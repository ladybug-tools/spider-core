const { DOMParser } = require('xmldom');

/**
 * gbXMLParser
 * @module gbXMLParser
 */

/**
 * I am not really sure what this does... Theo any help?
 * @param {Object} data a data accumulator
 * @param {string} name the name of a key
 * @param {*} value The value to set the key to in the data accumulator
 * @returns {Object} returns the data object with any additional accumulated data
 */
const Add = (data, name, value) => {
  const accumulator = { ...data };
  if (accumulator[name]) {
    if (accumulator[name].constructor !== Array) {
      accumulator[name] = [accumulator[name]];
    }
    accumulator[name][accumulator[name].length] = value;
  } else {
    accumulator[name] = value;
  }
  return accumulator;
};

/**
 * Returns JSON from gbxml ???
 * @alias module:gbXMLParser.getXML2jsobj
 * @param {Object} node
 */
const getXML2jsobj = (node) => {
  // console.log(node)
  let data = {};

  let child;
  let childNode;

  for (child = 0; childNode = node.attributes[child]; child++) {
    data = Add(data, childNode.name, childNode.value);
  }

  for (child = 0; childNode = node.childNodes[child]; child++) {
    if (childNode.nodeType === 1) {
      if (childNode.childNodes.length === 1 && childNode.firstChild.nodeType === 3) { // text value
        data = Add(data, childNode.nodeName, childNode.firstChild.nodeValue);
      } else { // sub-object
        data = Add(data, childNode.nodeName, getXML2jsobj(childNode));
      }
    }
  }

  return data;
};

/**
 * Parses a gbXML string and returns a list of 'jsonified' surfaces
 * @alias module:gbXMLParser.parseFileXML
 * @param {string} xml
 * @returns {Object} A JSON parsed list of surfaces from the gbXML
 */
const parseFileXML = (xml) => {
  const parser = new DOMParser();
  const gbXML = parser.parseFromString(xml, 'text/xml');
  // console.log(gbXML)
  const gbJSON = getXML2jsobj(gbXML.documentElement);
  // const surfacesJSON = gbJSON.Campus.Surface;
  // console.log(gbJSON)
  return gbJSON.Campus.Surface;
};

module.exports = {
  parseFileXML,
  getXML2jsobj,
};
