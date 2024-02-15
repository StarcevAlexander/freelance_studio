import { AuthUtils } from '../../utils/auth-utils';
import { HttpUtils } from '../../utils/http-utils';

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
        await HttpUtils.request('/logout', 'POST', false, {
            refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKeys),
        })
        AuthUtils.removeAuthInfo()
        window.location.href = '/login'
    }
}