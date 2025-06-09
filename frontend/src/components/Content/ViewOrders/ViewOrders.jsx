import { useState, useEffect } from 'react'
import { Table } from '../../Table/Table'
import { CrudOrders } from '../CrudOrders/CrudOrders'

export const ViewOrders = ({ onSelect, setSelectedOrder }) => {
    const [ordersData, setOrdersData] = useState([])
    
    useEffect(() => {
        fetch('http://localhost:8000/orders')
            .then(res => res.json())
            .then(data => {
                // Organizar los datos de las órdenes
                const organizedOrders = data.reduce((acc, order) => {
                    const existing = acc.find(o => o.order_number === order.order_number);
                    if (!existing) {
                        acc.push({
                            ...order,
                            ingredients: order.ingredient ? [{
                                name: order.ingredient,
                                quantity: order.quantity,
                                price: order.price,
                                unit: order.unit
                            }] : []
                        });
                    } else {
                        if (order.ingredient) {
                            existing.ingredients.push({
                                name: order.ingredient,
                                quantity: order.quantity,
                                price: order.price,
                                unit: order.unit
                            });
                        }
                    }
                    return acc;
                }, []);

                setOrdersData(organizedOrders);
            })
            .catch(console.error);
    }, []);

    const handleShowMore = (order) => {
        console.log('Orden seleccionada:', order);
        setSelectedOrder(order);
    };

    const columns = [
        { key: 'order_number', titulo: 'Número de orden' },
        { key: 'order_date', titulo: 'Fecha' },
        { key: 'status', titulo: 'Estado' },
        { key: 'total_price', titulo: 'Precio total' },
        { key: 'ingredients_count', titulo: 'Ingredientes' },
        { key: 'showMore', titulo: 'Acciones' },
    ];

    return (
        <section className='viewOrdersStyle'>
            <Table 
                nameColumns={columns} 
                data={ordersData.map(order => ({
                    ...order,
                    ingredients_count: order.ingredients?.length || 0,
                    total_price: order.ingredients?.reduce((sum, ing) => sum + (ing.price * ing.quantity), 0) || 0,
                    order_date: new Date(order.order_date).toLocaleString(),
                    showMore: (
                        <button onClick={() => handleShowMore(order)}>
                            Ver detalles
                        </button>
                    ),
                }))}
                onShowMore={handleShowMore}
                onSelect={onSelect}
                showMoreTarget="crudOrders"
            />
        </section>
    )
}