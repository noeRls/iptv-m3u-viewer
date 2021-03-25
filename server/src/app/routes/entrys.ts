
import { Router, Request, Response } from 'express';
import { isLogged, validateMiddleware } from '../middleware';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import { isArray, IsBoolean, IsNumber, IsOptional, isString, IsString, Max, Min } from 'class-validator';
import * as multer from 'multer';
import { parse } from 'iptv-playlist-parser'
import { ParsedFile } from '../../types/types';
import { Entry, File, Filter, Group } from '.prisma/client';
import { prisma } from '../prisma';

const router = Router();

class GetEntryQuery {
    @IsNumber()
    @Min(0)
    @Max(200)
    max: number;

    @IsNumber()
    @Min(0)
    offset: number;

    @IsBoolean()
    useDefaultFilter: boolean

    @IsString({ each: true })
    @IsOptional()
    groupNames: string[]

    @IsString({ each: true })
    @IsOptional()
    include: string[]

    @IsString({ each: true })
    @IsOptional()
    exclude: string[]
}

type FilterWithoutId = Omit<Filter, 'id'>;

const fetchEntrys = async (filters: FilterWithoutId[], offset: number, max: number): Promise<Entry[]> => {
    const filterWithGroupName = filters.filter(filter => filter.groupName);
    const filterWithoutGroupName = filters.filter(filter => !filter.groupName);

    const globalInclude = filterWithoutGroupName.reduce<string[]>((result, filter) => {
        return [...result, ...filter.includeKeyword];
    }, []);
    const globalExclude = filterWithoutGroupName.reduce<string[]>((result, filter) => {
        return [...result, ...filter.excludeKeyword];
    }, []);

    if (filterWithGroupName.length > 0) {
        return prisma.entry.findMany({
            where: {
                OR: filterWithGroupName.map(filter => ({
                    AND: {
                        groupName: {
                            equals: filter.groupName
                        },
                        OR: [...filter.includeKeyword, ...globalInclude].map(include => ({
                            name: { contains: include }
                        })),
                        NOT: [...filter.excludeKeyword, ...globalExclude].map(exclude => ({
                            name: { contains: exclude }
                        }))
                    },
                }))
            },
            skip: offset,
            take: max
        });
    }
    return prisma.entry.findMany({
        where: {
            AND: {
                OR: globalInclude.map(include => ({ name: { contains: include } }))
            },
            NOT: globalExclude.map(exclude => ({name: { contains: exclude }})),
        },
        skip: offset,
        take: max
    })
}

router.get('/entrys', isLogged, validateMiddleware(GetEntryQuery, 'query'), async (req: Request, res: Response) => {
    const { max, offset, useDefaultFilter, groupNames, include, exclude } = req.body as GetEntryQuery;

    try {
        let filters: FilterWithoutId[] = [];
        if (useDefaultFilter) {
            filters = await prisma.filter.findMany();
        }
        filters.push({ excludeKeyword: exclude, includeKeyword: include, groupName: null });
        groupNames.forEach((groupName) => filters.push({ groupName, excludeKeyword: [], includeKeyword: [] }));
        const entrys = await fetchEntrys(filters, offset, max);
        return res.status(OK).send(entrys);
    } catch (e) {
        return res.status(INTERNAL_SERVER_ERROR).end();
    }
});

export default router;