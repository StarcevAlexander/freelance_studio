import config from '../config/config';
import { AuthUtils } from '../utils/auth-utils';
import { HttpUtils } from '../utils/http-utils';

export class Dashboard {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            return this.openNewRoute('/login')
        }
        this.getOrders().then()
    }

    async getOrders() {
        const result = await HttpUtils.request('/orders')
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error || !result.response.orders)) {
            alert('возникла ошибка при запросе заказов. обратитесь в поддержку')
        }
        this.loadOrdersInfo(result.response.orders)
        this.loadCalendarInfo(result.response.orders)
    }
    loadOrdersInfo(orders) {
        document.getElementById("count-orders").innerText = orders.length
        document.getElementById("done-orders").innerText = orders.filter(order => order.status === config.orderStatuses.success).length;
        document.getElementById("in-progress-orders").innerText = orders.filter(order => [config.orderStatuses.confirmed, config.orderStatuses.new].includes(order.status)).length
        document.getElementById("cancelled-orders").innerText = orders.filter(order => order.status === config.orderStatuses.canceled).length
    }

    loadCalendarInfo(orders) {
        const preparedEvents = []
        for (let index = 0; index < orders.length; index++) {
            let color = null
            if (orders[index].status === config.orderStatuses.success) {
                color = 'grey'
            }
            if (orders[index].scheduledDate) {
                preparedEvents.push({
                    title: `${orders[index].freelancer.name} ${orders[index].freelancer.lastName} выполняет заказ ${orders[index].number}`,
                    start: new Date(orders[index].scheduledDate),
                    backgroundColor: color ? color : '#00c0ef',
                    borderColor: color ? color : '#00c0ef',
                    allDay: true
                })
            }
            if (orders[index].completeDate) {
                preparedEvents.push({
                    title: `Заказ ${orders[index].number} выполнен фрилансером ${orders[index].freelancer.name}`,
                    start: new Date(orders[index].completeDate),
                    backgroundColor: color ? color : '#00a65a',
                    borderColor: color ? color : '#00a65a',
                    allDay: true
                })
            }
            if (orders[index].deadlineDate) {
                preparedEvents.push({
                    title: `Дедлайн заказа ${orders[index].number}`,
                    start: new Date(orders[index].deadlineDate),
                    backgroundColor: color ? color : '#f39c12',
                    borderColor: color ? color : '#f39c12',
                    allDay: true
                })
            }
        }
        const calendarElement = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarElement, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            firstDay: 1,
            locale: 'ru',
            themeSystem: 'bootstrap',
            events: preparedEvents
        });
        calendar.render();
    }
}