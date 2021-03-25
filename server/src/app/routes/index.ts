import { Express } from "express";
import files from './files';
import entrys from './entrys';

export default (app: Express) => {
    app.use(files);
    app.use(entrys);
};