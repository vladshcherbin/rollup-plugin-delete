/* eslint-disable no-console */
import internalDel from 'del'

export default function del(options = { targets: [], verbose: false }) {
  const { targets, verbose, ...rest } = options

  return {
    name: 'delete',
    buildStart: () => internalDel(targets, rest).then((paths) => {
      if (verbose || (rest.dryRun && verbose !== false)) {
        const message = rest.dryRun
          ? `Expected files and folders to be deleted: ${paths.length}`
          : `Deleted files and folders: ${paths.length}`

        console.log(message)

        if (paths.length > 0) {
          paths.forEach((path) => {
            console.log(path)
          })
        }
      }
    })
  }
}
