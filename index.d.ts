export default function({ targets, verbose, ...rest }: {
  targets: any[],
  verbose?: boolean,
  dryRun?: boolean,
  force?: boolean,
  concurrency?: number
}): void;