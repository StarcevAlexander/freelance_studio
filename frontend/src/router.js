import { Dashboard } from './components/dashbord'
import { FreelancersList } from './components/freelancers/freelancers-list'
import { Login } from './components/auth/login'
import { Logout } from './components/auth/logout'
import { SignUp } from './components/auth/sign-up'

export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title')
        this.adminLteStyleElement = document.getElementById('adminlte_style')
        this.initEvents()
        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                filePathTemplate: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => { new Dashboard() }
            },
            {
                route: '/freelancers',
                title: 'Фрилансеры',
                filePathTemplate: '/templates/pages/freelancers/list.html',
                useLayout: '/templates/layout.html',
                load: () => { new FreelancersList(this.openNewRoute.bind(this)) },
                styles: ['dataTables.bootstrap4.min.css']
            },
            {
                route: '/login',

                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page')
                    document.body.style.height = '100vh'
                    new Login(this.openNewRoute.bind(this))
                },
                unload: () => {
                    document.body.classList.remove('login-page')
                    document.body.style.height = 'auto'
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page')
                    document.body.style.height = '100vh'
                    new SignUp()
                },
                unload: () => {
                    document.body.classList.remove('register-page')
                    document.body.style.height = 'auto'
                },
                styles: ['icheck-bootstrap.min.css']
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this))
                },
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
        ]
    }
    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this))
        window.addEventListener('popstate', this.activateRoute.bind(this))
        document.addEventListener('click', this.clickHandler.bind(this))
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname
        history.pushState({}, '', url)
        await this.activateRoute(null, currentRoute)
    }

    async clickHandler(e) {
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
            await this.openNewRoute(url)
        }
    }

    async activateRoute(e, oldRoute = null) {
        const urlRoute = window.location.pathname
        const newRoute = this.routes.find(item => item.route === urlRoute)

        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute)
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove()
                });
            }
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload()
            }
        }

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
