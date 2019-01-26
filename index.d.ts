/**
 * @example
 * del({ targets: ['dist/*'] })
 * del({ targets: ['dist/*'], verbose: true })
 * del({ targets: ['../dist/*'], force: true })
 * del({ targets: ['dist/*'], dryRun: true })
 * del({ targets: ['dist/*'], concurrency: 4 })
 */
export default function({ targets, verbose, ...rest }: {
  targets: any[],
  verbose?: boolean,
  dryRun?: boolean,
  force?: boolean,
  concurrency?: number
}): void;