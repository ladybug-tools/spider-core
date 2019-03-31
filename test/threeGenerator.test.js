const assert = require('assert');
const threeGenerator = require('../lib/threeGenerator');

const surfacesJson = require('./assets/sam-live-surfaces.json')

describe('threeGenerator', () => {
  describe('getSurfaceMeshes', () => {
    it('should not fail', () => {
      const surfaceMeshes = threeGenerator.getSurfaceMeshes(surfacesJson);
    });
  });
});