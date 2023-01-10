import { Context } from './context';
import { initTRPC, TRPCError } from '@trpc/server';

// pipe context to the builder function before calling .create()
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
