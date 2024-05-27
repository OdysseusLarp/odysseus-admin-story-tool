import { isPlainObject, uniqBy } from "lodash-es";

export const toSelectOptions = (array, key) => {
  if (Array.isArray(array) === false || typeof key !== "string") {
    return {};
  }

  const selectOptions = {};
  uniqBy(array, key).forEach((item) => {
    if (isPlainObject(item) && item[key]) {
      selectOptions[item[key]] = item[key];
    };
  });
  const sortedSelectOptions = Object.fromEntries(Object.entries(selectOptions).sort())
  return sortedSelectOptions;
}
