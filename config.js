module.exports = {
  bank: {
    login: {
      url: 'https://secure.capitalone360.com/myaccount/banking/login.vm',
      usernameInput: 'form#Signin [name="publicUserId"]',
      usernameSubmitBtn: '#btn_continue',
      passwordInput: '[name="currentPassword_TLNPI"]',
      passwordSubmitBtn: '#PasswordForm a.ada-new-win',
      accountSummaryTable: '#deposittable'
    },
    transfer: {
      url: 'https://secure.capitalone360.com/myaccount/banking/deposit_transfer_input.vm',
      amount: '#amount',
      memo: '#depositTransferMemo',
      fromAccount: '#sourceAccountNumber',
      toAccount: '#destinationAccountNumber',
      continueBtn: '#continueButton',
      validateForm: '#depositTransferValidateForm',
      confirmBtn: '#submitButton'
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
