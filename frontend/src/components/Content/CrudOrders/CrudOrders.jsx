import { Input } from "../../Inputs/Input";
import { Select } from "../../Inputs/Select";
import { useEffect, useState } from "react";
import './crudOrders.css';
import { TitleForms } from "../../Titles/TitleForms";
import { FormButton } from "../../Buttons/FormButton/FormButton";

export const CrudOrders = ({ orderDetailData = null, isEditMode = false }) => {
  const [orderNumber, setOrderNumber] = useState(orderDetailData?.order_number || '');
  const [ingredient, setIngredient] = useState(orderDetailData?.ingredient || '');
  const [quantity, setQuantity] = useState(orderDetailData?.quantity || '');
  const [price, setPrice] = useState(orderDetailData?.price || '');
  const [orders, setOrders] = useState([]);
  const [ingredientOptions, setIngredientOptions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:8000/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(console.error);

    fetch('http://localhost:8000/getIngredients')
      .then(res => res.json())
      .then(data => setIngredientOptions(data))
      .catch(console.error);
  }, []);

  const validateFields = () => {
    const newErrors = {};
    if (!orderNumber) newErrors.orderNumber = 'Número de orden obligatorio.';
    if (!ingredient) newErrors.ingredient = 'Ingrediente obligatorio.';
    if (!quantity || isNaN(quantity)) newErrors.quantity = 'Cantidad inválida.';
    if (!price || isNaN(price)) newErrors.price = 'Precio inválido.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      alert('Corrige los errores antes de continuar.');
      return;
    }

    const payload = { order_number: Number(orderNumber), ingredient, quantity: Number(quantity), price: parseFloat(price) };

    try {
      const url = `http://localhost:8000/orders${isEditMode ? `/${orderDetailData.id}` : ''}`;
      const method = isEditMode ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Error en el servidor');
      alert(isEditMode ? 'Detalle actualizado' : 'Detalle creado');
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Hubo un error: ' + e.message);
    }
  };

  const handleDelete = async () => {
    if (!orderDetailData?.id) return;
    try {
      const res = await fetch(`http://localhost:8000/orders/${orderDetailData.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar');
      alert('Detalle eliminado');
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Error al eliminar: ' + e.message);
    }
  };

  return (
    <section className="sectionStyle">
      <Input text='Número de orden:' value={orderNumber} onChange={e => setOrderNumber(e.target.value)} type="number" />
      {errors.orderNumber && <span className="error-text">{errors.orderNumber}</span>}

      <Select
        text='Ingrediente: '
        options={ingredientOptions.map(i => ({ key: i.name }))}
        valueKey="key" displayKey="key"
        value={ingredient}
        onChange={opt => setIngredient(opt.key)}
      />
      {errors.ingredient && <span className="error-text">{errors.ingredient}</span>}

      <Input text='Cantidad:' value={quantity} onChange={e => setQuantity(e.target.value)} type="number" step="0.01" />
      {errors.quantity && <span className="error-text">{errors.quantity}</span>}

      <Input text='Precio:' value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" />
      {errors.price && <span className="error-text">{errors.price}</span>}

      <div className="buttonGroup">
        {isEditMode ? (
          <>
            <FormButton text="Eliminar" onClick={handleDelete} />
            <FormButton text="Guardar Cambios" onClick={handleSubmit} />
          </>
        ) : (
          <FormButton text="Crear orden" onClick={handleSubmit} />
        )}
      </div>
    </section>
  );
};
