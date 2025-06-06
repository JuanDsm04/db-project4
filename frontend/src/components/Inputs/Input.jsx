import './Input.css'

export const Input = ({
    text, 
    disabled,
    value,
    onChange,
    type = 'text',
    step,
    min

}) => {
    return (
        <div className='contentInput'>
            <p className='titleInput'> {text} </p>
            <input 
                className='inputStyle' 
                disabled = {disabled}
                value={value}
                onChange={onChange}
                type = {type}
                step = {step}
                min={min}
            >
        </input>
        </div>
    )
}