import { Input } from "../Inputs/Input"
import { Select } from "../Inputs/Select"
import { useState, useEffect } from "react"
import './IngredientsSection.css'


export const IngredientsSection = ({
   
    text1,
    text2,
    text3, 
    ingredientOptions,
    selectedIngredient, 
    onIngredientChange
  
}) => {
    const isInput2Editable = false
    const [quantity, setQuantity] = useState("");
    const [unitMeasure, setUnitMeasure] = useState("");
    
    const [localselectedIngredient, setLocalSelectedIngredient] = useState(selectedIngredient);

    useEffect(() => {
        if (selectedIngredient) {
            setLocalSelectedIngredient(selectedIngredient);
            setQuantity(selectedIngredient.quantity || "");
            setUnitMeasure(selectedIngredient.unit_measure || "");
        }
    }, [selectedIngredient]);  

    const handleIngredientChange = (selectedOption) => {
        setLocalSelectedIngredient(selectedOption);
        setUnitMeasure(selectedOption.unit_measure);
        if (onIngredientChange) {
            onIngredientChange('name', selectedOption.name);
            onIngredientChange('unit_measure', selectedOption.unit_measure);
        }
    }

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        // Validación para aceptar solo valores flotantes
        if (value === "" || /^(\d+(\.\d{0,2})?)?$/.test(value)) {
            setQuantity(value); // Actualizamos el valor solo si es válido
            if (onIngredientChange) {
                onIngredientChange('quantity', value); 
            }
        }
    }

    return(
        <div className="ingredientsSectionS">
            <div className="selectI">
                <Select 
                    text={text3} 
                    options={ingredientOptions}  // Usamos 'ingredientOptions' 
                    valueKey="id" 
                    displayKey="name"
                    value={localselectedIngredient}
                    onChange={(e) => handleIngredientChange(e)}  // Usamos 'handleIngredientChange' para gestionar el cambio
                />
            </div>

            <div className="cantidadI">
                <Input 
                    text={text1}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e)}  // Manejo del cambio de cantidad
                    type="number"
                    step="0.01" 
                    min="0"
                />
            </div>

            <div className="cantidadI">
                <Input 
                    text={text2} 
                    disabled={true}
                    value={unitMeasure}
                />
            </div>
        </div>
     
    )
}