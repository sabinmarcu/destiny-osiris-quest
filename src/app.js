/* eslint-disable no-loop-func */
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

import { Set } from './set';

const init = 's';
const rows = [
  'hcdssep',
  'shbddcb',
  'phseeed',
  'scbhdpc',
  'sbpdchb',
]
  .map((it) => new Set(...it));

console.log('Starting node ', init);
console.log('Analysing rows');
rows.map((it) => it.toString()).forEach((it) => console.log(it));

const dataSet = yaml.safeLoad(
  fs.readFileSync(
    path.resolve(__dirname, '../data/map.yml'),
    'utf-8',
  ),
);

const map = Object
  .entries(dataSet)
  .reduce(
    (prevNode, [node, sets]) => ({
      ...prevNode,
      [node]: Object
        .entries(sets)
        .reduce(
          (prevRow, [target, row]) => ({
            ...prevRow,
            [target]: new Set(...row.split('')),
          }),
          {},
        ),
    }),
    {},
  );

const possibleStarters = Object.keys(map).filter((it) => it.startsWith(init));
console.log('=== Starting at', possibleStarters);

const findMatches = (nodes) => nodes
  .map((key) => [key, map[key]])
  .map(([key, node]) => [
    key,
    Object.entries(node)
      .map(([k, set]) => [k, set, rows.filter((row) => row.deepEquals(set))])
      .filter(([,, matches]) => matches.length > 0)
      .reduce(
        (prev, [k, value, matches]) => ([...prev, { node: k, value, matches }]),
        [],
      ),
  ])
  .filter(([, results]) => results.length > 0)
  .reduce(
    (prev, [key, results]) => [...prev, { node: key, results }],
    [],
  );

let matches = findMatches(possibleStarters);
let iterations = 0;
while (matches.length > 0 && iterations < rows.length) {
  console.log(
    '=== Moving from',
    matches.map(
      ({ node, results }) => [
        node,
        'to',
        `[${results.map(({ node: n, value, matches: m }) => `${n} (${value.row.join('')} -> ${m.map((it) => it.row.join('')).join('/')})`).join(', ')}]`,
      ].join(' '),
      `(${iterations + 1}/${rows.length})`,
    ).join(', '),
  );
  matches = matches.map(
    ({ results }) => findMatches(results.map(({ node: n }) => n)),
  ).flat();
  iterations += 1;
}
console.log('DONE');
