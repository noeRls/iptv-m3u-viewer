import { google, calendar_v3 } from 'googleapis';

export type OAuth2Client = typeof google.auth.OAuth2.prototype;
export type Credentials = typeof google.auth.OAuth2.prototype.credentials;
export type Calendar = calendar_v3.Schema$CalendarListEntry;
export type Event = calendar_v3.Schema$Event;

export interface Block {
    title: string;
    id: string;
}

export interface CourseDetail {
    title?: string;
    code?: string;
    teachingWeek?: string;
    locations: string[];
    activityType?: string;
    professor?: string;
}

export interface Course {
    block: Block;
    start: number;
    end: number;
    detail: CourseDetail;
}
