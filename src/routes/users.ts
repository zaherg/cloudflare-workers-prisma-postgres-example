import { type Context, type Env, Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const User = z.object({
	id: z.number().optional(),
	name: z.string(),
	email: z.string().email(),
});

type User = z.infer<typeof User>;

const app = new Hono<Env>()
	.get('/', async (ctx: Context) => {
		const prisma = ctx.get('prisma');

		const records = await prisma.user.findMany({
			orderBy: { id: 'asc' },
		});

		return ctx.json(records);
	})
	.get('/:id{[0-9]+}', async (ctx: Context) => {
		const prisma = ctx.get('prisma');
		const id = Number.parseInt(ctx.req.param('id') || '0');

		const record = await prisma.user.findUnique({
			where: { id },
		});

		if (!record) {
			return ctx.notFound();
		}

		return ctx.json(record);
	})
	.post(
		'/',
		zValidator('json', User, (result, ctx: Context) => {
			if (!result.success) {
				return ctx.json(
					result.error.issues.map(
						(issue) => `${issue.path[0]} is ${issue.message}`,
					),
					400,
				);
			}
		}),
		async (ctx: Context) => {
			const prisma = ctx.get('prisma');
			const data: User = ctx.req.valid('json');

			const record = await prisma.user.upsert({
				where: {
					email: data.email,
				},
				update: {
					name: data.name,
				},
				create: data,
			});

			return ctx.json(record);
		},
	)
	.delete('/:id{[0-9]+}', async (ctx: Context) => {
		const prisma = ctx.get('prisma');
		const id = Number.parseInt(ctx.req.param('id') || '0');
		await prisma.user.delete({
			where: { id },
		});

		return ctx.json({
			message: 'record has been deleted',
		});
	});

export default app;
