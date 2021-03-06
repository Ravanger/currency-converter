import { useState, ChangeEvent } from "react"
import styled from "@emotion/styled"
import { GetStaticProps } from "next"

import Layout from "@components/Layout"
import Input from "@components/Input"
import Select from "@components/Select"
import SEO from "@components/SEO"

import { fetchLatest } from "@api/latest"

const DivConverterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 0.8rem;

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 1rem 0.25rem 1rem 2.25rem;

    > div {
      flex-direction: row;
      align-items: center;
      border-radius: 0.75rem;
      box-shadow: inset 0.25em 0.25em 0.5em #d1d9e6,
        inset calc(-1 * 0.25em) calc(-1 * 0.25em) 0.5em #ffffff; /* ie */
      box-shadow: inset var(--radius-size) var(--radius-size) var(--blur-size)
          var(--color-shadow),
        inset calc(-1 * var(--radius-size)) calc(-1 * var(--radius-size))
          var(--blur-size) var(--color-hightlight);
      padding: 0.25rem;
      padding-right: 0;
    }
  }

  input,
  select,
  span {
    border: none;
    text-align: left;
    padding: 1em;
    padding-left: 0;
    background: none;
    color: #9567f1;
    color: var(--color-accent);
    font-size: 0.8rem;
  }

  input,
  span {
    padding-left: 1em;
    width: 75%;
    border-right: none;
    border-radius: 0.75rem 0 0 0.75rem;
    line-height: 1.6;
  }

  select {
    width: 100%;
    border: none;
    border-radius: 0.75rem;
    outline: none;
    appearance: none;
    cursor: pointer;
    box-shadow: 0.25em 0.25em 0.5em #d1d9e6,
      calc(-1 * 0.25em) calc(-1 * 0.25em) 0.5em #ffffff; /* ie */
    box-shadow: var(--radius-size) var(--radius-size) var(--blur-size)
        var(--color-shadow),
      calc(-1 * var(--radius-size)) calc(-1 * var(--radius-size))
        var(--blur-size) var(--color-hightlight);
    color: #ffffff;
    padding-right: 0.8rem;
    padding-left: 0.3rem;
    background-color: #9567f1; /* ie */
    background-color: var(--color-accent);

    &::-ms-expand {
      display: none;
    }
  }

  label {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25%;
    min-width: 4em;

    &::after {
      content: "▾";
      font-family: Arial, Helvetica, sans-serif;
      color: #ffffff;
      color: var(--color-hightlight);
      right: 0.2em;
      top: 0.4em;
      font-size: 1.5rem;
      position: absolute;
      pointer-events: none;
    }
  }

  option {
    direction: rtl;
  }

  button {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1.4rem;
    color: #9567f1;
    color: var(--color-accent);
    line-height: 1;
    height: 2rem;
    width: 2rem;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    transition: transform 0.1s;
    outline: none;
    border-radius: 0.75rem;
    box-shadow: 0.25em 0.25em 0.5em #d1d9e6,
      calc(-1 * 0.25em) calc(-1 * 0.25em) 0.5em #ffffff; /* ie */
    box-shadow: var(--radius-size) var(--radius-size) var(--blur-size)
        var(--color-shadow),
      calc(-1 * var(--radius-size)) calc(-1 * var(--radius-size))
        var(--blur-size) var(--color-hightlight);
    margin-right: 1rem;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      box-shadow: inset 0.25em 0.25em 0.5em #d1d9e6,
        inset calc(-1 * 0.25em) calc(-1 * 0.25em) 0.5em #ffffff; /* ie */
      box-shadow: inset var(--radius-size) var(--radius-size) var(--blur-size)
          var(--color-shadow),
        inset calc(-1 * var(--radius-size)) calc(-1 * var(--radius-size))
          var(--blur-size) var(--color-hightlight);
      transform: scale(1);
      transition: transform 0s;
    }
  }

  .topSpanWrapper {
    padding: 0;
  }
`

const PRoundedUp = styled.p`
  text-align: center;
  color: hsla(0, 0%, 0%, 0.6);
`

const FooterBottom = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 1em 0;
  font-size: 0.8rem;
  color: hsla(0, 0%, 0%, 0.6);
`

const formatNumberWithSeperators = (num: number) => {
  return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

const HomePage = ({ ratesData }: any) => {
  type StateTypesValues = {
    convertFromValue: number | string | undefined
    convertToValue: number | string | undefined
  }

  const [stateConvertValues, setStateConvertValues] = useState<
    StateTypesValues
  >({
    convertFromValue: undefined,
    convertToValue: "0.00",
  })

  const [stateFromValueMultiplier, setStateFromValueMultiplier] = useState(1)
  const [stateToValueMultiplier, setStateToValueMultiplier] = useState(1)

  type StateTypesSelections = {
    convertFromCurrency: string | undefined
    convertToCurrency: string | undefined
  }

  const [stateConvertSelections, setStateConvertSelections] = useState<
    StateTypesSelections
  >({
    convertFromCurrency: "EUR",
    convertToCurrency: "EUR",
  })

  const lastUpdatedDate = new Date(ratesData && ratesData.date)

  let currencyNamesArray: [string, number][]
  currencyNamesArray = ratesData && Object.entries(ratesData.rates)
  currencyNamesArray && currencyNamesArray.push([ratesData.base, 1]) //Add base
  currencyNamesArray && currencyNamesArray.sort()

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setStateConvertValues({
      convertFromValue: event.target.value,
      convertToValue: formatNumberWithSeperators(
        Math.round(
          (+event.target.value / stateFromValueMultiplier) *
            stateToValueMultiplier *
            100
        ) / 100
      ),
    })
  }

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setStateConvertSelections({
      ...stateConvertSelections,
      [event.target.name]: event.target.value,
    })

    const valueMultiplierValue =
      event.target.options[event.target.selectedIndex].dataset.value
    const valueMultiplier = valueMultiplierValue ? +valueMultiplierValue : 0

    const convertFromValue = stateConvertValues.convertFromValue
      ? +stateConvertValues.convertFromValue
      : 0

    switch (event.target.name) {
      case "convertFromCurrency":
        setStateFromValueMultiplier(valueMultiplier)
        setStateConvertValues({
          ...stateConvertValues,
          convertToValue: formatNumberWithSeperators(
            (convertFromValue / valueMultiplier) * stateToValueMultiplier
          ),
        })
        break
      case "convertToCurrency":
        setStateToValueMultiplier(valueMultiplier)
        setStateConvertValues({
          ...stateConvertValues,
          convertToValue: formatNumberWithSeperators(
            (convertFromValue / stateFromValueMultiplier) * valueMultiplier
          ),
        })
        break
      default:
        break
    }
  }

  const switchCurrencies = () => {
    const prevFromCurrencySelection = stateConvertSelections.convertFromCurrency
    const prevToCurrencySelection = stateConvertSelections.convertToCurrency
    setStateConvertSelections({
      convertFromCurrency: prevToCurrencySelection,
      convertToCurrency: prevFromCurrencySelection,
    })

    const prevFromMultiplier = stateFromValueMultiplier
    const prevToMultiplier = stateToValueMultiplier
    setStateFromValueMultiplier(prevToMultiplier)
    setStateToValueMultiplier(prevFromMultiplier)

    const convertFromValue = stateConvertValues.convertFromValue
      ? +stateConvertValues.convertFromValue
      : 0

    setStateConvertValues({
      ...stateConvertValues,
      convertToValue: formatNumberWithSeperators(
        Math.round(
          (convertFromValue / prevToMultiplier) * prevFromMultiplier * 100
        ) / 100
      ),
    })
  }

  // Render
  if (!currencyNamesArray || currencyNamesArray.length < 1) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    )
  }

  return (
    <>
      <SEO
        title="Neuconv"
        description="A minimalistic currency converter"
        keywords="Minimalistic,currency,converter,money,exchange,finance"
        author="Boris Rossovsky"
        pageUrl="https://neuconv.ravanger.vercel.app"
        themecolor="#9567f1"
      />
      <Layout>
        <DivConverterWrapper>
          <div>
            <div>
              <span className="topSpanWrapper">
                <Input
                  value={stateConvertValues.convertFromValue}
                  name="convertFromValue"
                  id="convertFromValue"
                  onChange={handleInputChange}
                />
              </span>
              <label>
                <Select
                  name="convertFromCurrency"
                  id="convertFromCurrency"
                  currencynamesarray={currencyNamesArray}
                  value={stateConvertSelections.convertFromCurrency}
                  onChange={handleSelectChange}
                />
              </label>
            </div>
            <div>
              <span>{stateConvertValues.convertToValue}</span>
              <label>
                <Select
                  name="convertToCurrency"
                  id="convertToCurrency"
                  currencynamesarray={currencyNamesArray}
                  value={stateConvertSelections.convertToCurrency}
                  onChange={handleSelectChange}
                />
              </label>
            </div>
          </div>
          <button onClick={switchCurrencies} aria-label="Switch currencies">
            ⇅
          </button>
        </DivConverterWrapper>
        <PRoundedUp>* rounded up to nearest centesimal</PRoundedUp>
      </Layout>
      <FooterBottom>
        <time dateTime={lastUpdatedDate.toISOString()}>
          Last updated: {lastUpdatedDate.toLocaleString()}
        </time>
      </FooterBottom>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const ratesData = await fetchLatest()
  return {
    props: {
      ratesData,
    },
    revalidate: 43200, // 12 hours in seconds
  }
}

export default HomePage
