/* eslint-disable no-console */
import internalDel from 'del'

export default function del(options = {}) {
  const {
    hook = 'buildStart',
    targets = [],
    verbose = false,
    ...rest
  } = options

  return {
    name: 'delete',
    [hook]: () => internalDel(targets, rest).then((paths) => {
      if (verbose || rest.dryRun) {
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
