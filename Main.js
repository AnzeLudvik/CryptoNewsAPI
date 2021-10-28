const PORT = process.env.PORT || 9000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const sites = [

    {
        name: "yahoo",
        url: "https://finance.yahoo.com",
        base: "https://finance.yahoo.com"
    },
    {
        name: "investing",
        url: "https://www.investing.com/news/stock-market-news",
        base: "https://www.investing.com"
    },
    {
        name: "cnbc",
        url: "https://www.cnbc.com/world/?region=world",
        base: ""
    }

]

const articles = []

sites.forEach(site => {

    axios.get(site.url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $("a:contains(stock)", html).each(function (){
                const title = $(this).text()
                const url = $(this).attr("href")

                articles.push({
                    title,
                    url: site.base + url,
                    source: site.name
                })
            })
        })

})

app.get("/", (req,res) => {
    res.json("Welcome to crypto news API!")
})

app.get("/news", (req,res) => {

    res.json(articles)

/*   
    axios.get("https://finance.yahoo.com")
    .then((response) => {
        const html = response.data
        const $ = cheerio.load(html)

        $("a:contains(stock)", html).each(function (){
            const title = $(this).text()
            const url = $(this).attr("href")
            articles.push({ 
                title,
                url
            })
        })
        res.json(articles)
    }).catch((err) => console.log(err))
    */

})

app.get("/news/:newspaperId", (req, res) => {

    const ID = req.params.newspaperId

    const siteID = sites.filter(site => site.name === ID)[0].url
    const baseID = sites.filter(site => site.name === ID)[0].base

    axios.get(siteID)
        .then(response => {

            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []
            
            $("a:contains('stock')", html).each(function(){

                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({ 
                    
                    title,
                    url: baseID + url,
                    source: siteID

                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

})

app.listen(PORT, () => console.log("Server running on port " + PORT))