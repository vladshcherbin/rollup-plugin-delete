import { deleteAsync, type Options as DelOptions } from 'del'
import type { AsyncPluginHooks, Plugin } from 'rollup'

export interface Options extends DelOptions {
  /**
   * Rollup hook the plugin should use.
   * @default 'buildStart'
   * end
   */
  readonly hook?: AsyncPluginHooks

  /**
   * Delete items once. Useful in watch mode.
   * @default false
   */
  readonly runOnce?: boolean

  /**
   * Patterns of files and folders to be deleted.
   * @default []
   *
   * ```js
   * // Folder
   * del({ targets: 'build' })
   * // File
   * del({ targets: 'dist/app.js' })
   * // Multiple files
   * del({ targets: 'build/*.js' })
   * // Mixed
   * del({ targets: ['dist/*', 'images/*.webp'] })
   * ```
   */
  readonly targets?: readonly string[] | string

  /**
   * Outputs removed files and folders to console.
   * @default false
   */
  readonly verbose?: boolean
}

export default function del(options: Options = {}): Plugin {
  const {
    hook = 'buildStart',
    runOnce = false,
    targets = [],
    verbose = false,
    ...delOptions
  } = options

  let deleted = false

  return {
    name: 'delete',
    // eslint-disable-next-line perfectionist/sort-objects
    [hook]: async () => {
      if (runOnce && deleted) {
        return
      }

      const paths = await deleteAsync(targets, delOptions)

      if (verbose || delOptions.dryRun) {
        const message = delOptions.dryRun
          ? `Expected files and folders to be deleted: ${paths.length}`
          : `Deleted files and folders: ${paths.length}`

        console.log(message)

        if (paths.length) {
          paths.forEach((path) => {
            console.log(path)
          })
        }
      }

      // eslint-disable-next-line require-atomic-updates
      deleted = true
    }
  }
}
