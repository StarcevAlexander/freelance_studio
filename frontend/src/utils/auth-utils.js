import config from '../config/config'

export class AuthUtils {
    static accessTokenKey = 'accessToken'
    static refreshTokenKey = 'refreshToken'
    static userInfoTokenKey = 'userInfo'


    static saveAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken)
        localStorage.setItem(this.refreshTokenKey, refreshToken)
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo))
        }
    }

    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey)
        localStorage.removeItem(this.refreshTokenKey)
        localStorage.removeItem(this.userInfoTokenKey)
    }
    static getAuthInfo(key = null) {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key)
        }
        else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey)
            }
        }
    }

    static async updateRefreshToken() {
        let res = false
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");


        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                "refreshToken": this.getAuthInfo(this.refreshTokenKey)
            }),
            redirect: "follow"
        };


        await fetch(config.api + "/refresh", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.accessToken && result.refreshToken) {
                    this.saveAuthInfo(result.accessToken, result.refreshToken)
                    res = true
                }
                else {
                    this.removeAuthInfo()
                }
            }
            )
            .catch((error) => {
                this.removeAuthInfo()
                console.error(error)
            });

        return res
    }
}
