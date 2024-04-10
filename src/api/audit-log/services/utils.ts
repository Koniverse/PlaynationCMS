const KEY_ADD_FIELD_MANY = ['disconnect', 'connect'];
export function removeAttribute(obj: any) {

  obj.createdBy && delete obj.createdBy;
  obj.createdAt && delete obj.createdAt;
  obj.updatedBy && delete obj.updatedBy;
  obj.updatedAt && delete obj.updatedAt;
  return obj;
}
export function compareValue(a: any, b: any): boolean {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (!compareValue(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }
  // console.log('a', a)
  // console.log('b', b)

  if (typeof a === "number" && typeof b === "object") {
    if (b && !b.id) {
      return false;
    }
    return b && a === b.id;
  }

  if (typeof b === "number" && typeof a === "object") {
    if (a && !a.id) {
      return false;
    }
    return a && a.id === b;
  }
  if (typeof a === "object" && typeof b === "object") {
    if (b && b.hasOwnProperty('__pivot')) {
      return a.id === b.id;
    }
    let addData = false;
    for (const key of KEY_ADD_FIELD_MANY) {
      if (b && b[key]) {
        addData = true;
        if (b[key].length > 0) {
          addData = false;
        }
      }
    }
    return addData;
  }
  return a === b;
}

export function getValues(obj: any): object {
  try {
    const result = JSON.parse(obj);
    if (result) {
      return result;
    }
  } catch (e) {
  }

  if (Array.isArray(obj)) {
    const pivot = obj.some((item) => item.__pivot);
    if (pivot) {
      return obj.map((item) => item.id);
    }
  }
  return obj;
}

export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined || value === '' || value === 'null';
}

export function getFieldHasChanged(obj1: object, obj2: object): object {
  const differentValues: object = {};

  for (const prop in obj2) {
    // console.log('prop', prop);
    // console.log('obj1[prop]', obj1[prop]);
    // console.log('obj2[prop]', obj2[prop]);
    if (!compareValue(obj1[prop], obj2[prop])) {
      const fromData = getValues(obj1[prop]);
      const toData = getValues(obj2[prop]);
      if (!isNullOrUndefined(fromData) || !isNullOrUndefined(toData)) {
        differentValues[prop] = {fromData, toData};
      }
    }
  }
  return differentValues;
}

export function getFieldHasMany(obj) {
  const fields = [];
  for (const prop in obj) {
    const value = obj[prop];
    for (const key of KEY_ADD_FIELD_MANY) {
      if (value && value[key]) {
        fields.push(prop);
      }
    }
  }
  return fields;
}
