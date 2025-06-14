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
    const [ingredientOptions, setIngredientOptions] = useState([])
    const [branches, setBranches] = useState([])
    const [errors, setErrors] = useState({});


    const typeOpcion = [
        {key: 'Appetizer' },
        {key: 'Main' },
        {key: 'Dessert' },
        {key: 'Beverage' }
    ]

    const categoryOpcion = [
        {key: 'Salads' },
        {key: 'Pasta' },
        {key: 'Grill' },
        {key: 'Soup' },
        {key: 'Seafood'}
    ]
    
    useEffect(() => {
        setBranches ([
            { id: 1, location: 'Centro Comercial Miraflores, Nivel 3, Zona 11, Ciudad de Guatemala' },
            { id: 2, location: '6a Avenida 7-89, Zona 1, Antigua Guatemala' },
            { id: 3, location: 'Boulevard Los Próceres 25-50, Zona 10, Ciudad de Guatemala' },
            { id: 4, location: 'Centro Comercial Oakland Mall, Nivel 2, Zona 10' },
            { id: 5, location: '5a Calle 12-34, Zona 2, Quetzaltenango' },
            { id: 6, location: 'Carretera a El Salvador, Km 15, Santa Catarina Pinula' },
            { id: 7, location: 'Centro Comercial Portales, Nivel 1, Zona 17' },
            { id: 8, location: '4a Avenida 6-78, Zona 3, Escuintla' },
            { id: 9, location: 'Centro Comercial Pradera Concepción, Zona 7' },
            { id: 10, location: 'Avenida Las Américas 18-90, Zona 13' },
            { id: 11, location: 'Centro Comercial Metro Norte, Nivel 2, Zona 18' },
            { id: 12, location: '7a Calle 3-45, Zona 4, Mixco' },
            { id: 13, location: 'Centro Comercial Galerías Santo Domingo, Zona 10' },
            { id: 14, location: '3a Avenida 8-90, Zona 1, Villa Nueva' },
            { id: 15, location: 'Centro Comercial Naranjo Mall, Zona 4' },
            { id: 16, location: 'Boulevard Vista Hermosa 12-34, Zona 15' },
            { id: 17, location: '5a Avenida 10-20, Zona 2, San Juan Sacatepéquez' },
            { id: 18, location: 'Centro Comercial Majadas, Zona 11' },
            { id: 19, location: 'Avenida Reforma 8-90, Zona 9' },
            { id: 20, location: 'Centro Comercial Tikal Futura, Nivel 3, Zona 11' },
            { id: 21, location: '6a Calle 7-89, Zona 1, Chimaltenango' },
            { id: 22, location: 'Centro Comercial La Pradera, Zona 10' },
            { id: 23, location: '2a Avenida 5-67, Zona 3, Huehuetenango' },
            { id: 24, location: 'Centro Comercial Santa Clara, Zona 7' },
            { id: 25, location: 'Boulevard San Cristóbal 9-87, Zona 8' },
        ])
    }, [])

    const validateFields = () => {
        const newErrors = {};

        if (!name.trim()) newErrors.name = 'El nombre es obligatorio.';
        if (!description.trim()) newErrors.description = 'La descripción es obligatoria.';
        if (!category) newErrors.category = 'La categoría es obligatoria.';
        if (!type) newErrors.type = 'El tipo de platillo es obligatorio.';
        if (!location) newErrors.location = 'La sucursal es obligatoria.';
        if (!preparationMinutes || isNaN(preparationMinutes)) newErrors.preparationMinutes = 'Tiempo de preparación inválido.';
        if (!basePrice || isNaN(basePrice)) newErrors.basePrice = 'Precio base inválido.';
        if (!currentPrice || isNaN(currentPrice)) newErrors.currentPrice = 'Precio actual inválido.';
        if (!ingredients.length || ingredients.some(ing => !ing.name || !ing.quantity || !ing.unit_measure)) {
            newErrors.ingredients = 'Todos los ingredientes deben tener nombre, cantidad y unidad.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

        
    
    

    const getBranchIdByLocation = (location) => {
    // Buscamos el 'location' en el array de branches
        const a = branches.find(branch => branch.location === location)
      
        return a
           // Si se encuentra, devuelve el id, si no, devuelve null
    };

    const handleCategoryChange = (selectedLocation) => {
    // Solo tomar el id de la sucursal seleccionada
        setCategory(selectedLocation.key);        
    };

    const handleTypeChange = (selectedLocation) => {
    // Solo tomar el id de la sucursal seleccionada
        setType(selectedLocation.key);        
    };


    const handleLocationChange = (selectedLocation) => {
    // Solo tomar el id de la sucursal seleccionada
        setLocation(selectedLocation.id);        
    };


    useEffect(() => {
        fetch('http://localhost:8000/getIngredients')
            .then(res => res.json())
            .then(data => setIngredientOptions(data))
            .catch(console.error);
    }, []);


    useEffect(() => {
      
        if (dishData?.ingredients) {
            //Eliminar duplicados si existen
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
            { id: '', name: '', quantity: '', unit_measure: '' }
        ]);
    }

    // Crear un nuevo listado con name, id y las demás propiedades
    const getIdsIngredients = (actualIngredients, optionsIngredientes) => {
        return actualIngredients.map(item => {
            const matched = optionsIngredientes.find(compItem => compItem['name'] === item['name'])
            if (matched) {
                return {
                    ...item,
                    ['id']: matched['id'],
                }
            } else {
                return {
                ...item,
                ['id']: null, // o puedes usar undefined o cualquier valor predeterminado
            };
        }
        })

    }

    const handleEditDish = async () => {
        if (!validateFields()) {
            alert('Por favor corrige los errores antes de continuar.');
            return;
        }

        let editableDish = null
       
        let sendIngredients = getIdsIngredients(ingredients, ingredientOptions)
    

        if (typeof location === "string") {
            const locationid = getBranchIdByLocation(location).id
            console.log('ESTOY EN EL IF',  )
            editableDish = {
                id: dishData.id,  // El ID del platillo que estamos editando
                name,
                description,
                category,
                type,
                preparation_minutes: preparationMinutes,
                base_price: basePrice,
                current_price: [currentPrice],
                ingredients: sendIngredients.map(ingredient => ingredient.id),  // Solo los IDs de los ingredientes
                quantity: sendIngredients.map(ingredient => ingredient.quantity),  // Cantidades de los ingredientes
                branches: [locationid], // Las sucursales (locations) seleccionadas
            }
            
            
            
        } else {

            editableDish = {
                id: dishData.id,  // El ID del platillo que estamos editando
                name,
                description,
                category,
                type,
                preparation_minutes: preparationMinutes,
                base_price: basePrice,
                current_price: [currentPrice],
                ingredients: sendIngredients.map(ingredient => ingredient.id),  // Solo los IDs de los ingredientes
                quantity: sendIngredients.map(ingredient => ingredient.quantity),  // Cantidades de los ingredientes
                branches: [location], // Las sucursales (locations) seleccionadas
            };
        }

        console.log("Datos que se van a enviar al backend:", JSON.stringify(editableDish, null, 2));

        try {
            const response = await fetch(`http://localhost:8000/editDish`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editableDish),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el platillo');
            }

            const data = await response.json();
            console.log('Platillo actualizado:', data);
            alert('Platillo actualizado con éxito');
            
        } catch (error) {
            console.error('Error:', error);
            alert(`Hubo un error al intentar actualizar el platillo: ${error.message}`);
        }
    }




    const handleDeleteDish = async (idDish) => {
        try {
            const response = await fetch(`http://localhost:8000/deleteDish?id_dish=${idDish}`, {
                method: 'DELETE',  // Usamos DELETE para eliminar el platillo
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Verificamos si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error al eliminar el platillo');
            }

            // Procesamos la respuesta si fue exitosa
            const data = await response.json();
            console.log('Respuesta del backend:', data);

            // Aquí puedes actualizar el estado o hacer algo con la respuesta, como eliminar el platillo de la UI
            alert(data.message);  // Mensaje de éxito

        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al intentar eliminar el platillo');
        }
    };

    const handleCreateDish = async () => {
        if (!validateFields()) {
            alert('Por favor corrige los errores antes de continuar.');
            return;
        }

        let sendIngredients = getIdsIngredients(ingredients, ingredientOptions)
        const dish = {
         
            name,
            description,
            category,
            type,
            preparation_minutes: preparationMinutes,
            base_price: basePrice,
            current_price: [currentPrice],
            ingredients: sendIngredients.map(ingredient => ingredient.id),  // Solo los IDs de los ingredientes
            quantity: sendIngredients.map(ingredient => ingredient.quantity),  // Cantidades de los ingredientes
            branches: [location],
            
              // Lista de sucursales seleccionadas
        };
        console.log("Datos que se van a enviar al backend:", JSON.stringify(dish, null, 2));

        try {
            const response = await fetch('http://localhost:8000/newDish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dish),
            });

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('Error al crear el platillo');
            }

            // Procesar la respuesta si fue exitosa
            const data = await response.json();
            console.log('Platillo creado:', data);

            // Aquí puedes manejar lo que sucede después de crear el platillo
            alert('Platillo creado con éxito');
            // Realiza algún otro tipo de actualización si es necesario (por ejemplo, redirigir o limpiar el formulario)

        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al intentar crear el platillo');
        }
    };

    return (
        <section className="sectionStyle">
            <Input text='Nombre del platillo: ' value={name} onChange={(e) => setName(e.target.value)} />
            {errors.name && <span className="error-text">{errors.name}</span>}

            <Input text='Descripción: ' value={description} onChange={(e) => setDescription(e.target.value)} />
            {errors.description && <span className="error-text">{errors.description}</span>}

            <Select 
                    text={'Categoría: '} 
                    options={categoryOpcion}  // Usamos 'ingredientOptions' 
                    valueKey="key" 
                    displayKey="key"
                    value={(category)}
                    onChange={(handleCategoryChange)}  // Usamos 'handleIngredientChange' para gestionar el cambio
            />
            {errors.category && <span className="error-text">{errors.category}</span>}

            <Select 
                    text={'Tipo de plato: '} 
                    options={typeOpcion}  // Usamos 'ingredientOptions' 
                    valueKey="key" 
                    displayKey="key"
                    value={(type)}
                    onChange={(handleTypeChange)}  // Usamos 'handleIngredientChange' para gestionar el cambio
            />
            {errors.type && <span className="error-text">{errors.type}</span>}

           
            <Select 
                    text={'Local Disponible'} 
                    options={branches}  // Usamos 'ingredientOptions' 
                    valueKey="id" 
                    displayKey="location"
                    value={(location)}
                    onChange={(handleLocationChange)}  // Usamos 'handleIngredientChange' para gestionar el cambio
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
            
            <Input text='Tiempo de preparación: ' value={preparationMinutes} onChange={(e) => setPreparationMinutes(e.target.value)} type="number" step="1"  min="0"/>
            {errors.preparationMinutes && <span className="error-text">{errors.preparationMinutes } </span>}

            <Input text='Precio base: ' value={basePrice} onChange={(e) => setBasePrice(e.target.value)} type="number" step="0.01" min="0" />
            {errors.basePrice && <span className="error-text">{errors.basePrice}</span>}

            <Input text='Precio actual: ' value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} type="number" step="0.01" min="0" />
            {errors.currentPrice && <span className="error-text">{errors.currentPrice}</span>}

            
            <TitleForms text={'Listado de ingredientes'}></TitleForms>
            
            {ingredients.length > 0 && ingredients.map((ing, index) => {
                return (
                    <div key={index}>
                        <IngredientsSection
                            text1="Cantidad:"
                            text2="Unidad"
                            text3="Ingrediente"
                            ingredientOptions={ingredientOptions}
                            selectedIngredient={ing}
                            onIngredientChange={(field, value) =>
                                handleIngredientChange(index, field, value)
                                }
                            />
                        </div>
                    );
                })}

                {errors.ingredients && <span className="error-text">{errors.ingredients}</span>}



            {/* Agregar ingrediente */}
            
            <FormButton text="Agregar ingrediente" onClick={handleAddIngredient} />
            
            {isEditMode ? (
                <div className="buttonGroup">
                    {/* Botones para el modo edición */}
                    <FormButton text="Eliminar" onClick={() => handleDeleteDish(dishData.id)} />
                    <FormButton text="Guardar Cambios" onClick={handleEditDish} />
                </div>
            ) : (
                // Botón para el modo creación
                <FormButton text="Crear Platillo" onClick={ handleCreateDish} />
            )}

            
            <TitleForms text={''}></TitleForms>

            
        </section>
    )
}