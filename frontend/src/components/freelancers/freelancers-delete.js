import { HttpUtils } from '../../utils/http-utils';
import { UrlUtils } from '../../utils/url-utils';

export class FreelancersDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        const id = UrlUtils.getUrlParam('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        this.deleteFreelancer(id).then()
    }
    async deleteFreelancer(id) {
        const result = await HttpUtils.request('/freelancers/' + id, 'DELETE', true)
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            alert('возникла ошибка при удалении фрилансера. обратитесь в техподдержку')
            return this.openNewRoute('/freelancers')
        }
        return this.openNewRoute('/freelancers')
    }
}
