// Private build: crash and error reporting is removed. Nothing is sent anywhere.
// The calls stay in place across the app, so this keeps their shape and does nothing.

type ReportContext = Record<string, unknown> | string | undefined;

type Breadcrumb = {
  category?: string;
  message?: string;
  level?: string;
  data?: Record<string, unknown>;
  type?: string;
};

export const Sentry = {
  captureException(_error: unknown, _context?: ReportContext): string {
    return '';
  },
  captureMessage(_message: string, _context?: ReportContext): string {
    return '';
  },
  addBreadcrumb(_breadcrumb: Breadcrumb): void {},
  wrap<T>(component: T): T {
    return component;
  },
};

export function initSentry(): void {}
