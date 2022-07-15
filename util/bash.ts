/**
 * Split the cmd into separate components
 * @param {string} str A cmd
 * @returns
 */
export function split(str: string): Array<string> {
  return (
    str.trim().match(/\\?.|^$/g)?.reduce(
      (record, current) => {
        if (!record.doubleQuote && !record.singleQuote && current === ' ') {
          record.accumulator.push('');
        } else {
          if (current === '"') {
            record.doubleQuote ^= 1;
          } else if (current === "'") {
            record.singleQuote ^= 1;
          }
          record.accumulator[record.accumulator.length - 1] += current.replace(
            /\\(.)/,
            '$1',
          );
        }
        return record;
      },
      { accumulator: [''] } as {
        accumulator: Array<string>;
        doubleQuote: number;
        singleQuote: number;
      },
    ).accumulator || []
  );
}

/**
 * Extract the command (or binary) being triggered, give the full cmd
 * @param {string} str A cmd
 * @returns {string}
 */
export function command(str: string): string {
  return (str.split(' ').shift() as string).split('/').pop() as string;
}
