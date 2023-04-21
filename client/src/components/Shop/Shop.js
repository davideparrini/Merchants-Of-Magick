import React from 'react'

function Shop(shop) {

  return (
    <div> {shop.map((item) => (
        <div key={item.id} className='itemConteiner'>
            <div className='item'>{item.card}</div>
        </div>
        ))}
    </div>
  )
}

export default Shop