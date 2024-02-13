import { AuthUtils } from '../utils/auth-utils'

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return window.location.href = '/'
            // return this.openNewRoute('/')
        }

        this.nameElement = document.getElementById('name')
        this.lastNameElement = document.getElementById('lastName')
        this.emailElement = document.getElementById('email')
        this.passwordElement = document.getElementById('password')
        this.passwordRepeatElement = document.getElementById('password-repeat')
        this.agreeElement = document.getElementById('agree')
        this.commonErrorElement = document.getElementById('common-error')
        document.getElementById('process-button').addEventListener('click', this.signup.bind(this))
    }

    validateForm() {
        let isValid = true

        if (this.nameElement.value) {
            this.nameElement.classList.remove('is-invalid');
        }
        else {
            this.nameElement.classList.add('is-invalid');
            isValid = false
        }

        if (this.lastNameElement.value) {
            this.lastNameElement.classList.remove('is-invalid');
        }

        else {
            this.lastNameElement.classList.add('is-invalid');
            isValid = false
        }

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

        if (this.passwordRepeatElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        }
        else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false
        }

        if (this.passwordElement.value && this.passwordRepeatElement.value && this.passwordElement.value === this.passwordRepeatElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
            this.passwordElement.classList.remove('is-invalid');
        }
        else {
            this.passwordElement.classList.add('is-invalid');
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false
        }

        if (this.agreeElement.checked) {
            this.agreeElement.parentElement.style.border = "";
        }
        else {
            this.agreeElement.parentElement.style.border = "1px solid red";
            isValid = false
        }
        return isValid
    }


    async signup() {
        this.commonErrorElement.style.display = 'none'
        if (this.validateForm()) {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify({
                    name: this.nameElement.value,
                    lastName: this.lastNameElement.value,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                }),
                redirect: 'follow'
            };

            await fetch("http://localhost:3000/api/signup", requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.error || !result.accessToken || !result.refreshToken || !result.id || !result.name) {
                        this.commonErrorElement.style.display = 'block'
                        console.log(error);
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