## Installation

```
npm install
npm test
npm run-script run
```

The project is divided into three main files:

* `parser.ts` which handles parsing logic of english-like statments into javascript
objects.
* `services.ts` which interprets the javascript objects and run business logic
* `index.ts` which acts like a REPL, takes one command and runs through the parser
and executes the command

I've purposefully at the moment not included the code for hosting a bot on IRC to
keep code simple and focus on managing the transactions. Therefore, input is provided
via the file `input.txt`. Let me know if the bot on IRC is a hard requirement, I will
modify the code accordingly.

The file `input.txt` contains all that chat lines that a real bot would receive. The
file is fed to `index.ts` which parses each line via `parser.ts`. After parsing a line,
the output is fed to `services.ts` which populates in-memory javascript array. Again,
the decision to use in-memory javascript array over a full-fledged database is to keep
things simple and focus on the problem rather than getting bogged down with installation.
