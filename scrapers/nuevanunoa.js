const xray = require('x-ray')
const fs = require('fs')
const Medicine = require("../collections/medicine.js")

let x = xray({}).delay(1000)
let medList = []
let counter = 0

exports.scraper = function () {
    x(
        'https://www.veterinarianuevanunoa.com/farmacia-perros',
        'a.product-item',
        [{
            name: 'h3.title',
            link: 'a@href',
            price: 'span.price',
            image: 'img@src'
        }]
    )
    .paginate('button.load-more')
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
                    "Nueva Ñuñoa"
                )

                counter += 1
                medList.push(med)
            })

            fs.writeFile("medsnuevanunoa.json", JSON.stringify(medList, null, 2), function (err) {
                if (err) {
                    console.log("medsnuevanunoa: " + err)
                } else {
                    console.log('medsnoi.json updated')
                    console.log(counter + ' elements saved')
                }
            })
        }
    })
}



