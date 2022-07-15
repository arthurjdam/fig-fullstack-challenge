import { load, parse } from '../../data/fig';

const dummySpec: Fig.Spec = {
  name: 'foo',
  description: 'foo',
  args: {
    isVariadic: true,
    template: ['filepaths', 'folders'],
  },
  subcommands: [
    {
      name: 'bar',
      args: [
        {
          name: 'baz',
        },
      ],
    },
  ],
  options: [
    {
      name: '-f',
      description: 'force',
    },
    {
      name: '-g',
      description: 'gorce',
    }
  ],
};

describe('Parse a command with one option', () => {
  const singleOption = parse(['foo', '-f'], dummySpec);

  it('Identified the command', () => {
    expect(singleOption[0].type).toBe('command');
    expect(singleOption[0].description).toBe('foo');
  });
  
  it('Output the correct amount of parts', () => {
    expect(singleOption).toHaveLength(2);
  });

  it('Identified the option', () => {
    expect(singleOption[1].type).toBe('option');
    expect(singleOption[1].description).toBe('force');
  });
});

describe('Parse a command with a subcommand', () => {
  const singleCommand = parse(['foo', 'bar'], dummySpec);

  it('Identified the command', () => {
    expect(singleCommand[0].type).toBe('command');
    expect(singleCommand[0].description).toBe('foo');
  });

  it('Output the correct amount of parts', () => {
    expect(singleCommand).toHaveLength(2);
  });

  it('Identified the subcommand', () => {
    expect(singleCommand[1].type).toBe('subcommand');
    expect(singleCommand[1].description).toBe('bar');
  });
});

describe('Parse a command without a subcommand but with an argument', () => {
  const singleArg = parse(['foo', 'qux'], dummySpec);

  it('Output the correct amount of parts', () => {
    expect(singleArg).toHaveLength(2);
  });

  it('Identified the argument', () => {
    expect(singleArg[1].type).toBe('argument');
    expect(singleArg[1].original).toBe('qux');
  });
});

describe('Parse a command with a subcommand and an argument', () => {
  const singleCommandWithArg = parse(['foo', 'bar', 'qux'], dummySpec);

  it('Identified the subcommand', () => {
    expect(singleCommandWithArg[1].type).toBe('subcommand');
    expect(singleCommandWithArg[1].description).toBe('bar');
  });

  it('Identified the argument', () => {
    expect(singleCommandWithArg[2].type).toBe('argument');
    expect(singleCommandWithArg[2].description).toBe('baz');
    expect(singleCommandWithArg[2].original).toBe('qux');
  });
});

describe('Parse a command chained options', () => {
  const chainedOptions = parse(['foo', '-fg'], dummySpec);

  it('Split the chained options into separate entries', () => {
    expect(chainedOptions).toHaveLength(4);
  });
});

// describe('Load a spec from the CDN', () => {
//   it('Loads a valid spec successfully', async () => {
//     const spec = await load('node');
//     console.log(spec);
//   });
// });