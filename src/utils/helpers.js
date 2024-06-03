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

export const customStylesDark = {
  zIndex: 0,
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isDisabled ? '#343a40' : '#212529',
    color: '#ffffff',
    borderColor: state.isFocused ? '#80bdff' : '#495057',
    '&:hover': {
      borderColor: 'rgb(82, 82, 94)',
    },
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: '#212529',
    color: '#ffffff',
    border: '1px solid #75747a',
  }),
  singleValue: (baseStyles, state) => ({
    ...baseStyles,
    color: state.isDisabled ? '#dee2e6' : '#ffffff',
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isSelected ? '#52525e' : state.isFocused ? '#52525e' : '#212529',
    color: state.isSelected || state.isFocused ? '#ffffff' : '#ffffff',
    '&:active': {
      backgroundColor: '#007bff',
    },
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: '#6c757d',
  }),
  indicatorSeparator:  (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isDisabled ? '#343a40' : '#212529',
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    color: '#ffffff',
  }),
  multiValue: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: '#52525e',
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    color: 'white',
  }),
  multiValueRemove: (baseStyles) => ({
    ...baseStyles,
    color: 'white',
    ':hover': {
      backgroundColor: '#343a40',
      color: 'white',
    },
  }),
};

export const customStylesLight = {
  zIndex: 0,
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: state.isFocused ? '#80bdff' : '#dee2e6',
    '&:hover': {
      borderColor: '#dee2e6',
    },
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    border: '1px solid #75747a',
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isSelected ? '#e0e0e6' : state.isFocused ? '#e0e0e6' : 'white',
    color: 'black',
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: '#6c757d',
  }),
  indicatorSeparator:  (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isDisabled ? '#f2f2f2' : 'white',
  }),
  multiValue: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: '#e0e0e6',
  }),
  multiValueLabel: (baseStyles) => ({
    ...baseStyles,
    color: 'black',
  }),
  multiValueRemove: (baseStyles) => ({
    ...baseStyles,
    color: 'black',
    ':hover': {
      backgroundColor: '#a8a8ae',
      color: 'black',
    },
  }),
};