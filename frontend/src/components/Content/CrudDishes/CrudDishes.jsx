import { IngredientsSection } from "../../IngredientsSection/IngredientsSection";
import { Input } from "../../Inputs/Input"
import { Select } from "../../Inputs/Select"
import { useEffect,useState } from "react";
import './CrudDishes.css'
import { TitleForms } from "../../Titles/TitleForms";
import { FormButton } from "../../Buttons/FormButton/FormButton";


export const CrudDishes = ({ dishData = null, isEditMode = false }) => {
    const [name, setName] = useState(dishData?.name || ''); 
    const [description, setDescription] = useState(dishData?.description || '');
    const [category, setCategory] = useState(dishData?.category || '');
    const [type, setType] = useState(dishData?.type || '');
    const [location, setLocation] = useState(dishData?.location || '');
    const [preparationMinutes, setPreparationMinutes] = useState(dishData?.preparation_minutes || '');
    const [basePrice, setBasePrice] = useState(dishData?.base_price || '');
    const [currentPrice, setCurrentPrice] = useState(dishData?.current_price || '');
    const [ingredients, setIngredients] = useState( [])
    const [ingredientOptions, setIngredientOptions] = useState([]);
        

    useEffect(() => {
        fetch('http://localhost:8000/getIngredients')
            .then(res => res.json())
            .then(data => setIngredientOptions(data))
            .catch(console.error);
    }, []);


    useEffect(() => {
        if (dishData?.ingredients) {
            // Eliminar duplicados si existen
            const uniqueIngredients = dishData.ingredients.reduce((acc, current) => {
                const isDuplicate = acc.some(item => item.name === current.name && item.unit_measure === current.unit_measure);
                if (!isDuplicate) {
                    acc.push(current);
                }
                return acc;
            }, []);

            setIngredients(uniqueIngredients);  // Actualizamos el estado con ingredientes únicos
        }
    }, [dishData]);


     const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value; 
        setIngredients(updatedIngredients);
    }

    const handleAddIngredient = () => {
        setIngredients([
            ...ingredients,
            { name: '', quantity: '', unit_measure: '' }
        ]);
    }

    const handleSave = () => {
        const dish = {
            name,
            description,
            category,
            type,
            location,
            preparation_minutes: preparationMinutes,
            base_price: basePrice,
            current_price: currentPrice,
            ingredient: ingredients
        }

        if (isEditMode) {
            console.log('Platillo editado:', dish);
        } else {
            console.log('Nuevo platillo creado:', dish);
        }
    }

    

    return (
        <section className="sectionStyle">
            <Input text='Nombre del platillo: ' value={name} onChange={(e) => setName(e.target.value)} />
            <Input text='Descripción: ' value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input text='Categoría: ' value={category} onChange={(e) => setCategory(e.target.value)} />
            <Input text='Tipo de plato: ' value={type} onChange={(e) => setType(e.target.value)} />
            <Input text='Local Disponible: ' value={location} onChange={(e) => setLocation(e.target.value)} />
            <Input text='Tiempo de preparación: ' value={preparationMinutes} onChange={(e) => setPreparationMinutes(e.target.value)} />
            <Input text='Precio base: ' value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
            <Input text='Precio actual: ' value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} />

            
            <TitleForms text={'Listado de ingredientes'}></TitleForms>
            
            {ingredients.length > 0 && ingredients.map((ing, index) => (
            <div key={index}>
                <IngredientsSection
                text1="Cantidad:"
                text2="Unidad"
                text3="Ingrediente"
                ingredientOptions={ingredientOptions}
                selectedIngredient={ing.name}
                onIngredientChange={(field, value) =>
                    handleIngredientChange(index, field, value)
                }
                />
            </div>
            ))}



            {/* Agregar ingrediente */}
            
            <FormButton text="Agregar ingrediente" onClick={handleAddIngredient} />
            


            <FormButton
                text={isEditMode ? 'Guardar Cambios' : 'Crear Platillo'} onClick={handleSave}
            ></FormButton>
            <TitleForms text={''}></TitleForms>

            
        </section>
    )
}