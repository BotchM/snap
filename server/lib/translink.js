import axios from 'axios'
import qs from 'qs'

const debug = require('debug')('snap:server:transit')

const {
  TRANSLINK_API_URL,
  TRANSLINK_API_KEY
} = process.env

const TRANSIT_CACHE_PREFIX_STOP = 'TRANSIT:::STOP:::'

export const getStop = async (stop, cache = null) => {
  const DEBUG_PREFIX = `getStop ${stop}`
  debug(DEBUG_PREFIX)

  if (cache) {
    debug(`${DEBUG_PREFIX}: fetch from cache`)
    try {
      const fromCache = await cache.get(`${TRANSIT_CACHE_PREFIX_STOP}${stop}`)
      if (fromCache) {
        debug(`${DEBUG_PREFIX}: cache hit: ${fromCache}`)
        return JSON.parse(fromCache)
      }
    } catch (e) {
      debug(`${DEBUG_PREFIX}: error fetching stop from cache: %s`, e)
    }
  }

  debug(`${DEBUG_PREFIX}: fetch from API`)
  try {
    const url = `${TRANSLINK_API_URL}/stops/${stop}?apiKey=${TRANSLINK_API_KEY}`
    const stopInfo = await axios.get(url)
    if (cache) {
      debug(`${DEBUG_PREFIX}: caching stop info`)
      cache.setex([`${TRANSIT_CACHE_PREFIX_STOP}${stop}`, 86400, JSON.stringify(stopInfo.data)])
    }
    return stopInfo.data
  } catch(e) {
    debug(`${DEBUG_PREFIX}: error fetching stop from API: %s`, e.response.data)
    throw new Error(e.response.data)
  }
}

export const getEstimatesForStop = async (stop, options = {}) => {
  const DEBUG_PREFIX = `getEstimatesForStop ${stop}`
  debug(DEBUG_PREFIX)
  const params = {
    ...options,
    apiKey: TRANSLINK_API_KEY,
  }

  debug(`${DEBUG_PREFIX}: fetch from API`)
  try {
    const url = `${TRANSLINK_API_URL}/stops/${stop}/estimates`
    const estimatesResp = await axios({
      method: 'get',
      url,
      params,
      transformRequest(data) {
        return qs.stringify(data)
      }
    })
    return estimatesResp.data
  } catch(e) {
    debug(`${DEBUG_PREFIX}: error fetching stop estimates from API: %s`, e.response.data)
    throw new Error(e.response.data)
  }
}

export const getEstimatesForBookmark = async (bookmark, cache = null) => {
  const DEBUG_PREFIX = `getEstimatesForBookmark ${bookmark}`
  debug(DEBUG_PREFIX)
  const { stop, route, destination } = bookmark
  try {
    // get stop information
    const stopInfo = await getStop(stop, cache)
    const stopName = stopInfo.Name

    // get estimates for stop with route
    const stopEstimate = await getEstimatesForStop(stop, { route })
    return {
      ...bookmark,
      stopName,
      onStreet: stopInfo.OnStreet,
      atStreet: stopInfo.AtStreet,
      schedules: stopEstimate[0].Schedules.filter(s => s.Destination === destination)
    }
  } catch (e) {
    throw new Error(e)
  }
}

export const getEstimatesForBookmarks = async (bookmarks, cache = null) => {
  try {
    const estimates = await Promise.all(bookmarks.map(b => getEstimatesForBookmark(b, cache)))
    const buckets = {}
    estimates.forEach(e => {
      const key = `${e.route}:::${e.destination.replace(/ /g, '_')}`
      if (!buckets.hasOwnProperty(key)) {
        buckets[key] = {
          route: e.route,
          destination: e.destination,
          stops: []
        }
      }
      buckets[key].stops.push({
        number: e.stop,
        name: e.stopName,
        onStreet: e.onStreet,
        atStreet: e.atStreet,
        nextArrival: e.schedules[0]
      })
    })
    return buckets
  } catch(e) {
    throw new Error(e)
  }
}
