import { useState, useEffect } from 'react'
import { Table } from '../../Table/Table'
import './viewOrders.css'
import { CrudOrders } from '../CrudOrders/CrudOrders'

export const ViewOrders = ({ onSelect, setSelectedOrder }) => {
    const [ordersData, setOrdersData] = useState([])
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    const statusMap = {
        'Pending': 'Pendiente',
        'Delivered': 'Entregado',
        'Cancelled': 'Cancelado'
    };

    useEffect(() => {
        fetch('http://localhost:8000/orders')
            .then(res => res.json())
            .then(data => {
                const seen = new Set();
                
                const groupedOrders = data.reduce((acc, order) => {
                    if (!seen.has(order.id)) {
                        seen.add(order.id);
                        acc.push({ 
                            ...order,
                            order_date: formatDate(order.order_date),
                            status: statusMap[order.status] || order.status,
                            supplier_name: order.supplier_name || '',
                            ingredients: [] 
                        });
                    }
                    
                    const existing = acc.find(o => o.id === order.id);
                    if (order.ingredient) {
                        existing.ingredients.push({
                            name: order.ingredient,
                            quantity: order.quantity,
                            price: order.price,
                            unit_measure: order.unit_measure
                        });
                    }
                    
                    return acc;
                }, []);

                setOrdersData(groupedOrders);
            })
            .catch(console.error);
    }, []);

    const handleShowMore = (order) => {
        console.log('Orden seleccionada:', order);
        setSelectedOrder(order);
    }

    const columns = [
        { key: 'id', titulo: 'Número de orden' },
        { key: 'order_date', titulo: 'Fecha de orden' },
        { key: 'status', titulo: 'Estado' },
        { key: 'showMore', titulo: 'Acciones' },
    ]

    return (
        <section className='viewOrdersStyle'>
            <Table 
                nameColumns={columns} 
                data={ordersData.map(order => ({
                    ...order,
                    showMore: (
                        <button onClick={() => handleShowMore(order)}>
                            Mostrar más
                        </button>
                    )
                }))}
                onShowMore={handleShowMore}
                onSelect={onSelect}
                showMoreTarget="crudOrders"
            />
        </section>
    )
}