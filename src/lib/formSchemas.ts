import * as z from 'zod';

export const creatVenderFormSchema = z.object({
  vendorName: z.string(),
  openingBalance: z.number(),
  asOf: z.coerce.date(),
  companyName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  jobTitle: z.string(),
  mainPhone: z.number().max(10),
  mainEmail: z.string(),
  workPhone: z.number().max(10),
  ccEmail: z.string(),
  mobilePhone: z.number().max(10),
  website: z.string(),
  fax: z.string(),
  other: z.string(),
});
