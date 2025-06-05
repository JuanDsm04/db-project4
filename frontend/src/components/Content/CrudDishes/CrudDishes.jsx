import { Input } from "../../Inputs/Input"
import { Select } from "../../Inputs/Select"
import { useEffect,useState } from "react";


export const CrudDishes = () => {
    const [ingredients, setIngredients] = useState([])
    useEffect(() => {
    fetch('http://localhost:8000/getIngredients')
        .then(res => res.json())
        .then(ingredients => setIngredients(ingredients))
        .catch(console.error);
    }, []);

    const options = [
    "Manzana", "Banana", "Cereza", "Durazno", "Frambuesa", 
    "Mango", "Pera", "Uva", "Kiwi", "Sandía"
  ];
    return (
        <section>
            <Input text='Algo: '></Input>
            <Select text = 'Ingredientes' options={ingredients}></Select>
            
        </section>
    )
}