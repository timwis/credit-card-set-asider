# Credit Card Set Asider
Monitors daily credit card activity & sets aside a percentage of it in your
savings account, so it's there to pay your balance at the end of the month.

Currently it uses [NightmareJS](https://github.com/segmentio/nightmare) to fetch
transactions for the provided date from a Capital One Credit Card and transfers
the specified percentage from checking to savings within Capital One 360.

I'd add a screencap demo but I don't know how to blur/redact parts of a .gif.
[Do you know how?](https://github.com/timwis/credit-card-set-asider/issues/new)

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
