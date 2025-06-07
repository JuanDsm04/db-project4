import { useState, useEffect } from 'react'
import { Table } from '../../Table/Table'
import './viewDishes.css'
import { CrudDishes } from '../CrudDishes/CrudDishes'

export const ViewDishes = ({onSelect, setSelectedDish}) => {
    const [dishesData, setDishesData] = useState([])
    //const [selectedDish, setSelectedDish] = useState(null)

    
    useEffect(() => {
        fetch('http://localhost:8000/dishesInfo')
            .then(res => res.json())
            .then(data => {
            // Filtrar los duplicados basados en el campo 'name'
            const seen = new Set();
            
            // Filtrar y organizar los datos de los platillos
           const uniqueDishes = data.reduce((acc, dish) => {
            if (!seen.has(dish.name)) {
                seen.add(dish.name);
                acc.push({ ...dish, ingredients: [] });
            }
            const existing = acc.find(d => d.name === dish.name);
            if (dish.ingredient) {
                existing.ingredients.push({
                name: dish.ingredient,
                unit_measure: dish.unit_measure,
                quantity: dish.quantity,
                });
            }
            return acc;
            }, []);


            setDishesData(uniqueDishes); // Guardar los datos filtrados y organizados
            })
            .catch(console.error);
    }, []);


    const handleShowMore = (dish) => {
        console.log('Platillo seleccionado:', dish);

        // Luego pasas el platillo transformado a CrudDishes
        setSelectedDish(dish); 
    };

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
            
            <Table 
                nameColumns= {columnas} 
                data={dishesData.map(dish => ({
                    ...dish,
                    showMore: (
                        <button onClick={() => handleShowMore(dish)}>
                            Mostrar más
                        </button>
                    ),
                }))}
                onShowMore={handleShowMore}
                onSelect = {onSelect}
                showMoreTarget="crudDishes"
            />
        </section>
    )
}