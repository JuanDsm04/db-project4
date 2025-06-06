import './FormButton.css'

export const FormButton = ({
    text,
    onClick
}) => {
    return (
        <button 
        className='formButton'
        onClick = {onClick}
        >
            {text}
        </button>
    )
}