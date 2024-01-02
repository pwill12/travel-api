const Payment = require("../Models/Payment");

const router = require("express").Router();

//CREATE ORDER

router.get("/payments", async (reqs, ress) => {
    const https = require('https')

    const params = JSON.stringify({
        "email": reqs.body.email,
        "amount": reqs.body.amount
    })

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: 'Bearer sk_test_3b7a0f96008780973b8559195a6950bfdfe1b005',
            'Content-Type': 'application/json'
        }
    }

    const req = https.request(options, res => {
        let data = ''

        res.on('data', (chunk) => {
            data += chunk
        });

        res.on('end', async () => {
            // console.log(JSON.parse(data))
            ress.send(data)
        })
    }).on('error', error => {
        console.error(error)
    })

    req.write(params)
    req.end()
});

module.exports = router;

