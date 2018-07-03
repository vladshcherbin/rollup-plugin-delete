/* eslint-disable no-console */
import del from 'del'

export default function (options = {}) {
  const targets = options.targets || []
  const verbose = options.verbose || false

  return {
    name: 'delete',
    buildStart: () => del(targets).then((paths) => {
      if (verbose && paths.length > 0) {
        console.log('Deleted files and folders:')

        paths.forEach((path) => {
          console.log(path)
        })
      }
    })
  }
}
