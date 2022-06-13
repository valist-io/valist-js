import { z } from 'zod';

export const projectSettingsFormSchema = z.object({
    account: z.string(),
    projectName: z.string(),
    displayName: z.string(),
    website: z.string(),
    shortDescription: z.string(),
    description: z.string(),
    youtube: z.string(),
    newMembers: z.string(),
    price: z.string(),
    limit: z.string(),
    royalty: z.string(),
    royaltyAddress: z.string(),
  });

const versionRegex = /[^\w-.]/g;

export const releaseFormSchema = z.object({
    account: z.string(),
    project: z.string(),
    version: z.string()
      .min(1, { message: 'Version should have at least 1 character' })
      .regex(versionRegex, { message: 'Versions cannot contain [!@#$%^&*()[]] or spaces!' }),
    description: z.string(),
  });
