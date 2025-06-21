import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { prisma } from '../lib/prisma.js'

const recommendation = new OpenAPIHono()

type Goal = 'lose' | 'maintain' | 'gain'

function generateMeals(calories: number) {
  const mealPool = [
    { name: 'Oats with banana', calories: 350 },
    { name: 'Grilled chicken & veggies', calories: 500 },
    { name: 'Paneer wrap', calories: 450 },
    { name: 'Eggs and toast', calories: 400 },
    { name: 'Quinoa salad', calories: 300 },
    { name: 'Rice & dal', calories: 500 },
    { name: 'Protein shake with almonds', calories: 350 }
  ]

  const result: typeof mealPool = []
  let total = 0

  while (total < calories && result.length < 5) {
    const item = mealPool[Math.floor(Math.random() * mealPool.length)]
    if (total + item.calories <= calories + 100) {
      result.push(item)
      total += item.calories
    } else {
      break
    }
  }

  return result
}

const recommendationRoute = createRoute({
  method: 'get',
  path: '/:id',
  request: {
    params: z.object({
      id: z.string().openapi({
        param: {
          name: 'id',
          in: 'path'
        },
        example: '4'
      })
    })
  },
  responses: {
    200: {
      description: 'Recommended meal & workout plan',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number(),
            analysisId: z.number(),
            meals: z.array(z.object({
              name: z.string(),
              calories: z.number()
            })),
            workouts: z.array(z.string()),
            proteinGrams: z.number(),
            fatGrams: z.number(),
            carbGrams: z.number()
          })
        }
      }
    },
    400: {
      description: 'Invalid ID or goal'
    },
    404: {
      description: 'Analysis not found'
    }
  }
})

recommendation.openapi(recommendationRoute, async (c) => {
  const id = Number(c.req.param('id'))
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400)

  const analysis = await prisma.analysis.findUnique({ where: { id } })
  if (!analysis) return c.json({ error: 'Analysis not found' }, 404)

  const { recommendedCalories, goal, weight } = analysis

  const validGoals: Goal[] = ['lose', 'maintain', 'gain']
  if (!validGoals.includes(goal as Goal)) {
    return c.json({ error: 'Invalid goal in analysis' }, 400)
  }

  const safeGoal = goal as Goal
  const proteinGrams = Math.round(weight * (safeGoal === 'gain' ? 2 : 1.6))
  const fatGrams = Math.round((recommendedCalories * 0.25) / 9)
  const proteinCalories = proteinGrams * 4
  const fatCalories = fatGrams * 9
  const carbCalories = recommendedCalories - (proteinCalories + fatCalories)
  const carbGrams = Math.round(carbCalories / 4)

  const mealPlan = generateMeals(recommendedCalories)
  const workouts: Record<Goal, string[]> = {
    lose: ['HIIT (30 min)', 'Brisk walk', 'Cycling'],
    maintain: ['Jogging', 'Strength & flexibility', 'Yoga'],
    gain: ['Heavy weightlifting', 'Split workouts (push/pull)', 'Progressive overload']
  }

  const recommendation = await prisma.recommendation.upsert({
    where: { analysisId: id },
    update: {
      meals: mealPlan,
      workouts: workouts[safeGoal],
      proteinGrams,
      fatGrams,
      carbGrams
    },
    create: {
      analysisId: id,
      meals: mealPlan,
      workouts: workouts[safeGoal],
      proteinGrams,
      fatGrams,
      carbGrams
    }
  })

  return c.json(recommendation)
})

export default recommendation
