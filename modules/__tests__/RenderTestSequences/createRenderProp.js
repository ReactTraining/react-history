export default (steps, done) => {
  let index = 0

  return (...args) => {
    let value
    try {
      const nextStep = steps[index++]

      if (!nextStep)
        throw new Error('Test is missing step ' + index)

      value = nextStep(...args)

      if (index === steps.length)
        done()
    } catch (error) {
      done(error)
    }

    return value
  }
}
