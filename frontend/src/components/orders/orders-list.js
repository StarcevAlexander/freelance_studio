import { AuthUtils } from '../../utils/auth-utils'
import { CommonUtils } from '../../utils/common-utils'
import { HttpUtils } from '../../utils/http-utils'

export class OrdersList {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }
        this.getOrderers().then()
    }

    async getOrderers() {
        const result = await HttpUtils.request('/orders')
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error || !result.response.orders)) {
            alert('возникла ошибка при запросе заказов. обратитесь в поддержку')
        }

        this.showRecords(result.response.orders)
    }

    showRecords(orders) {
        const recordsElement = document.getElementById('records')
        for (let index = 0; index < orders.length; index++) {
            const statusInfo = CommonUtils.getStatusInfo(orders[index].status)

            const trElement = document.createElement('tr')
            trElement.insertCell().innerText = orders[index].number
            trElement.insertCell().innerText = `${orders[index].owner.name} ${orders[index].owner.lastName}`
            trElement.insertCell().innerHTML = `<a href="/freelancers/view?id=${orders[index].freelancer.id}">${orders[index].freelancer.name} ${orders[index].freelancer.lastName}</a>`
            trElement.insertCell().innerText = (new Date(orders[index].scheduledDate)).toLocaleString('ru-RU')
            trElement.insertCell().innerText = (new Date(orders[index].deadlineDate)).toLocaleString('ru-RU')
            trElement.insertCell().innerHTML = `<span class="p-2 badge badge-${statusInfo.color}">${statusInfo.name}</span>`
            trElement.insertCell().innerText = orders[index].completeDate ? (new Date(orders[index].completeDate)).toLocaleString('ru-RU') : ''
            trElement.insertCell().innerHTML = `<div class ="orders-tools"><a href='/orders/view?id=${orders[index].id}' class='fas fa-eye'></a ><a href='/orders/edit?id=${orders[index].id}' class='fas fa-edit'></a ><a href='/orders/delete?id=${orders[index].id}' class='fas fa-trash'></a ></div>`
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
