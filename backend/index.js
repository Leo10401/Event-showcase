const express = require('express');
const app = express();
const port = 5000;
const eventRouter = require('./routes/eventRouter');
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

app.use('/event', eventRouter);


app.get('/', (req, res) => {
    res.send('response from express');
});

app.get('/add', (req, res) => {
    res.send('response from add');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});