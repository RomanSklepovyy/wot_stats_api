const app = require('./app');
const { Worker } = require('worker_threads');

const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server is up on port ' + port)
});

const worker = new Worker('./src/updateStatsWorker.js');

worker.on("error", (error) => console.log(error));