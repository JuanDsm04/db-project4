import { Navigation } from '../Buttons/Navigation/Navigation'
import { TitleNavigation } from '../Titles/TitleNavigation'
import './navigationBar.css'

export const NavigationBar = ({
    onSelect
}) => {
    return(
        <nav className="navigationBarStyle">
            <TitleNavigation text = 'Vista de datos'></TitleNavigation>
            <Navigation text = 'Platillos' onClick={() => onSelect('viewDishes')}></Navigation>
            <Navigation text = 'waaa' onClick={() => onSelect('nada')}></Navigation>
            <Navigation text = 'waaa'></Navigation>

            <TitleNavigation text = 'Reportes'></TitleNavigation>
            <Navigation text = 'waaa'></Navigation>
            <Navigation text = 'waaa'></Navigation>
            <Navigation text = 'waaa'></Navigation>

        </nav>
    )
}