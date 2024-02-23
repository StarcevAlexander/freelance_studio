import config from '../../config/config';
import { CommonUtils } from '../../utils/common-utils';
import { HttpUtils } from '../../utils/http-utils';
import { UrlUtils } from '../../utils/url-utils';

export class FreelancersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        const id = UrlUtils.getUrlParam('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        this.getFreelancer(id).then()
        document.getElementById('edit-link').href = '/freelancers/edit?id=' + id
        document.getElementById('delete-link').href = '/freelancers/delete?id=' + id
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
        this.showFreelancer(result.response)
    }
    showFreelancer(freelancer) {
        if (freelancer.avatar) {
            document.getElementById('avatar').src = config.host + freelancer.avatar
        }
        if (freelancer.name) {
            document.getElementById('name').innerText = `${freelancer.name} ${freelancer.lastName}`
        }
        if (freelancer.level) {
            document.getElementById('level').innerHTML = CommonUtils.getLevelHtml(freelancer.level)
        }
        if (freelancer.email) {
            document.getElementById('email').innerText = freelancer.email
        }
        if (freelancer.education) {
            document.getElementById('education').innerText = freelancer.education
        }
        if (freelancer.location) {
            document.getElementById('location').innerText = freelancer.location
        }
        if (freelancer.skills) {
            document.getElementById('skills').innerText = freelancer.skills
        }
        if (freelancer.info) {
            document.getElementById('info').innerText = freelancer.info
        }
        if (freelancer.createdAt) {
            const date = new Date(freelancer.createdAt)
            document.getElementById('created').innerText = date.toLocaleString('ru-RU');
        }
    }
}
