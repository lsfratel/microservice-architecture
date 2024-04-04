U.isEmpty = function(v) {
  /**
   * Array
   */
  if (Array.isArray(v) && v.length === 0) {
    return true
  }

  /**
   * String
   */
  if (v.constructor === String && v === '') {
    return true
  }

  /**
   * Object
   */
  if (v.constructor === Object && Object.keys(v).length === 0) {
    return true
  }
}
