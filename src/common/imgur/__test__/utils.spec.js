
import {parse} from '../utils';

import {
  expect,
} from '../../../../test/mochaTestHelper';

describe('imgur utils', () => {
  describe('parseId()', () => {
    it('handles urls with no clues', () => {
      const parts = parse('http://imgur.com/Wsa5lA8');
      expect(parts).to.eql({type: false, id: 'Wsa5lA8'});
    });
    it('handles urls with /a/ prefix', () => {
      const parts = parse('http://imgur.com/a/Wsa5lA8');
      expect(parts).to.eql({type: 'album', id: 'Wsa5lA8'});
    });
    it('handles urls with sort suffix', () => {
      const parts = parse('http://imgur.com/gallery/Wsa5lA8/new');
      expect(parts).to.eql({type: 'gallery', id: 'Wsa5lA8'});
    });
    it('handles urls with /gallery/ prefix', () => {
      const parts = parse('http://imgur.com/gallery/Wsa5lA8');
      expect(parts).to.eql({type: 'gallery', id: 'Wsa5lA8'});
    });
    it('handles urls with trailing slash', () => {
      const parts = parse('http://imgur.com/gallery/Wsa5lA8/');
      expect(parts).to.eql({type: 'gallery', id: 'Wsa5lA8'});
    });
  });
});
