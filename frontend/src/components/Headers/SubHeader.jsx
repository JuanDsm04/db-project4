import './header.css'
import '../Titles/Titles.css'

export const SubHeader = ({titleSection}) => {
    return(
        <header className='subHeaderStyle'>
            <h2 className='subTitle'>{titleSection}</h2>
        </header>
    )
}