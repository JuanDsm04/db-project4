import { useState, useEffect } from 'react'
import { Header } from '../../Headers/Header'
import { SubHeader } from '../../Headers/SubHeader'
import { Table } from '../../Table/Table'
import './viewDishes.css'

export const ViewDishes = () => {
    const [dishesData, setDishesData] = useState([])
    /* ejemplo
    useEffect(() => {
    fetch('http://localhost:8000/dishesInfo')
        .then(res => res.json())
        .then(data => setDishesData(data))
        .catch(console.error);
    }, []);
    */

    useEffect(() => {
        fetch('http://localhost:8000/dishesInfo')
        .then(res => res.json())
        .then(data => {
            // Filtrar los duplicados basados en el campo 'name'
            const seen = new Set();
            const uniqueDishes = data.filter(dish => {
            if (seen.has(dish.name)) {
                return false; // Si ya vimos este nombre, no lo mostramos
            } else {
                seen.add(dish.name); // Si no lo hemos visto, lo añadimos al set y lo mostramos
                return true;
            }
            });
            setDishesData(uniqueDishes); // Guardar los datos filtrados
        })
        .catch(console.error);
    }, []);

    const columnasA = [
    { key: 'name', titulo: 'id' },
    { key: 'preparation_minutes', titulo: 'id' },
    { key: 'location', titulo: 'id' },
    { key: 'ingredient', titulo: 'id' },
    { key: 'category', titulo: 'Club' },
    { key: 'description', titulo: 'Decripción' },
    { key: 'type', titulo: 'Nombre' },
    { key: 'base_price', titulo: 'Puesto Club' },
    { key: 'current_price', titulo: 'Puesto Club' },
    { key: 'quantity', titulo: 'Estado en el club' },
    { key: 'unit_measure', titulo: 'Puesto Club' },
  ]

    const columnas = [
        { key: 'name', titulo: 'Nombre platillo' },
        { key: 'description', titulo: 'Descripción' },
        { key: 'category', titulo: 'Categoría' },
        { key: 'type', titulo: 'Tipo de plato' },
        { key: 'location', titulo: 'Local Disponible' },
        { key: 'preparation_minutes', titulo: 'Tiempo de receta (min)' },
        { key: 'base_price', titulo: 'Precio base' },
        { key: 'current_price', titulo: 'Precio actual' },
        { key: 'showMore', titulo: 'Mostrar más' },
    
    ]


    return(
        <section className='viewDishesStyle'>
            <Table nameColumns= {columnas} data={dishesData} ></Table>
        </section>
    )
}