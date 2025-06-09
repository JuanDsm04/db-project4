import { Input } from "../Inputs/Input"
import { Select } from "../Inputs/Select"
import { useState, useEffect } from "react"
import './IngredientsSection.css'

export const IngredientsSectionWithPrice = ({
    text1,
    text2,
    text3,
    text4,
    ingredientOptions,
    selectedIngredient, 
    onIngredientChange
}) => {
    const [quantity, setQuantity] = useState("");
    const [unitMeasure, setUnitMeasure] = useState("");
    const [price, setPrice] = useState("");
    const [localselectedIngredient, setLocalSelectedIngredient] = useState("");

    useEffect(() => {
        if (selectedIngredient) {
            setLocalSelectedIngredient(selectedIngredient.name || "");
            setQuantity(selectedIngredient.quantity || "");
            setUnitMeasure(selectedIngredient.unit_measure || selectedIngredient.unit || "");
            setPrice(selectedIngredient.price || "");
        }
    }, [selectedIngredient]);  

    const handleIngredientChange = (selectedOption) => {
        setLocalSelectedIngredient(selectedOption);
        setUnitMeasure(selectedOption.unit_measure);
        // Si el ingrediente tiene precio, lo establecemos
        if (selectedOption.price) {
            setPrice(selectedOption.price);
            if (onIngredientChange) {
                onIngredientChange('price', selectedOption.price);
            }
        }
        
        if (onIngredientChange) {
            onIngredientChange('name', selectedOption.name);
            onIngredientChange('unit_measure', selectedOption.unit_measure);
        }
    }

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^(\d+(\.\d{0,2})?)?$/.test(value)) {
            setQuantity(value);
            if (onIngredientChange) {
                onIngredientChange('quantity', value); 
            }
        }
    }

    const handlePriceChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^(\d+(\.\d{0,2})?)?$/.test(value)) {
            setPrice(value);
            if (onIngredientChange) {
                onIngredientChange('price', value);
            }
        }
    }

    return(
        <div className="ingredientsSectionS">
            <div className="selectI">
                <Select 
                    text={text3} 
                    options={ingredientOptions}
                    valueKey="name" 
                    displayKey="name"
                    value={localselectedIngredient}
                    onChange={(e) => handleIngredientChange(e)}
                />
            </div>

            <div className="cantidadI">
                <Input 
                    text={text1}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e)}
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

            <div className="cantidadI">
                <Input 
                    text={text4}
                    value={price}
                    onChange={(e) => handlePriceChange(e)}
                    type="number"
                    step="0.01" 
                    min="0"
                />
            </div>
        </div>
    )
}