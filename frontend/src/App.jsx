import { Section } from './components/Section/Section'
import { NavigationBar } from './components/NavigationBar/NavigationBar'
import './App.css'
import { useState } from 'react'

export const App = () => {

  const [section, setSection] = useState([]) 
  
  

  return (
    <div className='appStyle'>
      <NavigationBar onSelect={setSection} />
      <Section content = {section}/>
     
    </div>
  )
}


