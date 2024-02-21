import { FileUtils } from '../../utils/file-utils';
import { HttpUtils } from '../../utils/http-utils';

export class FreelancersCreate {
    constructor(openNewRoute) {
        bsCustomFileInput.init();
        this.openNewRoute = openNewRoute
        document.getElementById('saveButton').addEventListener('click', this.saveFrelancer.bind(this))
        this.nameInputElement = document.getElementById('nameInput')
        this.lastNameInputElement = document.getElementById('lastNameInput')
        this.emailInputElement = document.getElementById('emailInput')
        this.educationInputElement = document.getElementById('educationInput')
        this.locationInputElement = document.getElementById('locationInput')
        this.skillsInputElement = document.getElementById('skillsInput')
        this.infoInputElement = document.getElementById('infoInput')
        this.levelSelectElement = document.getElementById('levelSelect')
        this.avatarInputElement = document.getElementById('avatarInput')
    }
    async saveFrelancer(e) {
        e.preventDefault()

        if (this.validateForm()) {
            const createdData = {
                name: this.nameInputElement.value,
                lastName: this.lastNameInputElement.value,
                email: this.emailInputElement.value,
                level: this.levelSelectElement.value,
                education: this.educationInputElement.value,
                location: this.locationInputElement.value,
                skills: this.skillsInputElement.value,
                info: this.infoInputElement.value
            }
            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                createdData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0])
            }
            const result = await HttpUtils.request('/freelancers', 'POST', true, createdData)
            if (result.redirect) {
                return this.openNewRoute(result.redirect)
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                alert('возникла ошибка при создании фрилансера. обратитесь в техподдержку')
                return
            }
            return this.openNewRoute('/freelancers/view?id=' + result.response.id)
        }
    }

    validateForm() {
        let isValid = true
        let textInputArray = [this.nameInputElement, this.lastNameInputElement, this.educationInputElement, this.locationInputElement, this.skillsInputElement, this.infoInputElement]
        for (let index = 0; index < textInputArray.length; index++) {
            if (textInputArray[index].value) {
                textInputArray[index].classList.remove('is-invalid');
            }
            else {
                textInputArray[index].classList.add('is-invalid');
                isValid = false
            }
        }

        if (this.emailInputElement.value && this.emailInputElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailInputElement.classList.remove('is-invalid');
        }
        else {
            this.emailInputElement.classList.add('is-invalid');
            isValid = false
        }
        return isValid

    }
}
