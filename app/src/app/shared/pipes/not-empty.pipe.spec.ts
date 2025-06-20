import { NotEmptyPipe } from './not-empty.pipe';

describe('NotEmptyPipe', () => {
  let pipe: NotEmptyPipe;

  beforeEach(() => {
    pipe = new NotEmptyPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it(`should return a string`, () => {
    expect(pipe.transform('string')).toEqual('string');
  });
  it(`should return a number`, () => {
    expect(pipe.transform(111)).toEqual(111);
  });
  it(`should return empty string for a empty array`, () => {
    expect(pipe.transform([])).toEqual('');
  });
  it(`should return empty string for null value`, () => {
    expect(pipe.transform(null)).toEqual('');
  });
  it(`should return empty string for undefined`, () => {
    expect(pipe.transform(undefined)).toEqual('');
  });
  it(`should return empty string for empty object`, () => {
    expect(pipe.transform({})).toEqual('');
  });
  it(`should return replacement string for empty value`, () => {
    expect(pipe.transform('', '-')).toEqual('-');
  });
  it(`should return replacement string for a empty array`, () => {
    expect(pipe.transform([], 'empty')).toEqual('empty');
  });
  it(`should return replacement string for null value`, () => {
    expect(pipe.transform(null, 'null')).toEqual('null');
  });
  it(`should return replacement string for undefined`, () => {
    expect(pipe.transform(undefined, 'not defined')).toEqual('not defined');
  });
  it(`should return replacement string for empty object`, () => {
    expect(pipe.transform({}, '-')).toEqual('-');
  });
});
