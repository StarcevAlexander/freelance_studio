export class UrlUtils {
    static getUrlParam(param) {
        const urlParam = new URLSearchParams(window.location.search)
        return urlParam.get(param)
    }
}