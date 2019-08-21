import internalDel from 'del';
import { Plugin } from 'rollup';

interface Options extends internalDel.Options {
    /**
     * Rollup hook the plugin should use.
     * @default 'buildStart'
     */
    readonly hook?: string;

    /**
     * Patterns of files and folders to be deleted.
     * @default []
     */
    readonly targets?: string | ReadonlyArray<string>;

    /**
     * Outputs removed files and folders to console.
     * @default false
     */
    readonly verbose?: boolean;
}

export default function del(options?: Options): Plugin;
