# Tech Debt items

- [ ] Typescript issues
- [ ] Fix env variables
- [ ] CSRF?
- [ ] Add email verification
- [ ] On useResetPasswordMutation, change the redirectTo to a environment dependant value instead of a hardcoded value.
- [ ] On ResetPasswordPage, add a toast to show the user that the password has been reset and they need to check their email (a message is coming from the backend, we can use that one).
- [ ] On the login form, the TAB navigation is weird, it jumps from email to forgot password and then to password. It should be email -> password -> submit -> forgot password -> register.
