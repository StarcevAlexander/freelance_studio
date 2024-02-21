import config from '../../config/config';
import { CommonUtils } from '../../utils/common-utils';
import { FileUtils } from '../../utils/file-utils';
import { HttpUtils } from '../../utils/http-utils';

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/')
        }
        this.getFreelancer(id).then()

        this.avatarInputElement = document.getElementById('avatarInput')
        this.nameInputElement = document.getElementById('nameInput')
        this.lastNameInputElement = document.getElementById('lastNameInput')
        this.emailInputElement = document.getElementById('emailInput')
        this.educationInputElement = document.getElementById('educationInput')
        this.locationInputElement = document.getElementById('locationInput')
        this.skillsInputElement = document.getElementById('skillsInput')
        this.infoInputElement = document.getElementById('infoInput')
        this.levelSelectElement = document.getElementById('levelSelect')
        this.openNewRoute = openNewRoute
        document.getElementById('updateButton').addEventListener('click', this.updateFrelancer.bind(this))
    }
    async getFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id)
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            alert('возникла ошибка при запросе фрилансера. обратитесь в техподдержку')
            return
        }
        this.freelancerOriginalData = result.response
        this.showFreelancer(result.response)
    }

    showFreelancer(freelancer) {
        let breadCrumbsFreelancerElement = document.getElementById('breadcrumbs-freelancer')
        breadCrumbsFreelancerElement.href = '/freelancers/view?id=' + freelancer.id
        breadCrumbsFreelancerElement.innerText = `${freelancer.name} ${freelancer.lastName}`
        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar
        }
        document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level)

        this.nameInputElement.value = freelancer.name
        this.lastNameInputElement.value = freelancer.lastName
        this.emailInputElement.value = freelancer.email
        this.educationInputElement.value = freelancer.education
        this.locationInputElement.value = freelancer.location
        this.skillsInputElement.value = freelancer.skills
        this.infoInputElement.value = freelancer.info
        for (let index = 0; index < this.levelSelectElement.options.length; index++) {
            if (this.levelSelectElement.options[index].value === freelancer.level) {
                this.levelSelectElement.selectedIndex = index

            }
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

    async updateFrelancer(e) {
        e.preventDefault()
        if (this.validateForm()) {
            const changedData = {}
            if (this.nameInputElement.value !== this.freelancerOriginalData.name) {
                changedData.name = this.nameInputElement.value
            }
            if (this.lastNameInputElement.value !== this.freelancerOriginalData.lastName) {
                changedData.lastName = this.lastNameInputElement.value
            }
            if (this.emailInputElement.value !== this.freelancerOriginalData.email) {
                changedData.email = this.emailInputElement.value
            }
            if (this.educationInputElement.value !== this.freelancerOriginalData.education) {
                changedData.education = this.educationInputElement.value
            }
            if (this.locationInputElement.value !== this.freelancerOriginalData.location) {
                changedData.location = this.locationInputElement.value
            }
            if (this.skillsInputElement.value !== this.freelancerOriginalData.skills) {
                changedData.skills = this.skillsInputElement.value
            }
            if (this.infoInputElement.value !== this.freelancerOriginalData.info) {
                changedData.info = this.infoInputElement.value
            }
            if (this.levelSelectElement.value !== this.freelancerOriginalData.level) {
                changedData.level = this.levelSelectElement.value
            }
            if (this.avatarInputElement.files && this.avatarInputElement.files.length > 0) {
                changedData.avatarBase64 = await FileUtils.convertFileToBase64(this.avatarInputElement.files[0])
            }
            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/freelancers/' + this.freelancerOriginalData.id, 'PUT', true, changedData)
                if (result.redirect) {
                    return this.openNewRoute(result.redirect)
                }
                if (result.error || !result.response || (result.response && result.response.error)) {
                    alert('возникла ошибка при обновлении фрилансера. обратитесь в техподдержку')
                    return
                }
                return this.openNewRoute('/freelancers/view?id=' + this.freelancerOriginalData.id)
            }

        }
    }
}
