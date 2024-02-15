import config from '../config/config';
import { AuthUtils } from './auth-utils';

export class HttpUtils {
    static async request(url, method = 'GET', useAuth = true, body = null) {
        const result = {
            error: false,
            response: null,
        }

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let token = null
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)
            if (token) {
                myHeaders.append("authorization", token);
            }
        }

        let requestOptions = {
            method: method,
            headers: myHeaders,
            redirect: 'follow'
        }
        if (!useAuth) {
            requestOptions.body = JSON.stringify(body)
        }

        let res = null
        await fetch(config.api + url, requestOptions)
            .then((response) =>
                res = response)
            .then((response) =>
                response.json())
            .then((response) => {
                result.response = response
            }
            )
            .catch((error) => {
                console.log(error);
                result.error = true;
            });

        if (res.status < 200 || res.status > 300) {
            if (useAuth && res.status === 401) {
                if (!token) {
                    result.redirect = '/login'
                }
                else {
                    const updateTokenResult = await AuthUtils.updateRefreshToken()
                    if (updateTokenResult) {
                        return this.request(url, method, useAuth, body)
                    }
                    else {
                        result.redirect = '/login'
                    }

                }
            }
        }

        return result;
    }

}