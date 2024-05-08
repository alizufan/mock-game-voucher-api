const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const port = 3000
const data = require('./data/products.json')

const product = data
    .map(v => {
        return {
            productId: v.productId,
            productName: v.productName,
            gameCode: v.gameCode,
            gameName: v.biller,
            productLogoUrl: 'https://placehold.co/500x500.png',
            billAmount: v.sellPrice.toFixed(2),
            retailPriceAmount: v.retailPrice.toFixed(2),
            adminFee: v.adminFee.toFixed(2),
            serviceFee: '0.00',
            commissionFee: v.commisionFee.toFixed(2),
            channelFee: '0.00',
            sortNo: 10,
            description: ''
        }
    })

let productUnique = {};
const operator = data
    .filter(v => {
        const code = v.gameCode
        if (!productUnique[code]) {
            productUnique[code] = true;
            return true;
        }
        return false;
    })
    .map(v => ({
        aggCode: v.aggregatorCode,
        gameCode: v.gameCode,
        gameName: v.biller,
        imageUrl: 'https://placehold.co/500x500.png'
    }))
    .sort((a, b) => {
        const [ad, bd] = [a.gameName.toLowerCase(), b.gameName.toLowerCase()]
        if (ad < bd) return -1;
        if (ad > bd) return 1;
        return 0;
    })

// filter func
const FilterEqualFn = (source, input) => {
    if (input.length <= 0) return true
    return source === input
}

// init
const app = express()

// middleware
app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

// endpoint
app.post('/api/v1/bill-payment/game-voucher/get-product-list', (req, res) => {
    let { page = 1, perPage = 10, gameCode = '' } = req.body

    page = page < 1 ? 1 : page
    perPage = perPage < 10 ? 10 : perPage

    const start = (perPage * page) - perPage
    const end = start + perPage

    const records = product.filter(v => FilterEqualFn(v.gameCode, gameCode))
    const total = records.length
    const pages = Math.ceil(total / perPage)

    res.json({
        code: '0',
        msg: 'Successful',
        data: {
            size: perPage,
            current: page,
            total,
            pages,
            records: records.slice(start, end)
        },
        traceId: 'ae15502781c2436bb10e2ccbab90bb6a'
    })
})

app.post('/api/v1/bill-payment/game-voucher/get-game-list', (req, res) => {
    let { page = 1, perPage = 10, gameCode = '' } = req.body

    page = page < 1 ? 1 : page
    perPage = perPage < 10 ? 10 : perPage

    const start = (perPage * page) - perPage
    const end = start + perPage

    const records = operator.filter(v => FilterEqualFn(v.gameCode, gameCode))
    const total = records.length
    const pages = Math.ceil(total / perPage)

    res.json({
        code: '0',
        msg: 'Successful',
        data: {
            size: perPage,
            current: page,
            total,
            pages,
            records: records.slice(start, end)
        },
        traceId: 'ae15502781c2436bb10e2ccbab90bb6a'
    })
})

app.listen(port, () => {
    console.log(`API Listening on Port ${port}\n`)
})