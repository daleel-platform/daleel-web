import type { ErrorResponseBody } from '@/types/api';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly errorTitle?: string;
  readonly validationMessages?: string[];
  readonly timestamp?: string;
  readonly path?: string;

  constructor(
    body: Partial<ErrorResponseBody> & {
      statusCode: number;
      message: string | string[];
    },
  ) {
    const formattedMessage = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message || 'An unexpected API error occurred';

    super(formattedMessage);
    this.name = 'ApiError';
    this.statusCode = body.statusCode;
    this.errorTitle = body.error;
    this.validationMessages = Array.isArray(body.message)
      ? body.message
      : undefined;
    this.timestamp = body.timestamp;
    this.path = body.path;
  }
}
