import { z } from 'zod';

export const createAccountSchema = z.object({
  accountName: z.string()
    .min(3, { 
      message: 'Account name should have at least 3 characters',
    })
    .max(24, { 
      message: 'Account name should not be longer than 24 characters',
    })
    .regex(/^[\w-]+$/g, { 
      message: 'Account name can only contain letters, numbers, and dashes',
    })
    .refine((val) => val.toLocaleLowerCase() === val, { 
      message: 'Account name can only contain lowercase letters',
    }),
  displayName: z.string()
    .min(3, {
      message: 'Display name should have at least 3 characters',
    })
    .max(24, {
      message: 'Display name should not be longer than 32 characters',
    }),
  website: z.string(),
  description: z.string()
    .max(100, {
      message: 'Description should be shorter than 100 characters',
    }),
});

export interface CreateAccountFormValues {
  accountName: string;
  displayName: string;
  website: string;
  description: string;
}
