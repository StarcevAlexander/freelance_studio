import config from '../config/config';

export class HttpUtils {
    static async request(url, method = 'GET', body = null) {
        const result = {
            error: false,
            response: null
        }
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: method,
            headers: myHeaders,
            body: JSON.stringify(body),
            redirect: 'follow'
        }
        await fetch(config.api + url, requestOptions)
            .then((response) => response.json())
            .then(response => {
                if (response.status < 200 || response.status > 300) {
                    result.error = true
                    return result
                }
                result.response = response;
            }
            )
            .catch((error) => {
                console.error(error)
                result.error = true
                return result
            });
        return result
    }
}
