import config from '../../config/config';
import { HttpUtils } from '../../utils/http-utils';

export class FreelancersList {
    constructor() {
        this.getFreelancers().then()
    }

    async getFreelancers() {
        const result = await HttpUtils.request('/freelancers')
        if (result.error || !result.response || (result.response && result.response.error || !result.response.freelancers)) {
            alert('возникла ошибка при запросе фрилансеров')
        }
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }

        this.showRecords(result.response.freelancers)
    }

    showRecords(freelancers) {
        const recordsElement = document.getElementById('records')
        for (let index = 0; index < freelancers.length; index++) {
            const trElement = document.createElement('tr')
            trElement.insertCell().innerText = index + 1
            trElement.insertCell().innerHTML = freelancers[index].avatar ? `<img class='freelancer-avatar' src='${config.host}${freelancers[index].avatar}' alt="user image">` : ''
            trElement.insertCell().innerText = `${freelancers[index].name} ${freelancers[index].lastName}`
            trElement.insertCell().innerText = freelancers[index].email
            let levelHtml = null
            switch (freelancers[index].level) {
                case config.freelancerLevels.junior:
                    levelHtml = '<span class ="badge badge-info">Junior</span>'
                    break;
                case config.freelancerLevels.middle:
                    levelHtml = '<span class ="badge badge-warning">Middle</span>'
                    break;
                case config.freelancerLevels.senior:
                    levelHtml = '<span class ="badge badge-success">Senior</span>'
                    break;
                default:
                    levelHtml = '<span class ="badge badge-secondary">Unknown</span>'
                    break;
            }
            trElement.insertCell().innerHTML = levelHtml
            trElement.insertCell().innerText = freelancers[index].education
            trElement.insertCell().innerText = freelancers[index].location
            trElement.insertCell().innerText = freelancers[index].skills
            trElement.insertCell().innerHTML = '<div class ="freelancer-tools">' + `<a href='/freelancers/view?id=${freelancers[index].id} ' class='fas fa-eye'></a >` + `<a href='/freelancers/edit?id=${freelancers[index].id} ' class='fas fa-edit'></a >` + `<a href='/freelancers/delete?id=${freelancers[index].id}' class='fas fa-trash'></a >` + '</div>'
            recordsElement.appendChild(trElement)
        }
    }
}
