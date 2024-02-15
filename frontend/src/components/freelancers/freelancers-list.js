import { AuthUtils } from '../../utils/auth-utils';
import { HttpUtils } from '../../utils/http-utils';
import { Router } from '../../router';

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

        // this.showRecords(result.response.freelancers)
    }

    showRecords(freelancers) {
        console.log(freelancers);
    }
}