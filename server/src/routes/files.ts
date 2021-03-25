
import { Router, Request, Response } from 'express';
import { isLogged, validateMiddleware } from '../middleware';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { IsString } from 'class-validator';
import * as multer from 'multer';
import { parse } from 'iptv-playlist-parser'
import { ParsedFile } from '../types/types';
import { File, Group } from '.prisma/client';
import { prisma } from '../prisma';

const upload = multer({ dest: './files' });

const router = Router();

class AddFileBody {
    @IsString()
    name: string;
}

const addFileToDb = async (file: ParsedFile, fileName: string): Promise<File> => {
    const groupsName: string[] = Object.keys(file.items.reduce<Record<string, boolean>>((result, item) => {
        result[item.group.title] = true;
        return result;
    }, {}));
    await prisma.group.createMany({
        skipDuplicates: true,
        data: groupsName.map(name => ({name})),
    })
    const dbFile = await prisma.file.create({
        data: {
            name: fileName,
            entrys: {
                createMany: {
                    data: file.items.map(item => ({
                        url: item.url,
                        name: item.tvg.name,
                        groupName: item.group.title,
                        logo: item.tvg.logo
                    }))
                }
            }
        }
    });
    return dbFile;
}

router.post('/file', isLogged, upload.single('file.m3u'), validateMiddleware(AddFileBody), async (req: Request, res: Response) => {
    const { name } = req.body as AddFileBody;
    let file: ParsedFile = null;
    try {
        file = parse(req.file.buffer.toString());
    } catch (e) {
        console.error(e);
        return res.status(BAD_REQUEST).send({error: 'Failed to parse the file'});
    }

    try {
        const dbFile = await addFileToDb(file, name);
        return res.status(OK).send(dbFile);
    } catch (e) {
        console.error(e);
        return res.status(INTERNAL_SERVER_ERROR).end();
    }
});

router.get('/files', isLogged, async (req: Request, res: Response) => {
    try {
        const files = await prisma.file.findMany();
        return res.status(OK).send(files);
    } catch (e) {
        console.error(e);
        return res.status(INTERNAL_SERVER_ERROR).end();
    }
});

export default router;