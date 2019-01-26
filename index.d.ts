/**
 * @example
 * del({ targets: ['dist/*'] })
 * del({ targets: ['dist/*'], verbose: true })
 * del({ targets: ['../dist/*'], force: true })
 * del({ targets: ['dist/*'], dryRun: true })
 * del({ targets: ['dist/*'], concurrency: 4 })
 */
import { Plugin } from 'rollup'
import { IOptions } from 'glob'
export default function({ targets, verbose, dryRun, force, concurrency, ...rest }: {
  targets: string | string[];
  verbose?: boolean;
  dryRun?: boolean;
  force?: boolean;
  concurrency?: number;
  rest: IOptions;
}): Plugin;
