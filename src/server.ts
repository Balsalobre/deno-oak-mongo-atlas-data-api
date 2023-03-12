import { Application } from 'https://deno.land/x/oak/mod.ts';
import { PORT } from './config/index.ts';

import router from './routes.ts';

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port: parseInt(PORT, 10) });

console.log(`Server listening http://localhost:${PORT}`);
