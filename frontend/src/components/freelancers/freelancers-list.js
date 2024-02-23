import config from '../../config/config';
import { AuthUtils } from '../../utils/auth-utils';
import { CommonUtils } from '../../utils/common-utils';
import { HttpUtils } from '../../utils/http-utils';

export class FreelancersList {
    constructor() {
        this.getFreelancers().then()
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }
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
            trElement.insertCell().innerHTML = CommonUtils.getLevelHtml(freelancers[index].level)
            trElement.insertCell().innerText = freelancers[index].education
            trElement.insertCell().innerText = freelancers[index].location
            trElement.insertCell().innerText = freelancers[index].skills
            trElement.insertCell().innerHTML = '<div class ="freelancer-tools">' + `<a href='/freelancers/view?id=${freelancers[index].id} ' class='fas fa-eye'></a >` + `<a href='/freelancers/edit?id=${freelancers[index].id}' class='fas fa-edit'></a >` + `<a href='/freelancers/delete?id=${freelancers[index].id}' class='fas fa-trash'></a >` + '</div>'
            recordsElement.appendChild(trElement)
        }

        new DataTable('#data-table', {
            language: {
                'lengthMenu': 'Показывать  _MENU_ записей на странице',
                "search": "Фильтр:",
                "info": "Страница _PAGE_ из _PAGES_",
                "paginate": {
                    "next": "Вперёд",
                    "previous": "Назад"
                },
            }
        })
    }
}
