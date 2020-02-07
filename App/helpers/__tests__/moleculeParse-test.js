import {findAtoms} from '../molecularParser';

test('H', () => {
  expect(findAtoms('H')).toEqual({H: 1});
});

test('H2Mg', () => {
  expect(findAtoms('H2Mg')).toEqual({H: 2, Mg: 1});
});

test('H2MgH', () => {
  expect(findAtoms('H2MgH')).toEqual({H: 3, Mg: 1});
});

test('[H]Mg', () => {
  expect(findAtoms('[H]Mg')).toEqual({H: 1, Mg: 1});
});

test('[HO]2Mg', () => {
  expect(findAtoms('[HO]2Mg')).toEqual({H: 2, O: 2, Mg: 1});
});

test('K4{ON(SO3)2}2', () => {
  expect(findAtoms('K4{ON(SO3)2}2')).toEqual({K: 4, O: 14, N: 2, S: 4});
});

test('{[Co(NH3)4(OH)2]3Co}(SO4)3', () => {
  expect(findAtoms('{[Co(NH3)4(OH)2]3Co}(SO4)3')).toEqual({Co: 4, N: 12, H: 42, O: 18, S: 3});
});

test('Mg(OH)2', () => {
  expect(findAtoms('Mg(OH)2')).toEqual({Mg: 1, O: 2, H: 2});
});

test('Fe(NO3)2', () => {
  expect(findAtoms('Fe(NO3)2')).toEqual({Fe: 1, N: 2, O: 6});
});
