export const generateMeals = (calories: number) => {
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
