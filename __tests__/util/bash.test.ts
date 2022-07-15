import { split, command } from '../../util/bash';

describe('Parse a command', () => {
  it('splits a line into separate components', () => {
    expect(split('node -v')).toEqual(expect.arrayContaining(['node', '-v']));

    expect(split('node -v "foo"')).toEqual(
      expect.arrayContaining(['node', '-v', '"foo"']),
    );

    expect(split('node -v "foo bar"')).toEqual(
      expect.arrayContaining(['node', '-v', '"foo bar"']),
    );

    expect(split("node -v 'foo bar'")).toEqual(
      expect.arrayContaining(['node', '-v', "'foo bar'"]),
    );

    expect(split('git push origin --this-is-a-branch --all')).toEqual(
      expect.arrayContaining([
        'git',
        'push',
        'origin',
        '--this-is-a-branch',
        '--all',
      ]),
    );

    expect(split("ls -aCp")).toEqual(
      expect.arrayContaining(['ls', '-aCp']),
    );
  });

  it('identifies the binary being called', async () => {
    expect(command('node -v')).toEqual('node');
    expect(command('/usr/bin/node -v')).toEqual('node');
    expect(command('git push origin')).toEqual('git');
    expect(command('./node_modules/.bin/jest')).toEqual('jest');
    expect(command('cp')).toEqual('cp');
  });
});
