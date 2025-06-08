import { SubHeader } from '../Headers/SubHeader'
import './content.css'
import { CrudDishes } from './CrudDishes/CrudDishes'
import { CrudOrders } from './CrudOrders/CrudOrders'
import { ViewDishes } from './ViewDishes/ViewDishes'
import { ViewStaff } from './ViewStaff/ViewStaff'
import { ViewOrders } from './ViewOrders/ViewOrders'
import { useState } from 'react'

export const Content = ({ contentOption, onSelect }) => {
    const [selectedDish, setSelectedDish] = useState(null)
    const [selectedOrder,setSelectedOrder] = useState(null)

    const showTitle = (option) => {
        switch (option) {
            case 'viewDishes':
                return <SubHeader titleSection={'Platillos'} showButton={true} text={'Añadir Platillo +'} onClick={() => onSelect('newDish')}/>
            case 'viewOrders':
                return <SubHeader titleSection={'Órdenes'} showButton={true} text={'Añadir Orden +'} onClick={() => onSelect('newOrder')}/>
            case 'viewStaff':
                return <SubHeader titleSection={'Turnos del personal'} />
            case 'crudDishes':
                return <SubHeader titleSection={'Ver y editar detalles del platillo'} showButton={true} text={'Regresar'} onClick={() => onSelect('viewDishes')}/>//cambiar onSelect
            case 'crudOrders':
                return <SubHeader titleSection={'Ver y editar detalles de la orden'} showButton={true} text={'Regresar'} onClick={() => onSelect('viewOrders')}/>//cambiar onSelect
            case 'newDish':
                return <SubHeader titleSection={'Crear nuevo platillo'} showButton={true} text={'Regresar'} onClick={() => onSelect('viewDishes')}/>//cambiar onSelect
            case 'newOrder':
                return <SubHeader titleSection={'Crear nueva orden'} showButton={true} text={'Regresar'} onClick={() => onSelect('viewOrders')}/>//cambiar onSelect
            default:
                return <SubHeader titleSection={'Platillos'} showButton={true} text={'Añadir Platillo +'} onClick={() => onSelect('newDish')}/>
        }
    }

    const showSection = (option) => {
        switch (option) {
            case 'viewDishes':
                return <ViewDishes onSelect = {onSelect} setSelectedDish={setSelectedDish}/>
            case 'viewOrders':
                return <ViewOrders onSelect = {onSelect} setSelectedOrder={setSelectedOrder}/>
            case 'viewStaff':
                return <ViewStaff />
            case 'crudDishes':
                return <CrudDishes dishData={selectedDish} isEditMode={true}/>
            case 'crudOrders':
                return <CrudOrders orderData={selectedOrder} isEditMode={true}/>
            case 'newDish':
                return <CrudDishes/>
            case 'newOrder':
                return <CrudOrders/>
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