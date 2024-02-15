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
            return window.location.href = result.redirect
        }

        this.showRecords(result.response.freelancers)
    }

    showRecords(freelancers) {
        const recordsElemen = document.getElementById('records')
        for (let index = 0; index < freelancers.length; index++) {

            const trElement = document.createElement('tr')
            trElement.insertCell().innerText = index + 1
            trElement.insertCell().innerText = freelancers[index].avatar ? `<img src=${config.host} + ${freelancers[index].avatar} alt='user image"></img>` : ''
            trElement.insertCell().innerText = `${freelancers[index].name} ${freelancers[index].lastNme}`


        }
        console.log(freelancers);
    }
}

