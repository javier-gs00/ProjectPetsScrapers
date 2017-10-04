const xray = require('x-ray')
const fs = require('fs')
const Medicine = require('../utils/medicine.js')

let date = new Date()
let x = xray().delay(1000)
let medList = []
let counter = 0

exports.scraper = function (path) {
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
                    result.name,
                    result.price,
                    result.link,
                    "Medicine",
                    "Brand",
                    result.image,
                    "Noi"
                )
                
                counter += 1
                medList.push(med)
            })

            fs.writeFile(path, JSON.stringify(medList, null, 2), function (err) {
                if (err) {
                    console.log("medsnoi err: " + err)
                } else {
                    console.log('medsnoi.json updated')
                    console.log(counter + ' elements saved')
                    console.log('Noi scraper finished at: ' + date.getSeconds())
                }
            })
        }
    })
}