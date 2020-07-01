# WinNodeJsBase

Base nodejs project for Windows with Typescript, VS Code debugging, etc.
NPM integration with scripts follows the blog post at
<https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c>

Included packages:

- chalk for output formatting (<https://www.npmjs.com/package/chalk>)
- commander for command line parsing (<https://www.npmjs.com/package/commander>)
- csv-parser for reading CSVs (<https://www.npmjs.com/package/csv-parser>)
- lodash for array manipulation (<https://www.npmjs.com/package/lodash>)
- glob for file name globbing (<https://www.npmjs.com/package/glob>)
- moment for date processing (<https://momentjs.com/>)

Included developer packages:

- markdownlint-cli
- prettier
- tslint
- tslint-config-prettier so prettier and tslint play nicely together
- typeScript

Included typings:

- commander
- lodash
- node
