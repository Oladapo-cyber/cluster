import { app } from './app.js';
import { env } from './config/env.js';

app.listen(env.PORT, () => {
  console.log(`clusta-api listening on port ${env.PORT}`);
});
