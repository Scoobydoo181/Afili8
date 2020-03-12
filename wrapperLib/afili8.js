const axios = require('axios')

class Aflii8 {
    constructor(clientToken) {
        this.clientToken = clientToken
        this.url = process.env.url
    }

    create = (affiliateCode) => {
        axios.post(this.url + "/create", {
            clientToken: this.clientToken,
            affiliateCode: affiliateCode,
        })
    }

    delete = (affiliateCode) => {
        axios.post(this.url + "/delete", {
            clientToken: this.clientToken,
            affiliateCode: affiliateCode,
        })
    }

    verify = (affiliateCode) => {
        axios.post(this.url + "/verify", {
            clientToken: this.clientToken,
            affiliateCode: affiliateCode,
        })
    }

    increment = (affiliateCode, price, commission) => {
        axios.post(this.url + "/increment", {
            clientToken: this.clientToken,
            affiliateCode: affiliateCode,
            price: price,
            commission: commission
        })
    }
}

module.exports = Aflii8