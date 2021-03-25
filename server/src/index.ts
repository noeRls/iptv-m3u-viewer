import * as express from 'express';
import { init as initDb } from './app/prisma';
import routes from './app/routes';
import { corsMiddleware } from './app/middleware';
import * as logger from 'morgan';

const start = async () => {
    await initDb();

    const app = express();

    app.use(corsMiddleware);
    app.use(logger('dev'));
    app.use(express.static('public'));
    app.use(express.json());
    app.use(express.urlencoded());

    routes(app);
    app.get('/hello', (_, res) => res.status(200).send('Hello World !'));

    app.listen(process.env.PORT, () => console.log(`Server listening on port ${process.env.PORT}...`));
};

start().catch(console.error);
