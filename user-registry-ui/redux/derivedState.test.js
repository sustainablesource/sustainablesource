import { derivedState } from './derivedState'

const state = { value: 40 }
const select = state => state.value
const derive = value => value + 2

it('derives a value from selected redux state', () => {
  const getDerivedState = derivedState(select, derive)
  expect(getDerivedState(state)).toBe(42)
})

it('remembers a derived value', () => {
  const getRandomState = derivedState(select, Math.random)
  expect(getRandomState(state)).toEqual(getRandomState(state))
})

it('derives a new value when selected redux state changes', () => {
  const getDerivedState = derivedState(select, derive)
  expect(getDerivedState({ value: 39 })).toBe(41)
  expect(getDerivedState({ value: 40 })).toBe(42)
})

it('supplies dispatch to derivation function', () => {
  const dispatch = jest.fn()
  const getDerivedState = derivedState(select, (_, dispatch) => dispatch())
  getDerivedState(state, dispatch)
  expect(dispatch).toBeCalled()
})
