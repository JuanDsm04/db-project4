import './navigation.css'

export const Navigation = ({
    text,
    onClick
}) => {
    return (
        <button 
        className='navigationButton'
        onClick = {onClick}
        >
            {text}
        </button>
    )
}