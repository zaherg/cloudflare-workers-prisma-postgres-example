import { type Context, type Env, Hono } from 'hono';

const app = new Hono<Env>();

app.get('/', async (ctx: Context) => {
	const prisma = ctx.get('prisma');

	const records = await prisma.users.findMany({
		orderBy: { id: 'asc' },
	});

	return ctx.json(records);
});

export default app;
