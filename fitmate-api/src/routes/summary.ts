import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { prisma } from '../lib/prisma.js'

const summary = new OpenAPIHono()

const summaryRoute = createRoute({
  method: 'get',
  path: '/:id',
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: 'id',
          in: 'path',
          required: true
        },
        example: '3'
      })
    })
  },
  responses: {
    200: {
      description: 'Lightweight summary of analysis metrics',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number(),
            bmi: z.number(),
            bmr: z.number(),
            tdee: z.number(),
            recommendedCalories: z.number(),
            weight: z.number(),
            goal: z.enum(['lose', 'maintain', 'gain'])
          })
        }
      }
    },
    400: {
      description: 'Invalid ID'
    },
    404: {
      description: 'Analysis not found'
    }
  }
})

summary.openapi(summaryRoute, async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400)

  const analysis = await prisma.analysis.findUnique({
    where: { id },
    select: {
      id: true,
      bmi: true,
      bmr: true,
      tdee: true,
      recommendedCalories: true,
      weight: true,
      goal: true
    }
  })

  if (!analysis) return c.json({ error: 'Analysis not found' }, 404)
  return c.json(analysis)
})

export default summary
