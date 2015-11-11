'use strict';

describe('Notes E2E Tests:', function () {
  describe('Test notes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/notes');
      expect(element.all(by.repeater('note in notes')).count()).toEqual(0);
    });
  });
});
