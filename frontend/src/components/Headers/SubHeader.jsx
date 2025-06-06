import './header.css'
import '../Titles/Titles.css'
import { Navigation } from '../Buttons/Navigation/Navigation'

export const SubHeader = ({
    titleSection,
    showButton,
    text,
    onClick
}) => {
    return(
        <header className='subHeaderStyle'>
            <h2 className='subTitle'>{titleSection}</h2>
            {showButton && (
                <div className='buttonSubtitle'>
                    <Navigation
                        text={text}
                        onClick={onClick}
                    />
                </div>    
                )
                
            }
        </header>
    )
}