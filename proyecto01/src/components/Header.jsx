import React from 'react'
import Filters from './filters'

/* eslint-disable-next-line react/prop-types */
const Header = ( {changeFilters} ) => {
  return (
    <header>
        <Filters onChange={changeFilters}/>
      
    </header>
  )
}

export default Header