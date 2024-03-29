import { AuthUtils } from '../../utils/auth-utils';
import { HttpUtils } from '../../utils/http-utils';
import { UrlUtils } from '../../utils/url-utils';
import { ValidationUtils } from '../../utils/validation-utils';

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }
        const id = UrlUtils.getUrlParam('id')
        if (!id) {
            return this.openNewRoute('/')
        }
        this.init(id).then()
        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this))
        this.scheduledDate = null
        this.completeDate = null
        this.deadlineDate = null

        this.findElements()

        this.validations = [
            { element: this.amountInputElement },
            { element: this.descriptionInputElement },
            { element: this.scheduledCardElement, options: { checkProperty: this.scheduledCardElement } },
            { element: this.deadlineCardElement, options: { checkProperty: this.deadlineCardElement } },
        ]
    }

    findElements() {
        this.freelancerSelectElement = document.getElementById('freelancerSelect')
        this.amountInputElement = document.getElementById('amountInput')
        this.descriptionInputElement = document.getElementById('descriptionInput')
        this.statusSelectElement = document.getElementById('statusSelect')
        this.scheduledCardElement = document.getElementById('scheduled-card')
        this.completeCardElement = document.getElementById('complete-card')
        this.deadlineCardElement = document.getElementById('deadline-card')
    }

    async init(id) {
        const orderData = await this.getOrder(id)
        if (orderData) {
            this.showOrder(orderData)
            if (orderData.freelancer) {
                await this.getFreelancers(orderData.freelancer.id)
            }
        }
    }

    async getFreelancers(currentFreelancerId) {
        const result = await HttpUtils.request('/freelancers')
        if (result.redirect) {
            return this.openNewRoute(result.redirect)
        }
        if (result.error || !result.response || (result.response && result.response.error || !result.response.freelancers)) {
            alert('возникла ошибка при запросе фрилансеров')
        }

        const freelancers = result.response.freelancers
        for (let index = 0; index < freelancers.length; index++) {
            const option = document.createElement('option')
            option.value = freelancers[index].id
            option.innerText = `${freelancers[index].name} ${freelancers[index].lastName}`
            if (currentFreelancerId === freelancers[index].id) {
                option.selected = true
            }
            this.freelancerSelectElement.appendChild(option)
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        })
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
        this.orderOriginalData = result.response
        return result.response
    }

    showOrder(order) {
        let breadCrumbsFreelancerElement = document.getElementById('breadcrumbs-order')
        breadCrumbsFreelancerElement.href = '/orders/view?id=' + order.id
        breadCrumbsFreelancerElement.innerText = order.number

        this.amountInputElement.value = order.amount
        this.descriptionInputElement.value = order.description

        for (let index = 0; index < this.statusSelectElement.options.length; index++) {
            if (this.statusSelectElement.options[index].value === order.status) {
                this.statusSelectElement.selectedIndex = index
            }
        }

        const calendarScheduled = $('#calendar-scheduled')
        const calendarComplete = $('#calendar-complete')
        const calendarDeadline = $('#calendar-deadline')


        const calendarOptions = {
            locale: 'ru',
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false,
            buttons: {
                showClear: true
            }
        }
        calendarScheduled.datetimepicker(Object.assign({}, calendarOptions, { date: order.scheduledDate }))
        calendarComplete.datetimepicker(Object.assign({}, calendarOptions, { date: order.completeDate ? order.completeDate : "" }))
        calendarDeadline.datetimepicker(Object.assign({}, calendarOptions, { date: order.deadlineDate }))

        calendarScheduled.on("change.datetimepicker", (e) => {
            if (e.date) {
                this.scheduledDate = e.date
            }
            else if (
                this.orderOriginalData.scheduledDate
            ) {
                this.scheduledDate = false
            }
            else this.scheduledDate = null
        })
        calendarComplete.on("change.datetimepicker", (e) => {
            if (e.date) {
                this.completeDate = e.date
            }
            else if (
                this.orderOriginalData.completeDate
            ) {
                this.completeDate = false
            }
            else this.completeDate = null
        })
        calendarDeadline.on("change.datetimepicker", (e) => {
            if (e.date) {
                this.deadlineDate = e.date
            }
            else if (
                this.orderOriginalData.deadlineDate
            ) {
                this.deadlineDate = false
            }
            else this.deadlineDate = null
        })
    }

    async updateOrder(e) {
        e.preventDefault()
        if (ValidationUtils.validateForm(this.validations)) {
            const changedData = {}
            if (this.amountInputElement.value != this.orderOriginalData.amount) {
                changedData.amount = this.amountInputElement.value
            }
            if (this.descriptionInputElement.value !== this.orderOriginalData.description) {
                changedData.description = this.descriptionInputElement.value
            }
            if (this.statusSelectElement.value !== this.orderOriginalData.status) {
                changedData.status = this.statusSelectElement.value
            }
            if (this.freelancerSelectElement.value !== this.orderOriginalData.freelancer.id) {
                changedData.freelancer = this.freelancerSelectElement.value
            }

            if (this.scheduledDate || this.scheduledDate === false) {
                changedData.scheduledDate = this.scheduledDate ? this.scheduledDate.toISOString() : this.orderOriginalData.scheduledDate
            }
            if (this.completeDate || this.completeDate === false) {
                changedData.completeDate = this.completeDate ? this.completeDate.toISOString() : this.orderOriginalData.completeDate
            }
            if (this.deadlineDate || this.deadlineDate === false) {
                changedData.deadlineDate = this.deadlineDate ? this.deadlineDate.toISOString() : this.orderOriginalData.deadlineDate
            }



            if (Object.keys(changedData).length > 0) {
                const result = await HttpUtils.request('/orders/' + this.orderOriginalData.id, 'PUT', true, changedData)
                if (result.redirect) {
                    return this.openNewRoute(result.redirect)
                }
                if (result.error || !result.response || (result.response && result.response.error)) {
                    alert('возникла ошибка при обновлении заказа. обратитесь в техподдержку')
                    return
                }
                return this.openNewRoute('/orders/view?id=' + this.orderOriginalData.id)
            }
        }
    }




}
