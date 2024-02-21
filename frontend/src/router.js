import { Dashboard } from './components/dashbord'
import { FreelancersList } from './components/freelancers/freelancers-list'
import { Login } from './components/auth/login'
import { Logout } from './components/auth/logout'
import { SignUp } from './components/auth/sign-up'
import { FileUtils } from './utils/file-utils'
import { FreelancersView } from './components/freelancers/freelancers-view'
import { FreelancersCreate } from './components/freelancers/freelancers-create'
import { FreelancersEdit } from './components/freelancers/freelancers-edit'
import { FreelancersDelete } from './components/freelancers/freelancers-delete'
import { OrdersList } from './components/orders/orders-list'
import { OrdersView } from './components/orders/orders-view'
import { OrdersCreate } from './components/orders/orders-create'
import { OrdersEdit } from './components/orders/orders-edit'

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
                route: '/freelancers/view',
                title: 'Фрилансер',
                filePathTemplate: '/templates/pages/freelancers/view.html',
                useLayout: '/templates/layout.html',
                load: () => { new FreelancersView(this.openNewRoute.bind(this)) }
            },
            {
                route: '/freelancers/create',
                title: 'Создание фрилансера',
                filePathTemplate: '/templates/pages/freelancers/create.html',
                useLayout: '/templates/layout.html',
                load: () => { new FreelancersCreate(this.openNewRoute.bind(this)) },
                scripts: ['bs-custom-file-input.min.js']

            },
            {
                route: '/freelancers/edit',
                title: 'Редактирование фрилансера',
                filePathTemplate: '/templates/pages/freelancers/edit.html',
                useLayout: '/templates/layout.html',
                load: () => { new FreelancersEdit(this.openNewRoute.bind(this)) },
                scripts: ['bs-custom-file-input.min.js']

            },
            {
                route: '/freelancers/delete',
                load: () => { new FreelancersDelete(this.openNewRoute.bind(this)) },

            },
            {
                route: '/freelancers',
                title: 'Фрилансеры',
                filePathTemplate: '/templates/pages/freelancers/list.html',
                useLayout: '/templates/layout.html',
                load: () => { new FreelancersList(this.openNewRoute.bind(this)) },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js', 'dataTables.bootstrap4.min.js']
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
                    new SignUp(this.openNewRoute.bind(this))
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
            {
                route: '/orders',
                title: 'Заказы',
                filePathTemplate: '/templates/pages/orders/list.html',
                useLayout: '/templates/layout.html',
                load: () => { new OrdersList(this.openNewRoute.bind(this)) },
                styles: ['dataTables.bootstrap4.min.css'],
                scripts: ['jquery.dataTables.min.js', 'dataTables.bootstrap4.min.js']
            },
            {
                route: '/orders/view',
                title: 'Заказа',
                filePathTemplate: '/templates/pages/orders/view.html',
                useLayout: '/templates/layout.html',
                load: () => { new OrdersView(this.openNewRoute.bind(this)) }
            },
            {
                route: '/orders/create',
                title: 'Создание заказа',
                filePathTemplate: '/templates/pages/orders/create.html',
                useLayout: '/templates/layout.html',
                load: () => { new OrdersCreate(this.openNewRoute.bind(this)) },
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css'
                ],
                scripts: [
                    'moment.min.js',
                    'moment-to-locale.js',
                    'tempusdominus-bootstrap-4.min.js',
                    'select2.full.min.js'
                ]
            },
            {
                route: '/orders/edit',
                title: 'Редактирование заказа',
                filePathTemplate: '/templates/pages/orders/edit.html',
                useLayout: '/templates/layout.html',
                load: () => { new OrdersEdit(this.openNewRoute.bind(this)) },
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css'
                ],
                scripts: [
                    'moment.min.js',
                    'moment-to-locale.js',
                    'tempusdominus-bootstrap-4.min.js',
                    'select2.full.min.js'
                ]
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
            const currentRoute = window.location.pathname
            const url = element.href.replace(window.location.origin, '')
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return
            }
            await this.openNewRoute(url)
        }
    }

    loadScripts(scripts, index = 0) {
        if (index >= scripts.length) {
            return;
        }

        const script = document.createElement('script');
        script.src = '/js/' + scripts[index];
        script.onload = function () {
            loadScripts(scripts, index + 1);
        };

        document.body.appendChild(script);
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
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove()
                });
            }
            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload()
            }
        }

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle(`/css/${style}`, this.adminLteStyleElement)
                });
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript(`/js/${script}`)
                }
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
