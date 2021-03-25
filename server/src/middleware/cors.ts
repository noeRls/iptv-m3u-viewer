import { Request, Response, NextFunction} from 'express';

const cors = process.env.CORS;
const allcors = (cors || '').split(',');

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('origin');
  let set = false;
  if (cors === 'all') {
    res.header('Access-Control-Allow-Origin', origin);
    set = true;
  } else if (allcors.indexOf(origin) !== -1) {
    res.header('Access-Control-Allow-Origin', origin);
    set = true;
  }
  if (set) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, Authorization, '
      + 'x-id, Content-Length, X-Requested-With',
    );
    res.header('Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS');
  }
  return next();
};