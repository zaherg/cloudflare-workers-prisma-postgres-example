# cloudflare postgres prisma example

An example project showing how you can integrate [Prisma](https://www.prisma.io), [Cloudflare Workers](https://developers.cloudflare.com/workers) and [Supabase](https://supabase.com/) with [Hono](https://github.com/honojs/hono) framework to build awesome api backend.

> [!TIP]
> If the above paragraph was a bunch of buzzwords that seem confusing, here's the simple version:
>
> -   Hono is _Web application framework_ which is fast, lightweight, built on web standards.
> -   Cloudflare Workers is a _serverless execution environment_.
> -   Prisma provides an _ORM wrapper_ around postgres, to allow data models and querying using a straightforward syntax.
> -   Supabase is a _serverless database provider_, mainly [postgres](https://www.postgresql.org/).

## Installation

0. Clone the repo and install all dependencies:

```sh
$ git clone https://github.com/zaherg/cloudflare-workers-prisma-postgres-example starter
$ cd starter
$ npm install
```

1. Create a new supabase [project](https://supabase.com/dashboard/projects)

2. Copy the database connection strings and add them to a file called `.dev.vars`, the data should be something like:

```dotenv
# Connect to Supabase via connection pooling with Supavisor.
# remember to add ?pgbouncer=true to the end of the connection string.
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public?pgbouncer=true"

# Direct connection to the database. Used for migrations.
DIRECT_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

3. Update the `prisma/schema.prisma` file to include all the models you need.

> [!note]
> It is important that you have a look at the `scripts` section as it has multiple commands that will help you with your development.

4. Using Prisma's CLI, create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client)

```sh
$ npm run prisma migrate dev
```

5. You will need to [add](https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-the-dashboard) the Database Connection strings to your environment variables, and it is always advisable to add them as secrets

```sh
# When running this command, you will be prompted to input the secret’s value:

$ npx wrangler secret put DIRECT_URL
$ npx wrangler secret put DATABASE_URL
```

6. When you're ready, deploy your application:

```sh
$ npm run deploy
```

_Note that if you haven't yet used Wrangler, you will be prompted to login to Cloudflare._
