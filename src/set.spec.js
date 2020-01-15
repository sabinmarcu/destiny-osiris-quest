import { Set } from './set';

describe('Set', () => {
  describe('construction', () => {
    it('should construct properly with valid arguments', () => {
      expect(() => new Set(...'hcdssep'.split(''))).not.toThrow();
    });

    it('should error out on length', () => {
      let error = null;
      const row = 'hcdsep'.split('');
      try {
        new Set(...row); // eslint-disable-line
      } catch (e) {
        error = e;
      }
      expect(error).toBeTruthy();
      expect(error.errors).toBeTruthy();
      expect(error.errors.length).toEqual(1);
      expect(error.errors[0]).toEqual(`row ${row.join(', ')} is of invalid size (${row.length}/7)`);
    });

    it('should error out on length', () => {
      let error = null;
      const row = 'hnsbdlq';
      try {
        new Set(...row.split('')); // eslint-disable-line
      } catch (e) {
        error = e;
      }
      expect(error).toBeTruthy();
      expect(error.errors).toBeTruthy();
      expect(error.errors.length).toEqual(3);
      expect(error.errors[0]).toEqual('symbol n is invalid');
      expect(error.errors[1]).toEqual('symbol l is invalid');
      expect(error.errors[2]).toEqual('symbol q is invalid');
    });
  });

  describe('toString', () => {
    it('should format properly', () => {
      const row = 'hcdssep'.split('');
      const expected = `
 h c
d s s
 e p
`;
      const set = new Set(...row);
      expect(set.toString()).toEqual(expected);
      expect(`${set}`).toEqual(expected);
    });
  });

  describe('permutateRight', () => {
    it('should generate the proper permutations', () => {
      const set = new Set(...'hcdssep'.split(''));
      const p1 = set.permutateRight;
      expect(p1.row).toEqual('dhescps'.split(''));
      const p2 = p1.permutateRight;
      expect(p2.row).toEqual('edpshsc'.split(''));
      const p3 = p2.permutateRight;
      expect(p3.row).toEqual('pessdch'.split(''));
      const p4 = p3.permutateRight;
      expect(p4.row).toEqual('spcsehd'.split(''));
      const p5 = p4.permutateRight;
      expect(p5.row).toEqual('cshspde'.split(''));
    });
  });

  describe('permutations', () => {
    it('should generate the proper permutations', () => {
      const set = new Set(...'hcdssep'.split(''));
      const p = set.permutations;
      [
        'hcdssep',
        'dhescps',
        'edpshsc',
        'pessdch',
        'spcsehd',
        'cshspde',
      ]
        .map((it) => it.split(''))
        .forEach((it, index) => expect(p[index].row).toEqual(it));
    });
  });

  describe('equals', () => {
    it('should succeed on proper input', () => {
      const set1 = new Set(...'hcdssep'.split(''));
      const set2 = new Set(...'hcdssep'.split(''));
      expect(set1.equals(set2)).toEqual(true);
    });
    it('should succeed on empty checks', () => {
      const set1 = new Set(...'hcdssep'.split(''));
      const set2 = new Set(...'hcdsspp'.split(''));
      expect(set1.equals(set2)).toEqual(true);
    });
    it('should fail on different sets', () => {
      const set1 = new Set(...'hcdssep'.split(''));
      const set2 = new Set(...'hcdsppp'.split(''));
      expect(set1.equals(set2)).toEqual(false);
    });
  });

  describe('deep equals', () => {
    it('should succeed on proper input', () => {
      const set1 = new Set(...'hcdssep'.split(''));
      const set2 = new Set(...'dhescps'.split(''));
      expect(set1.deepEquals(set2)).toEqual(true);
    });
    it('should succeed on empty check', () => {
      const set1 = new Set(...'hcdssep'.split(''));
      const set2 = new Set(...'dhpscps'.split(''));
      expect(set1.deepEquals(set2)).toEqual(true);
    });
    it('should fail on different sets', () => {
      const set1 = new Set(...'hcdssep'.split(''));
      const set2 = new Set(...'dhespps'.split(''));
      expect(set1.deepEquals(set2)).toEqual(false);
    });
  });
});
