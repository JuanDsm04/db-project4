import './TableButton.css'

export const TableButton = ({
    text,
    onClick
}) => {
    return (
        <button 
        className='navigationButton2'
        onClick = {onClick}
        >
            {text}
        </button>
    )
}