import * as React from 'react'

export function Input ({
  id,
  label,
  validationMessage,
  ...rest
}) {
  return (
    <div className='form-field'>
      <label htmlFor={id}>{label}</label>
      <input id={id} {...rest} />
      <span className='form-field__requirements'>{validationMessage}</span>
    </div>
  )
}

export function Select ({
  id,
  label,
  options,
  ...rest
}) {
  return (
    <div className='form-field'>
      <label htmlFor={id}>{label}</label>
      <select id={id} {...rest}>
        {options.map((opt, i) => {
          let value = opt
          let label = opt
          if (typeof opt !== 'string') {
            value = opt.value
            label = opt.label
          }
          return (
            <option key={i} value={value}>{label}</option>
          )
        })}
      </select>
    </div>
  )
}

export default {
  Input,
  Select
}
