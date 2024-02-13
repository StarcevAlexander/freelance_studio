import { AuthUtils } from '../utils/auth-utils'

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return window.location.href = '/'
            // return this.openNewRoute('/')
        }

        this.emailElement = document.getElementById('email')
        this.passwordElement = document.getElementById('password')
        this.rememberMeElement = document.getElementById('remember-me')
        this.commonErrorElement = document.getElementById('common-error')
        document.getElementById('process-button').addEventListener('click', this.login.bind(this))
    }
    validateForm() {
        let isValid = true
        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        }
        else {
            this.emailElement.classList.add('is-invalid');
            isValid = false
        }

        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        }
        else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false
        }
        return isValid
    }

    async login() {
        this.commonErrorElement.style.display = 'none'
        if (this.validateForm()) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked
                }),
                redirect: 'follow'
            };

            await fetch("http://localhost:3000/api/login", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.error || !result.accessToken || !result.refreshToken || !result.id || !result.name) {
                        this.commonErrorElement.style.display = 'block'
                        return
                    }
                    AuthUtils.saveAuthInfo(result.accessToken, result.refreshToken, { id: result.id, name: result.name })
                    window.location.href = '/'
                    // this.openNewRoute('/')
                }
                )
                .catch(error => console.log('error', error));
        }
    }
}