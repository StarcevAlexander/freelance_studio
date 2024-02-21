import config from '../../config/config';
import { CommonUtils } from '../../utils/common-utils';
import { FileUtils } from '../../utils/file-utils';
import { HttpUtils } from '../../utils/http-utils';

export class OrdersEdit {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (!id) {
            return this.openNewRoute('/')
        }

        this.init(id).then()


        this.scheduledDate = null
        this.completeDate = null
        this.deadlineDate = null



        document.getElementById('updateButton').addEventListener('click', this.updateOrder.bind(this))
        this.amountInputElement = document.getElementById('amountInput')
        this.freelancerSelectElement = document.getElementById('freelancerSelect')
        this.descriptionInputElement = document.getElementById('descriptionInput')
        this.scheduledCardElement = document.getElementById('scheduled-card')
        this.completeCardElement = document.getElementById('complete-card')
        this.deadlineCardElement = document.getElementById('deadline-card')
        this.statusSelectElement = document.getElementById('statusSelect')
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

        calendarScheduled.datetimepicker({
            // format: 'L',
            locale: 'ru',
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false,
            buttons: {
                showClear: true
            },
            date: order.scheduledDate

        })
        calendarComplete.datetimepicker({
            locale: 'ru',
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false,
            buttons: {
                showClear: true
            },
            date: order.completeDate ? order.completeDate : ""
        })
        calendarDeadline.datetimepicker({
            locale: 'ru',
            inline: true,
            icons: {
                time: 'far fa-clock'
            },
            useCurrent: false,
            buttons: {
                showClear: true
            },
            date: order.deadlineDate
        })
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

    validateForm() {
        let isValid = true
        let textInputArray = [this.amountInputElement, this.descriptionInputElement]
        for (let index = 0; index < textInputArray.length; index++) {
            if (textInputArray[index].value) {
                textInputArray[index].classList.remove('is-invalid');
            }
            else {
                textInputArray[index].classList.add('is-invalid');
                isValid = false
            }
        }

        if (parseInt(this.amountInputElement.value)) {
            this.amountInputElement.classList.remove('is-invalid');
        }
        else {
            this.amountInputElement.classList.add('is-invalid');
            isValid = false
        }

        return isValid
    }

    async updateOrder(e) {
        e.preventDefault()
        if (this.validateForm()) {
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
