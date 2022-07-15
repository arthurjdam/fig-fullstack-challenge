import { command } from 'util/bash';
// import { exists } from "util/url";

/**
 * A non-expiring cache
 */
const figCache: Record<string, Fig.Spec> = {};

/**
 * Get skypack url from a bash command
 * @param cmd A back command
 * @returns A skypack url
 */
const url = (cmd: string): string =>
  `https://cdn.skypack.dev/@withfig/autocomplete/build/${cmd}.js`;

/**
 * Get the Fig definition of a command
 * @param definition
 * @returns
 */
export async function load(cmd: string): Promise<Fig.Spec | undefined> {
  if (cmd === '') {
    return;
  }

  const _command = command(cmd);
  if (figCache[_command]) {
    return figCache[_command];
  }

  try {
    const _url = url(_command);
    console.log(_url);
    // if (await exists(_url)) { // Unfortunately, skypack does not return 404 if a js file does not exist
    return (figCache[_command] = (
      await import(/* webpackIgnore: true */ _url)
    ).default);
    // }
  } catch (e) {
    throw Error('Could not load');
  }
}

export interface ParsedCommandPart {
  original: string;
  definition?: string;
  description: string;
  type: CommandPartType;
  head: Fig.Subcommand;
  chain?: boolean;
}

export type CommandPartType = 'command' | 'subcommand' | 'option' | 'argument' | 'unknown' | 'none';

/**
 * Match a command with a Fig.Option
 * @param command The input command to match
 * @param options The options to match the `command` with
 * @returns `undefined` if the command could not be found
 */
function findOption(command: string, options: Array<Fig.Option>): Fig.Option | undefined {
  return options.find(({ name }) => {
    if (Array.isArray(name)) {
      return name.includes(command)
    } else {
      return name === command;
    }
  });
};

function useStdin(command: string) {
  return command === '-';
}

/**
 * Try to match the individual parts to command/subcommand/options/arguments, and return it in a more details way.
 * @param parts An array of the command's components
 * @param spec The Fig Specification used
 * @returns 
 */
export function parse(parts: Array<string>, spec?: Fig.Subcommand): Array<ParsedCommandPart> {
  if (!spec) return [];

  let head = spec;
  let args: Array<Fig.Arg> = [];
  let isParsingArgs = false;

  return parts.reduce((arr: Array<ParsedCommandPart>, original, index) => {
    // The first part is always the command
    if (index === 0) {
      if (head.args) {
        isParsingArgs = true;
      }
      return arr.concat([{
        original,
        head,
        description: head.description || original,
        type: 'command',
      }]);
    }

    // Check if string is a valid subcommand
    if (head.subcommands) {
      const _command = findOption(original, head.subcommands);
      if (_command) {
        if (_command.args) {
          isParsingArgs = true;
        }
        head = _command;

        return arr.concat([{
          original,
          head,
          definition: Array.isArray(_command.name) ? _command.name.join(', ') : _command.name,
          description: _command.description || original,
          type: 'subcommand',
        }]);
      }
    }

    // Check if string is a valid option
    if (head.options) {
      if (original.slice(0, 1) === '-' && original.slice(1, 2) !== '-' && original.length > 2) {
        // Options are chained
        // For example: `ls -alP`
        return arr.concat(
          {
            original: '-',
            head,
            description: '',
            type: 'none',
            chain: true,
          },
          original.split('').slice(1).map((_original, index, arr) => {
            const _option = findOption(`-${_original}`, head.options!);
            const isLastOption = index >= arr.length - 1;
            if (_option) {
              return {
                original: _original,
                head,
                definition: Array.isArray(_option.name) ? _option.name.join(', ') : _option.name,
                description: _option.description || original,
                type: 'option',
                chain: !isLastOption,
              };
            } else {
              return {
                original: _original,
                head,
                description: 'Unknown',
                type: 'unknown',
                chain: !isLastOption,
              };
            }
          }),
        );
      } else if (original.slice(0, 2) === '--' && original.includes('=')) {
        // Option is in a "--a=b" format
        // For example: `git commit --message="hello world"
        const [originalOption, originalArgument] = original.split('=');
        const _option = findOption(originalOption, head.options);

        if (_option && _option.args) {
          const arg = Array.isArray(_option.args) ? _option.args[0] : _option.args;
          return arr.concat([{
            original: `${originalOption}=`,
            head,
            definition: Array.isArray(_option.name) ? _option.name.join(', ') : _option.name,
            description: _option.description || original,
            type: 'option',
            chain: true,
          }, {
            original: originalArgument,
            head,
            description: arg.description || arg.name || originalArgument,
            type: 'argument',
          }]);
        }
      }      
      const _option = findOption(original, head.options);
      if (_option) {
        if (_option.args) {
          isParsingArgs = true;
          head = _option;
        }

        return arr.concat([{
          original,
          head,
          definition: Array.isArray(_option.name) ? _option.name.join(', ') : _option.name,
          description: _option.description || original,
          type: 'option',
        }]);
      }
    }

    // If we determined to be parsing args in an earlier part, check if string is a valid argument
    if (head.args && isParsingArgs) {
      if (Array.isArray(head.args)) {
        const isVariadic = head.args.some(({ isVariadic }) => !!isVariadic)
        const arg = head.args[Math.min(head.args.length, args.length)];

        args.push(arg);

        if (args.length >= head.args.length && !isVariadic) {
          // The argument is not variadic and we have enough arguments - stop parsing new arguments on the next part
          isParsingArgs = false;
        }
        return arr.concat([{
          original,
          head,
          description: useStdin(original) ? 'Use stdin' : arg.description || arg.name || original,
          type: 'argument',
        }]);
      } else {
        args.push(head.args);
        if (!head.args.isVariadic) {
          // Do not check if the next part is an argument - it is not
          isParsingArgs = false;
        }
        return arr.concat([{
          original,
          head,
          description: useStdin(original) ? 'Use stdin' : head.args.description || head.args.name || original,
          type: 'argument',
        }]);
      }
    }

    return arr.concat([{
      original,
      head,
      description: 'Could not match part',
      type: 'unknown',
    }]);
  }, []);
}
