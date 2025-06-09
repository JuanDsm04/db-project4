import { IngredientsSectionWithPrice } from "../../IngredientsSection/IngredientsSectionWithPrice";
import { Input } from "../../Inputs/Input"
import { Select } from "../../Inputs/Select"
import { useEffect, useState } from "react";
import './crudOrders.css'
import { TitleForms } from "../../Titles/TitleForms";
import { FormButton } from "../../Buttons/FormButton/FormButton";

export const CrudOrders = ({ orderData = null, isEditMode = false }) => {
    const [orderNumber, setOrderNumber] = useState(orderData?.order_number || '');
    const [status, setStatus] = useState(orderData?.status || '');
    const [ingredients, setIngredients] = useState([]);
    const [ingredientOptions, setIngredientOptions] = useState([]);
    const [errors, setErrors] = useState({});

    const statusOptions = [
        { key: 'pending', value: 'Pendiente' },
        { key: 'in_progress', value: 'En preparación' },
        { key: 'completed', value: 'Completada' },
        { key: 'cancelled', value: 'Cancelada' }
    ];

    useEffect(() => {
        fetch('http://localhost:8000/getIngredients')
            .then(res => res.json())
            .then(data => setIngredientOptions(data))
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (orderData?.ingredients) {
            setIngredients(orderData.ingredients.map(ing => ({
                ...ing,
                price: ing.price || ''
            })));
        }
    }, [orderData]);

    const validateFields = () => {
        const newErrors = {};

        if (!orderNumber || isNaN(orderNumber)) newErrors.orderNumber = 'Número de orden inválido';
        if (!status) newErrors.status = 'El estado es obligatorio';
        if (!ingredients.length || ingredients.some(ing => 
            !ing.name || 
            !ing.quantity || 
            ing.price === '' || 
            isNaN(ing.price)
        )) {
            newErrors.ingredients = 'Todos los ingredientes deben tener nombre, cantidad y precio válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value;
        setIngredients(updatedIngredients);
    };

    const handleAddIngredient = () => {
        setIngredients([
            ...ingredients,
            { name: '', quantity: '', price: '', unit: '' }
        ]);
    };

    const handleRemoveIngredient = (index) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients.splice(index, 1);
        setIngredients(updatedIngredients);
    };

    const handleStatusChange = (selectedStatus) => {
        setStatus(selectedStatus.key);
    };

    const handleCreateOrder = async () => {
    const orderDetails = {
        order_number: parseInt(orderNumber),
        status: status,
        ingredients: ingredients.map(ing => ({
            name: ing.name,
            quantity: parseFloat(ing.quantity),
            price: parseFloat(ing.price)
        }))
    };

    try {
        const response = await fetch('http://localhost:8000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails),
        });

        if (!response.ok) {
            throw new Error('Error al crear la orden');
        }

        const data = await response.json();
        console.log('Orden creada:', data);
        alert('Orden creada con éxito');
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al crear la orden');
    }
};

    const handleUpdateOrder = async () => {
      if (!validateFields()) {
          alert('Por favor corrige los errores antes de continuar.');
          return;
      }

      try {
          const updateMainResponse = await fetch(`http://localhost:8000/orders/main/${orderData.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  status: status
              }),
          });

          if (!updateMainResponse.ok) {
              throw new Error('Error al actualizar el estado de la orden');
          }

          const existingDetails = orderData.ingredients || [];
          for (const detail of existingDetails) {
              const deleteResponse = await fetch(`http://localhost:8000/orders/${detail.id}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });

              if (!deleteResponse.ok) {
                  console.warn(`No se pudo eliminar el detalle con ID ${detail.id}`);
              }
          }

          const bulkCreateResponse = await fetch('http://localhost:8000/orders/bulk', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  order_number: parseInt(orderNumber),
                  ingredients: ingredients.map(ing => ({
                      ingredient: ing.name,
                      quantity: parseFloat(ing.quantity),
                      price: parseFloat(ing.price)
                  }))
              }),
          });

          if (!bulkCreateResponse.ok) {
              throw new Error('Error al actualizar los ingredientes de la orden');
          }

          const updatedOrder = await bulkCreateResponse.json();
          console.log('Orden actualizada:', updatedOrder);
          alert('Orden actualizada con éxito');
          
          return updatedOrder;

      } catch (error) {
          console.error('Error al actualizar la orden:', error);
          alert('Hubo un error al actualizar la orden');
          throw error;
      }
  };

    const handleDeleteOrder = async () => {
        if (!orderData?.id) {
            alert('No se puede eliminar una orden sin ID');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/orders/${orderData.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la orden');
            }

            const data = await response.json();
            console.log('Orden eliminada:', data);
            alert('Orden eliminada con éxito');
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al intentar eliminar la orden');
        }
    };

    return (
        <section className="sectionStyle">
            <Input 
                text='Número de orden: ' 
                value={orderNumber} 
                onChange={(e) => setOrderNumber(e.target.value)} 
                type="number"
                disabled={isEditMode}
            />
            {errors.orderNumber && <span className="error-text">{errors.orderNumber}</span>}

            <Select 
                text={'Estado: '} 
                options={statusOptions}
                valueKey="key"
                displayKey="value"
                value={status}
                onChange={handleStatusChange}
            />
            {errors.status && <span className="error-text">{errors.status}</span>}

            <TitleForms text={'Ingredientes de la orden'} />
            
            {ingredients.length > 0 && ingredients.map((ing, index) => (
                <div key={index} className="ingredient-row">
                    <IngredientsSectionWithPrice
                        text1="Cantidad:"
                        text2="Unidad:"
                        text3="Ingrediente:"
                        text4="Precio:"
                        ingredientOptions={ingredientOptions}
                        selectedIngredient={ing}
                        onIngredientChange={(field, value) => 
                            handleIngredientChange(index, field, value)
                        }
                    />
                    <button 
                        onClick={() => handleRemoveIngredient(index)}
                        className="remove-button"
                    >
                        Eliminar
                    </button>
                </div>
            ))}

            {errors.ingredients && <span className="error-text">{errors.ingredients}</span>}

            <FormButton text="Agregar ingrediente" onClick={handleAddIngredient} />
            
            {isEditMode ? (
                <div className="buttonGroup">
                    <FormButton text="Eliminar" onClick={handleDeleteOrder} />
                    <FormButton text="Guardar Cambios" onClick={handleUpdateOrder} />
                </div>
            ) : (
                <FormButton text="Crear Orden" onClick={handleCreateOrder} />
            )}
        </section>
    )
}