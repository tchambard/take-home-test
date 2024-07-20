# Analysis of the original codebase.

## Understanding the project

Fist of all, I see we have a monorepo managed by NX and we use bun as package manager. So I installed bun globally on my system and then ran `bun install` to install all project dependencies.

Then I look at scripts available in main `package.json` file.  
In the same time I observe that we have only one package named `web` which doesn't have a `package.json` file but a `project.json` (I look at NX documentation).

My first action is to launch the application in order to test it. I see that I missed the configuration of `.env` file, so I create it and I configure `DATABASE_URL` environement variable with a Supabase connection url as suggested (I created my Supabase account).

Now I'm getting an error saying: `PostgresError: relation "monitoring" does not exist`. So I let this temporarily to understand better what the code is doing...

Looking at `src` folder I find three main subfolders:

- app
- components
- database

So I decide to go to look at `database/schema.ts` and get all necessary informations on database schemas.

I do not know very well all this tools. But I decide to go to drizzle documentation to understand what both scripts `db:push` and `db:seed` could do for me. And luckily I found that `drizzle-kit push` can initialize the tables on PG side for me :) so I launch it.

First problem here: `ERROR: Transforming const to the configured target environment ("es5") is not supported yet`.
Wow !! ES5 :)

This the first decision I take... I will change the target in `tsconfig.json` file from `ES5` to `ES2022`.

Now `bun run db:push` command works, and I'm glad to see my tables `event` and `monitoring` initialized with correct schemas... Cool.

Let's initialize seeds now with `db:seed` script... Surprise ! `./src/database/seed.ts` is missing... I decide to create it.
To do that, I'm creating sample data seeds and iterate over it to insert monitorings in DB.

Now, the application shows me 1 card for each monitoring I created.

Before commiting my first changes, I observe that I got lots of undesirable formatting changes. I found several vscode rules defined with `biomejs` which is a tool I do not know. Looking at the documentation, I decide to init the `biomejs` configuration file with `npx @biomejs/biome init` then run `npx @biomejs/biome format --write .` in order to apply formatting and everything get back to initial state...

As I'm not familiar with Next.js, I will go ahead on task 2 (bugs fixing) and I will come back on improvement proposals later.

# Explanation of changes made.

- Change the target in `tsconfig.json` file from `ES5` to `ES2022`.  
  `ES5` is very old and modern browsers are almost all compatible with recent versions of Ecmascript.

- Add `biomejs` configuration file to apply formatting same for rules on each developer environment.

## Bugs branch changes

1) fix homepage display using flex-wrap 
2) fix duplicate monitorings using pg unique constraint. In real world, I should have implement a migration script to deduplicate existing data in monitoring database and mutate events to be linked to deduplicated monitoring records.
3) this is more a feature than a bug ! I added pagination mechanism to prevent overload when having lot of monitorings. 

## Features

### 3. Form

branch: feat/monitoring/new-form

Simple implementation with next/actions. This is very light. I should have do minimal errors handling and display loading information, but I didn't. This feature reveals that the list of monitorings objects should be sortable (probably sorted by date DESC by default), in order to see last created monitorings. We should alos have search capabilities on the list to be able to find what we are looking for.

### 4. Migration

branch: feat/monitoring-lambda/aws

I created new AWS personnal account and installed `serverless` globally with npm. Then created new serverless project `apps/monitoring`.

You need to deploy the lambda using `bun run lambda:deploy` after creating and giving needed information into `.env` (copied from `.env.template`) into `apps/monitoring` directory.

# Good and bad aspects of my work.
