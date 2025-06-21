import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { prisma } from '../lib/prisma.js'

const deleteAnalysis = new OpenAPIHono()

const deleteAnalysisRoute = createRoute({
  method: 'delete',
  path: '/:id',
  request: {
    params: z.object({
      id: z.string().openapi({ example: '1' })
    })
  },
  responses: {
    200: {
      description: 'Deleted successfully',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean().openapi({ example: true })
          })
        }
      }
    },
    400: {
      description: 'Invalid ID',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'Invalid ID' })
          })
        }
      }
    },
    404: {
      description: 'Not Found or already deleted',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string().openapi({ example: 'Not Found or already deleted' })
          })
        }
      }
    }
  }
})

deleteAnalysis.openapi(deleteAnalysisRoute, async (c) => {
  const idParam = c.req.param('id')
  const id = Number(idParam)

  if (isNaN(id)) {
    // Return a 400 response
    return c.json({ error: 'Invalid ID' }, 400)
  }

  try {
    await prisma.recommendation.deleteMany({ where: { analysisId: id } })
    await prisma.analysis.delete({ where: { id } })

    return c.json({ success: true }, 200)
  } catch (err) {
    return c.json({ error: 'Not Found or already deleted' }, 404)
  }
})

export default deleteAnalysis
