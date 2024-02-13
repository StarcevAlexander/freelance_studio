import { AuthUtils } from '../utils/auth-utils';

export class Logout {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKeys)) {
            // return this.openNewRoute('/')
            return window.location.href = '/login'
        }
        this.logout().then()
    }

    async logout() {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                refreshToken: localStorage.getItem('refreshToken'),
            }),
            redirect: 'follow'
        };

        await fetch("http://localhost:3000/api/logout", requestOptions)
            // .then(response => response.json())
            .then(result => {
                AuthUtils.removeAuthInfo()
                // this.openNewRoute('/login')
                window.location.href = '/login'
            }
            )
            .catch(error => console.log('error', error));
    }
}
