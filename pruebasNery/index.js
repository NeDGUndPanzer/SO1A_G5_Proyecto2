const express = require('express');

const app = express();
app.get('/', (req,res) => {
    res.send('Holis');
});

app.listen(8080, '0.0.0.0');
console.log('Running on http://0.0.0.0:8080');