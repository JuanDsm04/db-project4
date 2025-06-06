import { SubHeader } from '../Headers/SubHeader'
import './content.css'
import { CrudDishes } from './CrudDishes/CrudDishes'
import { ViewDishes } from './ViewDishes/ViewDishes'
import { ViewStaff } from './ViewStaff/ViewStaff'

export const Content = ({ contentOption }) => {
    const getTitle = (option) => {
        switch (option) {
            case 'viewDishes':
                return 'Platillos'
            case 'viewStaff':
                return 'Turnos del personal'
            case 'hola':
                return 'Vista de prueba'
            case 'crudDishes':
                return 'hola?'
            default:
                return 'Platillos'
        }
    }

    const showSection = (option) => {
        switch (option) {
            case 'viewDishes':
                return <ViewDishes />
            case 'viewStaff':
                return <ViewStaff />
            case 'crudDishes':
                return <CrudDishes/>
            default:
                return <ViewDishes />
        }
    }

    return (
        <div className='divContent'>
            <SubHeader titleSection={getTitle(contentOption)} />
        
            <article className='articleStyle'>
                {showSection(contentOption)}
            </article>
        </div>
    )
}