import { Container } from "semantic-ui-react"
import CoolNavbar from "./Navbar"

import styles from '../styles/Layout.module.css'
function Layout({ children }) {
    return (
        <>
            <CoolNavbar />
            <Container className={styles.container}>
                { children }
            </Container>
        </>
    )
}

export default Layout