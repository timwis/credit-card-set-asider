# Credit Card Set Asider [![stability: experimental][0]][1]
Monitors daily credit card activity & sets aside a percentage of it in your
savings account, so it's there to pay your balance at the end of the month.

Currently it fetches transactions for the provided date from Capital One
Credit Cards via the Capital One 360 login.

## Usage
```
node index.js -u [username] -d [date] --from [account] --to [account] --percent [num]

Options:
  --username, -u           Bank account username
  --password, -p           Bank account password (omit for prompt)
  --date, -d               Date of transactions (YYYY-MM-DD)
  --from, -f               Account to transfer from
  --to, -t                 Account to transfer to
  --percentage, --percent  Percentage to set aside                      [number]
  --help                   Show help                                   [boolean]
```
You can override any arguments using the environment variables in `.env.sample`.
Optionally, you can use [dotenv](https://www.npmjs.com/package/dotenv) to load
them from a file called `.env` using the following prefix:

```bash
node -r dotenv/config index.js
```

Any arguments omitted will be prompted (in case you don't want to save them in
your terminal command history). You can use any combination of environment
variables, command line arguments, and prompt responses.

## Installation
Download/clone this repository and install dependencies using `npm install`.

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
