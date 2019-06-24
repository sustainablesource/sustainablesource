import * as index from './index'
import * as main from './main'

it('exports the same items as index.js', () => {
  expect(Object.keys(main)).toEqual(Object.keys(index))
})
