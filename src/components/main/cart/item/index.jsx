import './styles.css'

function CartItem({onAddToCart, onDecreaseItem, onRemoveItem, id, image, name, price, quantity, stock }) {

    return (  
        <div className='cartItem'>
            <div className='cardImageContainer'>
                <img className='cardImage' src={image} alt={name} />
            </div>
            <div className='cartContentContainer'>
            <p className='cartProductName'>{name}</p>
                <p className='cartPrice'>USD {price}</p>
                <p className='cartQuantity'>cantidad: {quantity}</p>
                <p className='cartStock'>quedan {stock}</p>
                <div className='cartActions'>
                    <div className='buttonContanier'> 
                        <button onClick={() => onAddToCart(id)} className='cartButttonAdd'>+</button>
                        <button onClick={() => onDecreaseItem(id)} className='cartButttonDecrease'>-</button>
                    </div>
                    <div className='containerCartButtonRemove'>
                        <button onClick={() => onRemoveItem(id)} className='cartButttonRemove'>Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItem;

