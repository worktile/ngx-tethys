// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

// tslint:disable

declare const System: any;
declare const ENV: string;
// google code-prettify
declare const PR: any;

declare module jasmine {
    interface Matchers<T> {
        toHaveCssClass(expected: any): boolean;
    }
}

declare const mermaid: any;
declare const liteMarked: any;
declare const $: any;
declare const katex: any;

export declare interface Dictionary<T> {
    [key: string]: T;
}

export declare interface NumericDictionary<T> {
    [index: number]: T;
}

export declare interface Id {
    toString(): string;
}