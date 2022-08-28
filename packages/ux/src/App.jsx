import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import schema from '../../api/endpoints/calculate.schema.json'

import FormField from './components/FormField'

const amortizationPeriodOptions = (() => {
  const {
    minimum,
    maximum,
    multipleOf
  } = schema.properties.amoritizationPeriod
  const options = []
  let duration = minimum
  while (duration <= maximum) {
    options.push({
      value: duration,
      label: `${duration} years`
    })
    duration += multipleOf
  }
  return options
})()

function calculateMinimumDownpayment (propertyPrice) {
  const price = parseInt(propertyPrice) * 0.05
  if (Number.isNaN(price) || price < schema.properties.downPayment.minimum) {
    return schema.properties.downPayment.minimum
  } else {
    return price
  }
}

const App = () => {
  const [propertyPrice, setPropertyPrice] = React.useState(500000)
  const [downPayment, setDownPayment] = React.useState(120000)
  const [interestRate, setInterestRate] = React.useState(5)
  const [amoritizationPeriod, setAmoritizationPeriod] = React.useState(5)
  const [paymentSchedule, setPaymentSchedule] = React.useState(schema.properties.paymentSchedule.enum[0])
  const [disabled, setDisabled] = React.useState(false)
  const [statusMsg, setStatusMsg] = React.useState(null)
  const submit = e => {
    e.preventDefault()
    // construct the payload
    const payload = {
      version: schema.version,
      propertyPrice: parseInt(propertyPrice),
      downPayment: parseInt(downPayment),
      annualInterestRate: parseFloat(interestRate) / 100,
      amoritizationPeriod: parseInt(amoritizationPeriod),
      paymentSchedule
    }
    // disable the form, make the request
    setDisabled(true)
    fetch('/rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then((response) => response.json())
      .then((data) => {
        setStatusMsg(`Monthly Payment: $${Math.floor(data.payment * 100) / 100}`)
      })
      .catch((error) => {
        console.error(error)
        setStatusMsg('Error fetching payment information - see console for details')
      })
      .then(() => {
        setDisabled(false)
      })
  }
  return (
    <form id='mortgage-payment' onSubmit={submit}>
      <FormField.Input
        id='mortgage-payment__propertyPrice'
        label={schema.properties.propertyPrice.title}
        type='number'
        required
        disabled={disabled}
        onInput={e => setPropertyPrice(e.target.value)}
        value={propertyPrice}
        min={schema.properties.propertyPrice.minimum}
        validationMessage={schema.properties.propertyPrice.$comment}
      />
      <FormField.Input
        id='mortgage-payment__downPayment'
        label={schema.properties.downPayment.title}
        type='number'
        required
        disabled={disabled}
        onInput={e => setDownPayment(e.target.value)}
        value={downPayment}
        min={calculateMinimumDownpayment(propertyPrice)}
        max={propertyPrice}
        validationMessage={schema.properties.downPayment.$comment}
      />
      <FormField.Input
        id='mortgage-payment__interestRate'
        label={schema.properties.annualInterestRate.title}
        type='number'
        required
        disabled={disabled}
        onInput={e => setInterestRate(e.target.value)}
        value={interestRate}
        step={schema.properties.annualInterestRate.minimum}
        min={schema.properties.annualInterestRate.minimum * 100}
        max={schema.properties.annualInterestRate.maximum * 100}
        validationMessage={schema.properties.annualInterestRate.$comment}
      />
      <FormField.Select
        id='mortgage-payment__amoritizationPeriod'
        label={schema.properties.amoritizationPeriod.title}
        disabled={disabled}
        options={amortizationPeriodOptions}
        onInput={e => setAmoritizationPeriod(e.target.value)}
        value={amoritizationPeriod}
      />
      <FormField.Select
        id='mortgage-payment__paymentSchedule'
        label={schema.properties.paymentSchedule.title}
        disabled={disabled}
        onInput={e => setPaymentSchedule(e.target.value)}
        value={paymentSchedule}
        options={schema.properties.paymentSchedule.enum}
      />
      <div className='form-submit'>
        <button type='submit' id='mortgage-payment__submit'>Submit</button>
      </div>
      {statusMsg != null && (
        <p id='status-message'>{statusMsg}</p>
      )}
    </form>
  )
}

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<App />)
