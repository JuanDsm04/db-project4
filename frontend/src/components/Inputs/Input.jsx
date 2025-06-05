import './Input.css'

export const Input = ({text}) => {
    return (
        <div className='contentInput'>
            <p className='titleInput'> {text} </p>
            <input className='inputStyle'>
        </input>
        </div>
    )
}