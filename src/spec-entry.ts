const path = require("path");

interface WpContext {
    (resource: any): void;
    keys: () => any[];
}

interface WpRequire extends NodeRequire {
    context: (path: string, recursive: boolean, pattern: RegExp) => WpContext;
}

const testContext = (require as WpRequire).context(__dirname, true, /.spec.ts$/);

testContext.keys().map(testContext);