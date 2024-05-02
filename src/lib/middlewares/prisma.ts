import type { Context, Env, MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

export const prisma = (): MiddlewareHandler =>
	createMiddleware<Env>(async (ctx: Context, next: any) => {
		if (!ctx.get('prisma')) {
			const connectionString = ctx.env.DATABASE_URL;
			const pool = new Pool({ connectionString });
			const adapter = new PrismaPg(pool);

			ctx.set('prisma', new PrismaClient({ adapter }));
		}

		await next();
	});
