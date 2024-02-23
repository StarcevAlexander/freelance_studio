import config from '../../config/config';
import { AuthUtils } from '../../utils/auth-utils';
import { CommonUtils } from '../../utils/common-utils';
import { HttpUtils } from '../../utils/http-utils';

export class OrdersView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/')
        }
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }
        this.getOrder(id).then()
        document.getElementById('edit-link').href = '/orders/edit?id=' + id
        document.getElementById('delete-link').href = '/orders/delete?id=' + id
    }
    async getOrder(id) {
        const result = await HttpUtils.request('/orders/' + id)
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error)) {
            alert('возникла ошибка при запросе заказа. обратитесь в техподдержку')
            return
        }
        this.showOrder(result.response)
    }
    showOrder(order) {
        const statusInfo = CommonUtils.getStatusInfo(order.status)
        document.getElementById('order-status-icon').classList.add('fa-' + statusInfo.icon)
        document.getElementById('order-status').classList.add('bg-' + statusInfo.color)
        document.getElementById('order-status-value').innerText = statusInfo.name
        document.getElementById('schedult').innerText = order.scheduledDate ? (new Date(order.scheduledDate)).toLocaleDateString('ru-RU') : 'отстутствует';
        document.getElementById('complete').innerText = order.completeDate ? (new Date(order.completeDate)).toLocaleDateString('ru-RU') : 'отстутствует';
        document.getElementById('deadLine').innerText = order.deadlineDate ? (new Date(order.deadlineDate)).toLocaleDateString('ru-RU') : 'отстутствует';
        document.getElementById('freelancer-avatar').src = config.host + order.freelancer.avatar
        document.getElementById('freelancer-name').innerHTML = `<a href=/freelancers/view?id=${order.freelancer.id}>${order.freelancer.name} ${order.freelancer.lastName}</a>`
        document.getElementById('number').innerText = order.number
        document.getElementById('description').innerText = order.description
        document.getElementById('owner').innerHTML = `${order.owner.name} ${order.owner.lastName}`
        document.getElementById('amount').innerText = order.amount
        document.getElementById('created').innerText = order.createdAt ? (new Date(order.createdAt)).toLocaleString('ru-RU') : ''
    }
}
