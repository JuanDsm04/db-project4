import { Content } from "../Content/Content"
import { Header } from "../Headers/Header"
import './section.css'

export const Section = ({
    content
}) => {

    
    return (
        <main className="fullContentStyle">
            <Header titleRestaurant={'Restaurante'}></Header>
            <Content contentOption = {content}> </Content>
        </main>
    )
}