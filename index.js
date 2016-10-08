const prompt = require('prompt')
const Nightmare = require('nightmare')

const config = {
  login: 'https://secure.capitalone360.com/myaccount/banking/login.vm',
  usernameInput: 'form#Signin [name="publicUserId"]',
  usernameSubmitBtn: '#btn_continue',
  passwordForm: 'form#PasswordForm',
  passwordInput: 'form#PasswordForm [name="currentPassword_TLNPI"]',
  passwordSubmitBtn: '#PasswordForm a.ada-new-win',
  accountSummaryTable: '#deposittable'
}

prompt.start()

const promptConfig = [
  { name: 'username', required: true },
  { name: 'password', required: true, hidden: true }
]

prompt.get(promptConfig, (err, user) => {
  if (err) return console.error(err)

  Nightmare({ show: true })
    .goto(config.login)
    .type(config.usernameInput, user.username)
    .click(config.usernameSubmitBtn)
    .wait(config.passwordForm)
    .type(config.passwordInput, user.password)
    .click(config.passwordSubmitBtn)
    .wait(config.accountSummaryTable)
    .evaluate((config) => {
      return document.querySelector(config.accountSummaryTable).innerText
    }, config)
    .end()
    .then((result) => console.log(result))
    .catch((err) => console.error('Failed', err))
})
