import { IgnoreFile } from '..';
import { synthSnapshot, TestProject } from './util';

test('ignorefile synthesises correctly', () => {
  // GIVEN
  const prj = new TestProject();

  // WHEN
  new IgnoreFile(prj, '.dockerignore');

  // THEN
  expect(splitAndIgnoreMarker(synthSnapshot(prj)['.dockerignore'])).toEqual([]);
});

test('ignorefile does not sort entries', () => {
  // GIVEN
  const prj = new TestProject();

  // WHEN
  const file = new IgnoreFile(prj, '.dockerignore');
  file.include('c.txt', 'd.txt');
  file.exclude('a.txt', 'b.txt');
  file.exclude('e.txt', 'f.txt');

  // THEN
  expect(splitAndIgnoreMarker(synthSnapshot(prj)['.dockerignore'])).toEqual([
    '!c.txt',
    '!d.txt',
    'a.txt',
    'b.txt',
    'e.txt',
    'f.txt',
  ]);
});

test('ignorefile includes file after exclusion and inclusion', () => {
  // GIVEN
  const prj = new TestProject();

  // WHEN
  const file = new IgnoreFile(prj, '.dockerignore');
  file.exclude('a.txt');
  file.include('a.txt');

  // THEN
  expect(splitAndIgnoreMarker(synthSnapshot(prj)['.dockerignore'])).toEqual([
    '!a.txt',
  ]);
});

test('ignorefile excludes file after inclusion and exclusion', () => {
  // GIVEN
  const prj = new TestProject();

  // WHEN
  const file = new IgnoreFile(prj, '.dockerignore');
  file.include('a.txt');
  file.exclude('a.txt');

  // THEN
  expect(splitAndIgnoreMarker(synthSnapshot(prj)['.dockerignore'])).toEqual([
    'a.txt',
  ]);
});

test('ignorefile omits duplicated includes and excludes', () => {
  // GIVEN
  const prj = new TestProject();

  // WHEN
  const file = new IgnoreFile(prj, '.dockerignore');
  file.exclude('a.txt', 'b.txt');
  file.include('c.txt', 'd.txt');
  file.exclude('a.txt', 'b.txt');
  file.include('c.txt', 'd.txt');

  // THEN
  expect(splitAndIgnoreMarker(synthSnapshot(prj)['.dockerignore'])).toEqual([
    'a.txt',
    'b.txt',
    '!c.txt',
    '!d.txt',
  ]);
});

// parses file contents without 'Generated by...' spiel
function splitAndIgnoreMarker(fileContents: string) {
  return fileContents.split('\n').slice(1);
}
