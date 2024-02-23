import { AuthUtils } from '../../utils/auth-utils'
import { HttpUtils } from '../../utils/http-utils'
import { ValidationUtils } from '../../utils/validation-utils'

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/')
        }
        const calendarScheduled = $('#calendar-scheduled')
        const calendarComplete = $('#calendar-complete')
        const calendarDeadline = $('#calendar-deadline')
        this.scheduledDate = null
        this.completeDate = null
        this.deadlinedDate = null

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
            }

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
            }
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
            }
        })
        calendarScheduled.on("change.datetimepicker", (e) => {
            this.scheduledDate = e.date
        })
        calendarComplete.on("change.datetimepicker", (e) => {
            this.completeDate = e.date
        })
        calendarDeadline.on("change.datetimepicker", (e) => {
            this.deadlinedDate = e.date
        })

        this.getFreelancers().then()

        this.freelancerSelectElement = document.getElementById('freelancerSelect')
        document.getElementById('saveButton').addEventListener('click', this.saveOrder.bind(this))
        this.amountInputElement = document.getElementById('amountInput')
        this.descriptionInputElement = document.getElementById('descriptionInput')
        this.scheduledCardElement = document.getElementById('scheduled-card')
        this.completeCardElement = document.getElementById('complete-card')
        this.deadlineCardElement = document.getElementById('deadline-card')
        this.statusSelectElement = document.getElementById('statusSelect')
        this.validations = [
            { element: this.amountInputElement },
            { element: this.descriptionInputElement },
            { element: this.scheduledCardElement, options: { checkProperty: this.scheduledDate } },
            { element: this.deadlineCardElement, options: { checkProperty: this.deadlinedDate } },
        ]

    }
    async getFreelancers() {
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
            this.freelancerSelectElement.appendChild(option)
        }

        $(this.freelancerSelectElement).select2({
            theme: 'bootstrap4'
        })
    }

    async saveOrder(e) {
        e.preventDefault()
        if (ValidationUtils.validateForm(this.validations)) {
            const createdData = {
                description: this.descriptionInputElement.value,
                deadlineDate: this.deadlinedDate.toISOString(),
                scheduledDate: this.scheduledDate.toISOString(),
                freelancer: this.freelancerSelectElement.value,
                status: this.statusSelectElement.value,
                amount: parseInt(this.amountInputElement.value)
            }
            if (this.completeDate) {
                createdData.completeDate = this.completeDate.toISOString()
            }

            const result = await HttpUtils.request('/orders', 'POST', true, createdData)
            if (result.redirect) {
                return this.openNewRoute(result.redirect)
            }
            if (result.error || !result.response || (result.response && result.response.error)) {
                alert('возникла ошибка при создании заказа. обратитесь в техподдержку')
                return
            }
            return this.openNewRoute('/orders/view?id=' + result.response.id)
        }
    }
}
