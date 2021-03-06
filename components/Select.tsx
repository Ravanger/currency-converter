import { ChangeEvent } from "react"

type SelectProps = {
  name: string
  id?: string
  value: string | undefined
  currencynamesarray: [string, number][]
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
}

const Select = (props: SelectProps) => {
  return (
    <select
      name={props.name}
      value={props.value}
      onChange={props.onChange}
      id={props.id}
    >
      {props.currencynamesarray &&
        props.currencynamesarray.map((currencyName, index) => (
          <option
            value={currencyName[0]}
            key={index}
            data-value={currencyName[1]}
          >
            {currencyName[0]}
          </option>
        ))}
    </select>
  )
}

export default Select
