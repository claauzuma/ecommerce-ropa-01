import React from 'react'
import './Filters.css'

const Filters = () => {
  return (
    
    <section className='filters'>


        <div>
            <label htmlFor="price"> Price </label>
            <input type="range"
            id="price"
            min="0"
            max="1000000"/>
        </div>

        
        <div>
            <label htmlFor="category"> Categoria </label>
           <select name="" id="category">
            <option value="all"> Todas</option>
            <option value="laptops">Laptops</option>
            <option value="smartphones">Celulares</option>
           </select>
        </div>







    </section>

  )
}

export default Filters