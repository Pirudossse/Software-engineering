import { describe, it, expect, vi } from 'vitest'
import { errorHandler } from '../src/utils/errorHandler.js'

const fakeRes = () => {
  const res = {}
  res.status = vi.fn(() => res)
  res.json = vi.fn(() => res)
  return res
}

describe('errorHandler', () => {
  it('uses the status of the error when it has one', () => {
    const res = fakeRes()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    errorHandler({ status: 404, message: 'Not found' }, {}, res, () => {})
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' })
  })

  it('returns 500 by default', () => {
    const res = fakeRes()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    errorHandler({}, {}, res, () => {})
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
  })
})
