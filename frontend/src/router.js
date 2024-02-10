import { Dashboard } from './components/dashbord'
import { Login } from './components/login'
import { SignUp } from './components/sign-up'

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title')
        this.adminLteStyleElement = document.getElementById('adminlte_style')
        this.initEvents()
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => { new Dashboard() }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page')
                    document.body.style.height = '100vh'
                    new Login()
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page')
                    document.body.style.height = '100vh'
                    new SignUp()
                },
                styles: ['icheck-bootstrap.min.css']
            },
        ]
    }
    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this))
        window.addEventListener('popstate', this.activateRoute.bind(this))
        document.addEventListener('click', this.openNewRoute.bind(this))
    }

    async openNewRoute(e) {
        let element = null
        if (e.target.nodeName === 'A') {
            element = e.target
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode
        }
        if (element) {
            e.preventDefault()
            const url = element.href.replace(window.location.origin, '')
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return
            }
            history.pushState({}, '', url)
            console.log(url);
            await this.activateRoute()
        }
    }
    async activateRoute() {
        const urlRoute = window.location.pathname
        const newRoute = this.routes.find(item => item.route === urlRoute)

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    const link = document.createElement('link')
                    link.rel = 'stylesheet'
                    link.href = '/css/' + style
                    document.head.insertBefore(link, this.adminLteStyleElement)
                });
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Freelance Studio'
            }
            if (newRoute.filePathTemplate) {
                document.body.className = ''
                this.contentPageElement = document.getElementById('content')
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text())
                    this.contentPageElement = document.getElementById('content-layout')
                    document.body.classList.add('sidebar-mini')
                    document.body.classList.add('layout-fixed')
                }
                else {
                    document.body.classList.remove('sidebar-mini')
                    document.body.classList.remove('layout-fixed')
                }
                this.contentPageElement.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text())
            }
            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load()
            }


        }
        else {
            console.log('no route found');
            history.pushState({}, '', '/404')
            await this.activateRoute()
        }
    }
}