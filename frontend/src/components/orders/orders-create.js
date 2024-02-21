import { HttpUtils } from '../../utils/http-utils'

export class OrdersCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
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


        if (this.scheduledDate) {
            this.scheduledCardElement.classList.remove('is-invalid');
        }
        else {
            this.scheduledCardElement.classList.add('is-invalid');
            isValid = false
        }

        if (parseInt(this.amountInputElement.value)) {
            this.amountInputElement.classList.remove('is-invalid');
        }
        else {
            this.amountInputElement.classList.add('is-invalid');
            isValid = false
        }

        if (this.deadlinedDate) {
            this.deadlineCardElement.classList.remove('is-invalid');
        }
        else {
            this.deadlineCardElement.classList.add('is-invalid');
            isValid = false
        }
        return isValid
    }

    async saveOrder(e) {
        e.preventDefault()
        if (this.validateForm()) {

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
