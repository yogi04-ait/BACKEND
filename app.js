const express = require('express')
const app = express();

app.listen(7000, () => {
    console.log("Server is listening")
})

app.get('/hello', (req, res) => {
    res.send("Hello Delhi")
})