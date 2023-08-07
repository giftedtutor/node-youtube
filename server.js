import express from "express";
const app = express();
import dotenv from "dotenv";
import morgan from "morgan";
import connectDb from "./db.js";
import bodyParser from "body-parser";
import cors from "cors";
import engines from "consolidate";

import fs from "fs";
import "dotenv/config";
dotenv.config();
import path from 'path';
// const __dirname = path.resolve();
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

import categoryRoutes from "./routes/categoryRoutes.js";
import paypal from 'paypal-rest-sdk'

connectDb();
//

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AdnKh5iV9L9cpT_UUm3CKlz6626Xe9JKJA8QKKUeLHj5pBhR-ald2aIcEYwAsjm1KWxWpYiepCp2vIEp',
    'client_secret': 'EHG1SRTRBh20RrQl8wvv70Ye_SIettWsmZZ6hnQyM-XiMWTX1xxUO9DiJjlnFNsz5CPv0hNJOtB5aY_M'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/files", express.static(path.join(__dirname, "/upload")));

// Set EJS as templating engine
app.set("view engine", "ejs");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/categories", categoryRoutes);



// app.get("/", (req, res) => {
//   res.json({ message: "Hello World" });
// });
let PRICE = 0
let CURRENCY = 'USD'

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/api/paypal", (req, res) => {
    PRICE = req.query.amt
    CURRENCY = req.query.currency

    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },

        redirect_urls: {
            return_url: "https://call-zipper-app.herokuapp.com/api/success",
            cancel_url: "https://call-zipper-app.herokuapp.com/api/cancel"
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: "item",
                            sku: "item",
                            price: `${PRICE}`,
                            currency: CURRENCY,
                            quantity: 1
                        }
                    ]
                },
                amount: {
                    currency: CURRENCY,
                    total: `${PRICE}`
                },
                description: "This is the payment description."
            }
        ]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href);
        }
    });
});

app.get("/api/success", (req, res) => {
    // res.send("Success");
    console.log('REQ:::', req.query)
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: CURRENCY,
                    total: `${PRICE}`
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (
        error,
        payment
    ) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render("success");
        }
    });
});

app.get("/api/cancel", (req, res) => {
    res.render("cancel");
});


const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server is Running on Port ${PORT}`));
