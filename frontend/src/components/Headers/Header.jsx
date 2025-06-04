import './header.css'
import '../Titles/Titles.css'

export const Header = ({titleRestaurant}) => {
    return(
        <header className='headerStyle'>
            <h1>{titleRestaurant}</h1>
        </header>
    )
}