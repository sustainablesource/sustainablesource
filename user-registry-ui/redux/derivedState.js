export const derivedState = (select, derive) => {
  let rememberedInput
  let rememberedResult
  return (state, dispatch) => {
    const input = select(state)
    if (input != rememberedInput) {
      rememberedResult = derive(input, dispatch)
      rememberedInput = input
    }
    return rememberedResult
  }
}
