import { useState, useEffect } from 'react'
import { Table } from '../../Table/Table'
import '../ViewDishes/viewDishes.css'

export const ViewStaff = () => {
    const [staffData, setStaffData] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/staffInfo')
            .then(res => res.json())
            .then(data => {
                const seen = new Set()
                const uniqueStaff = data.filter(staff => {
                    const identifier = `${staff.name}-${staff.rol}-${staff.date}-${staff.status}-${staff.location}`
                    if (seen.has(identifier)) return false
                    seen.add(identifier)
                    return true
                })
                setStaffData(uniqueStaff)
            })
            .catch(console.error)
    }, [])

    const columnas = [
        { key: 'name', titulo: 'Nombre' },
        { key: 'phone', titulo: 'Teléfono' },
        { key: 'rol', titulo: 'Rol' },
        { key: 'date', titulo: 'Fecha' },
        { key: 'start_time', titulo: 'Hora inicio' },
        { key: 'end_time', titulo: 'Hora fin' },
        { key: 'status', titulo: 'Estado' },
        { key: 'comment', titulo: 'Comentario' },
        { key: 'location', titulo: 'Ubicación' },
    ]

    return (
        <section className='viewDishesStyle'>
            <Table nameColumns={columnas} data={staffData} />
        </section>
    )
}