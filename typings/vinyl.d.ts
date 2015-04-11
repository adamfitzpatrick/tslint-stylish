declare module Vinyl {
    export interface File {
        path: string;
        cwd: string;
        base: string;
    }
}