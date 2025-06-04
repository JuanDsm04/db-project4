//Es esta sección se llaman y se definen las pantallas :D

import { SubHeader } from '../Headers/SubHeader'
import './content.css'
import { ViewDishes } from './ViewDishes/ViewDishes'

export const Content = ({
    contentOption
}) => {
    const showSection = (option) => {
        switch (option) {
        case 'viewDishes':
            return (
                <ViewDishes></ViewDishes>
            )
        case 'hola':
            return (
                <button>duedue</button>
            )
        }
    }

    return(
        <div className='divContent'>
        <SubHeader titleSection={'Platillos'}></SubHeader>
       
        <article className='articleStyle'>
            
            {showSection(contentOption)}
        </article>
        </div>
        
    )
}