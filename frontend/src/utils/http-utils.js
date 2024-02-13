import config from '../config/config';

export class HttpUtils {
    static async request(url, method = 'GET', body = null) {
        const result = {
            error: false,
            response: null
        }

        const params = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            // redirect: 'follow'
        }

        if (body) {
            params.body = JSON.stringify(body)
        }

        let response = null
        try {
            response = await fetch(config.api + url, requestOptions)
            result.response = await response.json()
        } catch (error) {
            result.error = true
            return result
        }

        if (response.status < 200 || response.status > 300) {
            result.error = true

        }
        return result
    }
}