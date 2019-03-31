const fs = require('fs');
const assert = require('assert');
const gbXMLParser = require('../lib/gbXMLParser');

const gbXMLSample = fs.readFileSync('./test/assets/sam-live.gbxml', 'utf-8');

describe('gbXMLParser', () => {
  describe('parseFileXML', () => {
    it('should not fail', () => {
      const outFile = gbXMLParser.parseFileXML(gbXMLSample);
    });
  });
});
