module.exports = {
  CountArr(arr, w, h) {
    var count = 0
    for (var i = 0; i < arr.length; i += 4) {
      if (!(arr[i] === 255 && arr[i + 1] === 255 && arr[i + 2] === 255)) {
        count ++
      }
    }
    return count
  }
}