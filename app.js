const express = require('express');
require('./database/db');
const cors = require('cors');
const router = express.Router();
const userRouter = require('./routes/auth');
const auth = require('./middleware/auth');
const app = express();

app.use(express.json());
app.use(cors());


const port = process.env.PORT || 5000;

app.use('/api', userRouter);
app.use(auth);


app.listen(port, () => console.log(`Server running on port ${port}`));