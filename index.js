const prompt = require('prompt')
const Nightmare = require('nightmare')
const isSameDay = require('date-fns/is_same_day')
const format = require('date-fns/format')

const config = {
  bank: {
    login: {
      url: 'https://secure.capitalone360.com/myaccount/banking/login.vm',
      usernameInput: 'form#Signin [name="publicUserId"]',
      usernameSubmitBtn: '#btn_continue',
      passwordForm: '#PasswordForm',
      passwordInput: '[name="currentPassword_TLNPI"]',
      passwordSubmitBtn: '#PasswordForm a.ada-new-win',
      accountSummaryTable: '#deposittable'
    },
    transfer: {
      url: 'https://secure.capitalone360.com/myaccount/banking/deposit_transfer_input.vm',
      amount: '#amount',
      memo: '#depositTransferMemo',
      fromAccount: '#sourceAccountNumber',
      toAccount: '#destinationAccountNumber'
    }
  },
  cc: {
    url: 'https://services2.capitalone.com/accounts',
    transactionsLink: '#transactionsLink0',
    transactionsContainer: '#transactionsBricklet',
    posted: {
      table: '#postedTransactionTable',
      rows: '#postedTransactionTable .transaction',
      date: '.date span',
      amount: '.amount',
      merchant: '.merchant span'
    },
    pending: {
      toggleLink: '.pending-toggle',
      rows: '#pendingTransactionTable .tr.pending',
      date: '.date',
      amount: '.amount',
      merchant: '.merchant'
    }
  }
}

prompt.start()

const promptConfig = [
  { name: 'username', required: true },
  { name: 'password', required: true, hidden: true },
  { name: 'date', default: format(Date.now(), 'YYYY-MM-DD') }
]

if (process.argv.length > 1) {
  prompt.override = { date: process.argv[2] }
}

prompt.get(promptConfig, (err, input) => {
  if (err) return console.error(err)

  Nightmare({ show: true })
    .goto(config.bank.login.url)
    .type(config.bank.login.usernameInput, input.username)
    .click(config.bank.login.usernameSubmitBtn)
    .wait(config.bank.login.passwordForm)
    .wait(1000)
    .type(config.bank.login.passwordInput, input.password)
    .click(config.bank.login.passwordSubmitBtn)
    .wait(config.bank.login.accountSummaryTable)
    // .evaluate((config) => {
    //   return document.querySelector(config.bank.accountSummaryTable).innerText
    // }, config)
    .goto(config.cc.url)
    .click(config.cc.transactionsLink)
    .wait(config.cc.transactionsContainer)
    .click(config.cc.pending.toggleLink)
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
    .end()
    .then((transactions) => {
      const filteredTransactions = transactions.filter((transaction) => {
        return transaction.amount > 0 && isSameDay(transaction.date, input.date)
      })
      console.log(filteredTransactions)

      const total = filteredTransactions.reduce((accum, transaction) => accum + transaction.amount, 0)
      console.log('total', total)
    })
    .catch((err) => console.error('Failed', err))
})
