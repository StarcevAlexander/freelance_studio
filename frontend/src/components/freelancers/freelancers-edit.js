import config from '../../config/config';
import { AuthUtils } from '../../utils/auth-utils';
import { CommonUtils } from '../../utils/common-utils';
import { FileUtils } from '../../utils/file-utils';
import { HttpUtils } from '../../utils/http-utils';
import { UrlUtils } from '../../utils/url-utils';
import { ValidationUtils } from '../../utils/validation-utils';

export class FreelancersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        const id = UrlUtils.getUrlParam('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }
        this.getFreelancer(id).then()

        this.findElements()

        this.validations = [
            { element: this.nameInputElement },
            { element: this.educationInputElement },
            { element: this.locationInputElement },
            { element: this.locationInputElement },
            { element: this.skillsInputElement },
            { element: this.infoInputElement },
            { element: this.emailInputElement, options: { pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ } }
        ]
        document.getElementById('updateButton').addEventListener('click', this.updateFrelancer.bind(this))
    }

    findElements() {
        this.avatarInputElement = document.getElementById('avatarInput')
        this.nameInputElement = document.getElementById('nameInput')
        this.lastNameInputElement = document.getElementById('lastNameInput')
        this.emailInputElement = document.getElementById('emailInput')
        this.educationInputElement = document.getElementById('educationInput')
        this.locationInputElement = document.getElementById('locationInput')
        this.skillsInputElement = document.getElementById('skillsInput')
        this.infoInputElement = document.getElementById('infoInput')
        this.levelSelectElement = document.getElementById('levelSelect')
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

    async updateFrelancer(e) {
        e.preventDefault()
        if (ValidationUtils.validateForm(this.validations)) {
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
