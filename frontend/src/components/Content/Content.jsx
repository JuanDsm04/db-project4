import { SubHeader } from '../Headers/SubHeader'
import './content.css'
import { CrudDishes } from './CrudDishes/CrudDishes'
import { ViewDishes } from './ViewDishes/ViewDishes'
import { ViewStaff } from './ViewStaff/ViewStaff'
import { useState, useEffect } from 'react'

export const Content = ({ contentOption, onSelect }) => {
    const [selectedDish, setSelectedDish] = useState(null)

    const showTitle = (option) => {
        switch (option) {
            case 'viewDishes':
                return <SubHeader titleSection={'Platillos'} showButton={true} text={'Añadir Platillo +'} onClick={() => onSelect('newDish')}/>
            case 'viewStaff':
                return <SubHeader titleSection={'Turnos del personal'} />
            case 'crudDishes':
                return <SubHeader titleSection={'Ver y editar detalles del platillo'} showButton={true} text={'Regresar'} onClick={() => onSelect('viewDishes')}/>//cambiar onSelect
            case 'newDish':
                return <SubHeader titleSection={'Crear nuevo platillo'} showButton={true} text={'Regresar'} onClick={() => onSelect('viewDishes')}/>//cambiar onSelect
            default:
                return <SubHeader titleSection={'Platillos'} showButton={true} text={'Añadir Platillo +'} onClick={() => onSelect('newDish')}/>
        }
    }

    const showSection = (option) => {
        switch (option) {
            case 'viewDishes':
                return <ViewDishes onSelect = {onSelect} setSelectedDish={setSelectedDish}/>
            case 'viewStaff':
                return <ViewStaff />
            case 'crudDishes':
                return <CrudDishes dishData={selectedDish} isEditMode={true}/>
            case 'newDish':
                return <CrudDishes/>
            default:
                return <ViewDishes onSelect = {onSelect} setSelectedDish={setSelectedDish}/>
        }
    }

    
    return (
        <div className='divContent'>
            <div>
                {showTitle(contentOption)}
            </div>
        
            <article className='articleStyle'>
                {showSection(contentOption)}
            </article>
        </div>
    )
}