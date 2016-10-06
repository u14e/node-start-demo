var context = {
    currency: {
        name: 'United States dollars',
        abbrev: 'USD',
    },
    tours: [
        { name: 'Hood River', price: '$99.95' },
        { name: 'Oregon Coast', price: '$159.95' },
    ],
    specialsUrl: '/january-specials',
    currencies: ['USD', 'GBP', 'BTC'],
}

exports.getContent = function(prop) {
    return context[prop]
}