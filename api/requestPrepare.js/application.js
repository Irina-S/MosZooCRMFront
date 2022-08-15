export default (params) => {
  const formData = new FormData()

  Object.entries(params).map(([name, value]) => {
    if (value === null) {
      value = ''
    }
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (!value[i]) {
          continue
        }
        if (value[i] instanceof Blob) {
          formData.append(`${name}[]`, value[i], value[i].name)
        } else {
          formData.append(`${name}[]`, value[i])
        }
      }
    } else if (name.includes('files.')) {
      if (!value?.name) {
        formData.append(`${name.slice(0, -2)}[]`, value)
      } else {
        formData.append(`${name.slice(0, -2)}[]`, value, value.name)
      }
    } else if (typeof value === 'boolean') {
      formData.append(name, 0 + value)
    } else {
      formData.append(name, value)
    }
    return value
  })

  return formData
}
