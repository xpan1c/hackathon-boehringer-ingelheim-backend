import { userLoginSchema } from '../../../schemas'
import { registry } from '../../registry'
import { z } from '../../zod'
import { ValidationError } from '../../components/errorSchemas'
import { setCookieHeader } from '../../components/setCookieHeader'
import { pathRoot } from '../../../routes/routes'
import { userNotFoundResponse } from '../../components/responses/authMiddleware'

registry.registerPath({
  method: 'post',
  tags: ['auth'],
  path: `${pathRoot.v1.auth}/login`,
  description: 'Takes a email and a password and returns a session cookie',
  summary: 'Logs in a user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userLoginSchema,
        },
      },
    },
  },
  responses: {
    204: {
      description: 'The user has been authenticated',
      headers: { 'Set-Cookie': setCookieHeader.ref },
    },
    400: {
      description: 'Zod validation error',
      content: {
        'application/json': {
          schema: ValidationError,
        },
      },
    },
    404: userNotFoundResponse,
    422: {
      description: 'Invalid password',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Invalid password' }),
          }),
        },
      },
    },
  },
})
