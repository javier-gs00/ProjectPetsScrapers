const xray = require('x-ray')
const fs = require('fs')
const Medicine = require('../collections/medicine.js')

let date = new Date()
let x = xray().delay(1000)
let medList = []

exports.scraper = function () {
    x(
        'https://www.noi.la/mascotte/perros/farmacia-perros/',
        'div.product',
        [{
            name: '.product-title a@html',
            link: 'a@href',
            price: 'span.woocommerce-Price-amount',
            image: 'img@src'
        }]
    )
    .paginate('.next.page-numbers@href')
    .limit(3)
    (function (err, data) {
        if (err) {
            console.log(err)
        } else {
            data.forEach(function(result) {
                let med = new Medicine(
                    decodeURI(result.name),
                    result.price,
                    result.link,
                    "Medicine",
                    "Brand",
                    result.image,
                    "Noi"
                )

                medList.push(med)
            })

            fs.writeFile('medsnoi.json', JSON.stringify(medList, null, 2), function (err) {
                if (err) {
                    console.log("medsnoi: " + err)
                } else {
                    console.log('medsnoi.json updated')
                    console.log('Noi scraper finished at: ' + date.getSeconds())
                }
            })
        }
    })
}



