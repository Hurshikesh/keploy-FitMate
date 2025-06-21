import { OpenAPIHono, createRoute, z} from '@hono/zod-openapi'
import { prisma } from '../lib/prisma.js'

const app = new OpenAPIHono()

const AnalyzeInput = z.object({
  age: z.number(),
  weight: z.number(),
  height: z.number(),
  bodyFat: z.number(),
  gender: z.enum(['male', 'female']),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']),
  goal: z.enum(['lose', 'maintain', 'gain']),
})

const AnalyzeResponse = z.object({
  id: z.number(),
  bmi: z.number(),
  bmr: z.number(),
  tdee: z.number(),
  recommendedCalories: z.number(),
  createdAt: z.string(),
})

const activityMultiplier = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
}

const goalAdjustment = {
  lose: -500,
  maintain: 0,
  gain: 500,
}

const analyzeRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: AnalyzeInput,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Analysis result',
      content: {
        'application/json': {
          schema: AnalyzeResponse,
        },
      },
    },
    400: {
      description: 'Validation error',
    },
  },
})

app.openapi(
  analyzeRoute,
  async (c) => {
    const body = await c.req.json()
    const parsed = AnalyzeInput.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: parsed.error.format() }, 400)
    }

    const { age, weight, height, bodyFat, gender, activityLevel, goal } = parsed.data

    const bmi = +(weight / ((height / 100) ** 2)).toFixed(2)
    const leanMass = weight * (1 - bodyFat / 100)
    const bmr = +(370 + 21.6 * leanMass).toFixed(2)
    const tdee = +(bmr * activityMultiplier[activityLevel]).toFixed(2)
    const recommendedCalories = Math.round(tdee + goalAdjustment[goal])

    const saved = await prisma.analysis.create({
      data: {
        age,
        weight,
        height,
        bodyFat,
        gender,
        activityLevel,
        goal,
        bmi,
        bmr,
        tdee,
        recommendedCalories,
      },
    })

    return c.json({
      id: saved.id,
      bmi,
      bmr,
      tdee,
      recommendedCalories,
      createdAt: saved.createdAt.toISOString(),
    })
  }
)

export default app
