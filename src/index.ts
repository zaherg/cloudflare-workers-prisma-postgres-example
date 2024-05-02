import { type Context, type Env, Hono } from 'hono';
import { cors } from 'hono/cors';
import { etag } from 'hono/etag';
import { prisma } from '@/lib/middlewares/prisma';
import users from '@/routes/users';

const app = new Hono<Env>();

// middlewares
app.use(cors()).use(etag());

app.get('/', (ctx: Context) => {
	return ctx.json({ message: 'hello' });
});

app.use('api/*', prisma()).basePath('api').route('/users', users);

export default app;
