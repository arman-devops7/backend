// promise way

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).
      catch((err) => next(err))
  }
}

export { asyncHandler }

// try catch way

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn()
//   } catch (err) {
//     res.status(err.code || 500).json({
//       status: false,
//       message: err.message
//     })
//   }
// }
// export { asyncHandler }