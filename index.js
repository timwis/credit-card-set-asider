const prompt = require('prompt')
const yargs = require('yargs')
const Nightmare = require('nightmare')
const isSameDay = require('date-fns/is_same_day')
const format = require('date-fns/format')

const config = require('./config')

const defaultDate = format(Date.now(), 'YYYY-MM-DD')

const argv = yargs
  .env('CC')
  .usage('$0 -u [username] -d [date] --from [account] --to [account] --percent [num]')
  .option('username', { alias: 'u', describe: 'Bank account username' })
  .option('password', { alias: 'p', describe: 'Bank account password (omit for prompt)' })
  .option('date', { alias: 'd', describe: 'Date of transactions (YYYY-MM-DD)' })
  .option('from', { alias: 'f', describe: 'Account to transfer from' })
  .option('to', { alias: 't', describe: 'Account to transfer to' })
  .option('percentage', { alias: 'percent', describe: 'Percentage to set aside', type: 'number' })
  .help()
  .argv

prompt.start()

const promptSchema = [
  { name: 'username', required: true },
  { name: 'password', required: true, hidden: true },
  { name: 'date', default: defaultDate },
  { name: 'from', required: true },
  { name: 'to', required: true },
  { name: 'percentage', default: 100, type: 'number' }
]

prompt.override = argv

prompt.get(promptSchema, (err, input) => {
  if (err) return console.error(err)

  const nightmare = Nightmare({ show: true })
  // First, login via bank site
  nightmare.goto(config.bank.login.url)
    .type(config.bank.login.usernameInput, input.username)
    .click(config.bank.login.usernameSubmitBtn)
    .wait(config.bank.login.passwordInput)
    .wait(1000)
    .type(config.bank.login.passwordInput, input.password)
    .click(config.bank.login.passwordSubmitBtn)
    .wait(config.bank.login.accountSummaryTable)

    // Naviagate to credit card site
    .goto(config.cc.url)
    .click(config.cc.transactionsLink)
    .wait(config.cc.transactionsContainer)
    .click(config.cc.pending.toggleLink)

    // Extract all transactions, posted and pending
    .evaluate((config, input) => {
      // Posted transactions
      const postedRowEls = Array.from(document.querySelectorAll(config.cc.posted.rows))
      const postedTransactions = postedRowEls.map((rowEl) => {
        const date = rowEl.querySelector(config.cc.posted.date).innerText
        const amount = parseCurrency(rowEl.querySelector(config.cc.posted.amount).innerText)
        const merchant = rowEl.querySelector(config.cc.posted.merchant).innerText
        return { date, amount, merchant }
      })

      // Pending transactions
      const pendingRowEls = Array.from(document.querySelectorAll(config.cc.pending.rows))
      const pendingTransactions = pendingRowEls.map((rowEl) => {
        const date = rowEl.querySelector(config.cc.pending.date).innerText
        const amount = parseCurrency(rowEl.querySelector(config.cc.pending.amount).innerText)
        const merchant = rowEl.querySelector(config.cc.pending.merchant).innerText
        return { date, amount, merchant }
      })

      const allTransactions = postedTransactions.concat(pendingTransactions)
      return allTransactions

      function parseCurrency (currency) {
        return Number(currency.replace(/[^0-9\.-]+/g, ''))
      }
    }, config, input)
    .then((transactions) => {
      const filteredTransactions = transactions.filter((transaction) => {
        return transaction.amount > 0 && isSameDay(transaction.date, input.date)
      })
      console.log(filteredTransactions)

      const totalSpent = filteredTransactions.reduce((accum, transaction) => accum + transaction.amount, 0).toFixed(2)
      console.log(`Total spent: ${totalSpent}`)

      const formattedDate = format(input.date, 'YYYY-MM-DD')

      if (totalSpent < 0) return

      const setAsideAmount = input.percentage !== 100
        ? ((input.percentage / 100) * totalSpent).toFixed(2)
        : totalSpent
      console.log(`Setting aside ${setAsideAmount}`)

      return nightmare.goto(config.bank.transfer.url)
        .type(config.bank.transfer.amount, setAsideAmount)
        .type(config.bank.transfer.memo, `CC spending ${formattedDate}`)
        .select(config.bank.transfer.fromAccount, input.from)
        .select(config.bank.transfer.toAccount, input.to)
        .click(config.bank.transfer.continueBtn)
        .wait(config.bank.transfer.validateForm)
        .click(config.bank.transfer.confirmBtn)
        .wait(3000)
        .end()
        .then()
    })
    .catch((err) => console.error('Failed', err))
})
