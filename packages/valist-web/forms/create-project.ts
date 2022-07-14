import { z } from 'zod';

export const schema = z.object({
  projectName: z.string()
    .min(3, { 
      message: 'Project name should have at least 3 characters',
    })
    .max(24, { 
      message: 'Project name should not be longer than 24 characters',
    })
    .regex(/^[\w-]+$/g, { 
      message: 'Project name can only contain letters, numbers, and dashes',
    })
    .refine((val) => val.toLocaleLowerCase() === val, { 
      message: 'Project name can only contain lowercase letters',
    }),
  displayName: z.string()
    .min(3, {
      message: 'Display name should have at least 3 characters',
    })
    .max(24, {
      message: 'Display name should not be longer than 32 characters',
    }),
  website: z.string(),
  description: z.string(),
  shortDescription: z.string()
    .max(100, {
      message: 'Description should be shorter than 100 characters',
    }),
});

export interface FormValues {
  projectName: string;
  displayName: string;
  website: string;
  description: string;
  shortDescription: string;
}