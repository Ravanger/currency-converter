import { ReactNode } from "react"
import styled from "@emotion/styled"

const MainWrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #ecf0f3; /* ie */
  background: var(--color-bg);
`

type LayoutProps = {
  children: ReactNode
}

const Layout = (props: LayoutProps) => (
  <MainWrapper>{props.children}</MainWrapper>
)

export default Layout
