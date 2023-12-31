import { useForm } from '../../hooks/useForm';
import { useQuery } from '../../hooks/useQuery'
import { firebaseServices } from '../../services/firebase';
import { useContext, useEffect} from 'react'
import { useLocation, useNavigate} from 'react-router-dom'
import { CartContext } from '../../components/context/cart-context'
import Input from '../../components/main/search';
import CartItem from '../../components/main/cart/item';
import Total from '../../components/main/cart/total';
import './styles.css'


const initialState = {
    name : { value: '', error: '', hasError: true, active: false, name: 'name' },
    surname : { value: '', error: '', hasError: true, active: false, name: 'surname' },
    document : { value: '', error: '', hasError: true, active: false, name: 'document' },
    email : { value: '', error: '', hasError: true, active: false, name: 'email' },
    phone : { value: '', error: '', hasError: true, active: false, name: 'phone' },
    address : { value: '', error: '', hasError: true, active: false, name: 'address' },
    postalCode : { value: '', error: '', hasError: true, active: false, name: 'postalCode' },
    isFormValid: false,
}

function Checkout () {
    const [formState, inputHandler, clearInputs, inputFocus, inputBlur] = useForm(initialState)
    const {cart, total, setCart, onAddToCart, onDecreaseItem, onRemoveItem} = useContext(CartContext);
    const { state } = useLocation();
    const navigate = useNavigate();
    let query = useQuery();

    useEffect(() => {
        const cartId = query.get("cartId") 
        
        if(query.get("cartId")) {
            const getCart = async () => {
                const cart = await firebaseServices.getCartById(cartId)
                return cart
            }
            getCart()
                .then((cart) => {
                    setCart(cart.items)
                })
                .catch((error) => {
                    console.log({error})
                })
        }

    }, [query])

    
    const onChange = (event) => {
        const { name, value } = event.target
        inputHandler({ name, value })
    }

    const onFocus = ({ name }) => {
        inputFocus({ name })
    }

    const onBlur = ({ name }) => {
        inputBlur({ name })
    }

    const clearCart = () => {
        setCart([]);
    }

    const onHandlerOrder = async () => {
        const newOrder = {
            buyer: {
                name: formState.name.value,
                surname: formState.surname.value,
                document: formState.document.value,
                email: formState.email.value,
                phone: formState.phone.value,
                address: formState.address.value,
                postalCode: formState.postalCode.value,
            },
            createdAt: new Date(),
            items: cart,
            payment: {
                currency: 'USD',
                method: 'CASH',
                type: 'CASH'
            },
            seller: {
                id: 1,
                name: 'Pedrito',
                phone: '123456789',
                email: 'pedrito@taskmanager.com'
            },
            shipping: {
                deliverDate: new Date() + 7,
                trackingNumber: '123456ff227aa89',
                type: 'DELIVERY'
            },
            total: total
        }

        const orderId = await firebaseServices.createOrder(newOrder)
        await firebaseServices.updateCart(state.cartId)
        clearCart();
        
        return {
            orderId,
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault()
        const { orderId } = await onHandlerOrder();
        clearInputs({ formState })
        window.scrollTo(0, 0);
        navigate('/success-order', { state: { orderId: orderId.id } })
    }

    return (
        <div className='checkoutContainer'>
            <form onSubmit={onSubmit} className='checkoutForm'>
            <h1 className='checkoutTitle'>Checkout</h1>
                <div className='checkoutFormContainer'>
                    <div className='checkoutFormInputGroup'>
                        <Input address
                            placeholder='Pedrito'
                            id='name'
                            name='name'
                            required={true}
                            label='Name'
                            onChange={onChange}
                            onFocus={() => onFocus({ name: 'name'})}
                            onBlur={() => onBlur({ name: 'name'})}
                            active={formState.name.active}
                            error={formState.name.error}
                            hasError={formState.name.hasError}
                            maxLength={40}
                        />
                    </div>
                    <div className='checkoutFormInputGroup'>
                        <Input 
                            placeholder='Perez'
                            id='surname'
                            name='surname'
                            required={true}
                            label='Apellido'
                            onChange={onChange}
                            onFocus={() => onFocus({ name: 'surname'})}
                            onBlur={() => onBlur({ name: 'surname'})}
                            active={formState.surname.active}
                            error={formState.surname.error}
                            hasError={formState.surname.hasError}
                            maxLength={40}
                        />
                    </div>
                    <div className='checkoutFormInputGroup'>
                        <Input 
                            placeholder='123456789'
                            id='document'
                            name='document'
                            required={true}
                            label='Documento de identidad'
                            onChange={onChange}
                            onFocus={() => onFocus({ name: 'document'})}
                            onBlur={() => onBlur({ name: 'document'})}
                            active={formState.document.active}
                            error={formState.document.error}
                            hasError={formState.document.hasError}
                            maxLength={15}
                        />
                    </div>
                    <div className='checkoutFormInputGroup'>
                        <Input 
                            placeholder='ejemplo@dominio.com'
                            id='email'
                            name='email'
                            required={true}
                            label='Email'
                            onChange={onChange}
                            onFocus={() => onFocus({ name: 'email'})}
                            onBlur={() => onBlur({ name: 'email'})}
                            active={formState.email.active}
                            error={formState.email.error}
                            hasError={formState.email.hasError}
                            maxLength={40}
                        />
                    </div>
                    <div className='checkoutFormInputGroup'>
                        <Input 
                            placeholder='+51 1233333'
                            id='phone'
                            name='phone'
                            required={true}
                            label='Telefono'
                            onChange={onChange}
                            onFocus={() => onFocus({ name: 'phone'})}
                            onBlur={() => onBlur({ name: 'phone'})}
                            active={formState.phone.active}
                            error={formState.phone.error}
                            hasError={formState.phone.hasError}
                            maxLength={15}
                        />
                    </div>
                    <div className='checkoutFormInputGroup'>
                        <Input 
                            placeholder='Av Siempre Viva 123, Springfield, USA'
                            id='address'
                            name='address'
                            required={true}
                            label='Dirección'
                            onChange={onChange}
                            onFocus={() => onFocus({ name: 'address'})}
                            onBlur={() => onBlur({ name: 'address'})}
                            active={formState.address.active}
                            error={formState.address.error}
                            hasError={formState.address.hasError}
                            maxLength={80}
                        />
                    </div>
                    <div className='checkoutFormInputGroup'>
                        <Input 
                            placeholder='11123'
                            id='postalCode'
                            name='postalCode'
                            required={true}
                            label='Código postal'
                            onChange={onChange}
                            onFocus={() => onFocus({ name: 'postalCode'})}
                            onBlur={() => onBlur({ name: 'postalCode'})}
                            active={formState.postalCode.active}
                            error={formState.postalCode.error}
                            hasError={formState.postalCode.hasError}
                            maxLength={10}
                        />
                    </div>
                </div>
                <div className='buttonContainer'> 
                    <button disabled={!formState.isFormValid} type='submit' className='butttonCheckout'>Checkout</button>
                </div>
            </form>
            {cart?.length > 0 ? (
                <div className='cartCheckoutContainer'>
                    <h2>Detalle del carrito</h2>
                    {
                        cart.map((product) => (
                            <CartItem key={product.id}{...product} onAddToCart={onAddToCart} onDecreaseItem={onDecreaseItem} onRemoveItem={onRemoveItem} />
                        ))
                    }
                    <Total total={total} />
                </div>
            ) : null}           
        </div>
    )
}

export default Checkout