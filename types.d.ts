declare namespace Express {
    export interface Request {
        userId: number;
    }
    export interface IncomingHttpHeaders {
        "xh_filters"?: string
    }
}

