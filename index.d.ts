import type { Options as DelOptions } from 'del';
import type { Plugin, AsyncPluginHooks } from 'rollup';

interface Options extends DelOptions {
    /**
     * Rollup hook the plugin should use.
     * @default 'buildStart'
     */
    readonly hook?: AsyncPluginHooks;

    /**
     * Delete items once. Useful in watch mode.
     * @default false
     */
    readonly runOnce?: boolean;

    /**
     * Patterns of files and folders to be deleted.
     * @default []
     */
    readonly targets?: string | readonly string[];

    /**
     * Outputs removed files and folders to console.
     * @default false
     */
    readonly verbose?: boolean;
}

export default function del(options?: Options): Plugin;
