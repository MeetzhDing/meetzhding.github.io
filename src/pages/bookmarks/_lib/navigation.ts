import { parse } from 'yaml';
import { z } from 'zod';
import { iconKeys } from '@/common/navigation/icons';
import navigationSource from '../navigation.yaml?raw';

const IconKeySchema = z.enum(iconKeys, {
  errorMap: () => ({
    message: `Icon must be one of: ${iconKeys.join(', ')}`,
  }),
});

const UrlSchema = z
  .string()
  .trim()
  .refine((value) => {
    try {
      const url = new URL(value);
      return ['http:', 'https:', 'mailto:'].includes(url.protocol);
    } catch {
      return false;
    }
  }, 'URL must be absolute and use http, https, or mailto');

const ItemSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().default(''),
  url: UrlSchema,
  icon: IconKeySchema,
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Color must be a 6-digit hex value'),
  external: z.boolean().default(true),
});

const NavigationSchema = z.object({
  site: z.object({
    title: z.string().trim().min(1),
  }),
  items: z.array(ItemSchema).min(1),
});

export type Navigation = z.infer<typeof NavigationSchema>;
export type NavigationItem = Navigation['items'][number];

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join('.') : 'navigation';
      return `${path}: ${issue.message}`;
    })
    .join('\n');
}

export function getNavigation(): Navigation {
  const result = NavigationSchema.safeParse(parse(navigationSource));

  if (!result.success) {
    throw new Error(`Invalid navigation.yaml:\n${formatIssues(result.error)}`);
  }

  return result.data;
}
