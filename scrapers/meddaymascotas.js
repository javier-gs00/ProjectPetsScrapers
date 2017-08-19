const xray = require('x-ray');
const fs = require('fs')

var date = new Date()
var x = xray({
    filters: {
        visitanos: function (value) {
            return value === 'VISITANOS' ? value = '' : value
        },
        llamanos: function (value) {
            return value === 'LLÁMANOS' ? value = '' : value
        },
        escribenos: function (value) {
            return value === 'ESCRÍBENOS' ? value = '' : value
        },
        horarios: function (value) {
            return value === 'HORARIOS' ? value = '' : value
        },
        trunk: function (value) {
            return value.length > 7 ? value.slice(value.indexOf('$', 1)) : value
        }
    }
}).delay(1000);

// Create the object constructor to save a custom JSON
function Medicine(name, price, link, category, brand, image, store) {
    this.name = name;
    this.price = price;
    this.link = link;
    this.category = category;
    this.brand = brand;
    this.image = image;
    this.store = store;
}

// Create an array that will hold the objects to be saved in JSON
let medList = [];

exports.scrapper = function () {
    // Initialize scraper
    x(
        'http://daymascotas.cl/categoria-producto/medicamentos-drag-pharma/',
        '.show-links-onimage',
        [{
            name: 'h3 | visitanos | llamanos | escribenos | horarios',
            link: 'a@href',
            price: '.price | trunk',
            image: 'img@src'
        }]
    )
        .paginate('.next.page-numbers@href')
        .limit(6)
        (function (err, data) {
        if (err) {
            console.log(err);
        } else {
            // Transform extracted data into objects to be saved in JSON
            data.forEach(function(result) {
                let medicine = new Medicine (
                    result.name,
                    result.price,
                    result.link,
                    "Medicine",
                    "Brand",
                    result.image,
                    "Daymascotas"
                );

                medList.push(medicine);
            }, this);

            fs.writeFile('medsdaymascotas.json', JSON.stringify(medList, null, 2), function (err) {
                if (err) {
                    console.log('medsdaymascotas: ' + err);
                } else {
                    console.log('medsdaymascotas.json updated');
                    console.log('Daymascotas scraper finished at: ' + date.getSeconds());
                }
            })
        }
    })
}