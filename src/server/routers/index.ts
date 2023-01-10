import { procedure, router } from '../trpc';
import { z } from 'zod';

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input.text}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
