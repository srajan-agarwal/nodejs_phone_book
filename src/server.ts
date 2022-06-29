import express from 'express';
import bodyParser from 'body-parser';
import informationRouter from './routers/InformationsRouter';
import pool from './dbconfig/dbconnector';

class Server {
    private app: any;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
    }

    private dbConnect() {
        pool.connect(function (err, client, done) {
            if (err) {
                console.error('Error while connectiong DB : ', err);
                throw new Error()
            };
            console.log('DB Connected');
        });
    }

    private routerConfig() {
        this.app.use('/api', informationRouter);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}

export default Server;