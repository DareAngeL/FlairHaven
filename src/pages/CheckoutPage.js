/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Button, Col, Form, Row, Stack } from 'react-bootstrap';
import CheckoutItemFragment from '../components/CheckoutItemFragment';
import CCIcon from '@mui/icons-material/CreditCardRounded';
import { Paypal } from '../res/Res';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BackIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useEffect } from 'react';
import { useRef } from 'react';
import Utility from '../util/Utility';
import Loading from '../components/Loading';
import SnackBarAlert from '../components/SnackBarAlert';
import { Alert } from '@mui/material';

const { clearCart, getProductInfo, placeOrder, hasAccess } = require('../Requests').default;

export default function CheckoutPage() {

  const { fromCart, productId } = useParams()

  const navigate = useNavigate()

  const [totalPrice, setTotalPrice] = useState(0)

  const [products, setProducts] = useState([])

  const [cardPaymentSelected, setCardPaymentSelected] = useState(true)
  const [paypalPaymentSelected, setPaypalPaymentSelected] = useState(false)

  const [cc, setCC] = useState('')
  const [ccErr, setCCErr] = useState(false)

  const [exp, setExp] = useState('')
  const [expErr, setExpErr] = useState(false)

  const [cvv, setCVV] = useState(0)
  const [cvvErr, setCvvErr] = useState(false)

  const [haveAgreed, setHaveAgreed] = useState(true)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [isProcessingDone, setIsProcessingDone] = useState(false)
  const [isProcessingFailed, setIsProcessingFailed] = useState(false)
  const [isNoProduct, setIsNoProduct] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  const agreementRef = useRef(null)

  useEffect(() => {

    hasAccess(localStorage.getItem('token')).then(hasAccess => {
      if (!hasAccess) {
        navigate('/error')
      }

      if (fromCart==="true") {
        const cartItems = JSON.parse(localStorage.getItem('cartItems'))
        const sum = cartItems.reduce((accum, currVal) => {
          return accum +  currVal.price;
        }, 0)
  
        setProducts(cartItems)
        setTotalPrice(sum)
        
      } else {
        // if not came from cart
        getProductInfo(productId, localStorage.getItem('token')).then(product => {
          setProducts([product])
          setTotalPrice(product.price)
        })
      }
    })
  }, [])

  const handleOnContinueClick = async () => {

    if (paypalPaymentSelected) {
      if (!agreementRef.current.checked) {
        setHaveAgreed(false)
        return
      }

      await processOrder()
      return
    }

    let hasErrors = false

    // check for errors if card is the selected payment
    if (cc==='' || Utility.isWhiteSpacesOnly(cc)) {
      setCCErr(true)
      hasErrors = true
    }
    if (exp==='' || Utility.isWhiteSpacesOnly(exp)) {
      setExpErr(true)
      hasErrors = true
    }
    if (cvv===0 || Utility.isWhiteSpacesOnly(cvv)) {
      setCvvErr(true)
      hasErrors = true
    }

    if (hasErrors) {
      if (!agreementRef.current.checked) {
        setHaveAgreed(false)
      }
      return
    }

    if (!agreementRef.current.checked) {
      setHaveAgreed(false)
      return
    }

    // succeed here
    await processOrder()
  }

  const processOrder = async () => {
    if (products.length === 0)
      return

    setIsProcessingOrder(true)
    const prods = await placeOrder({
      "products": products.map(prod => {
        return {"productId": prod._id}
      })
    }, localStorage.getItem('token'))

    if (prods || prods.length > 0) {
      let orders = JSON.parse(localStorage.getItem('orders'))
      // if there's existing orders
      if (orders) {
        orders = orders.concat(prods)
      } else {
        // else if no order yet
        orders = prods
      }

      localStorage.setItem('orders', JSON.stringify(orders))

      setIsProcessingFailed(false)
      setIsProcessingDone(true)
      setIsProcessingOrder(false)

      //reset the products
      if (fromCart) {
        localStorage.removeItem('cart')
        localStorage.removeItem('cartItems')
        // clear the cart from the database
        await clearCart(products, localStorage.getItem('token'))
      }
      setProducts([])

      setIsRedirecting(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
      return
    }

    setIsProcessingFailed(true)
    setIsProcessingDone(true)
    setIsProcessingOrder(false)
  }

  const handleOnRemovedItem = (product) => {
    const updatedProds = products.filter(prod => prod._id !== product._id)

    setProducts(updatedProds)

    const newSum = updatedProds.reduce((accum, currVal) => {
      return accum +  currVal.price;
    }, 0)

    setTotalPrice(newSum)
  }

  return (
    <div id="c-root" className="d-flex justify-content-center w-100 p-5">
      <div id="c-container">
        <Stack>
          <div id='c-backbtn' onClick={()=>navigate('/')}>
            <BackIcon/>
          </div>
          <h1 className="fw-bold">Checkout</h1>
          <Alert severity="warning" className="mt-auto fs-6">
            Since this is just a concept website, processing payment is not supported
            <br/>You can still continue to checkout with a mockup card information but no processing payment will be done.
          </Alert>
          {products.map(product => <CheckoutItemFragment key={product._id} product={product} onRemoved={handleOnRemovedItem}/>)}

          <div className="mt-4 d-flex">
            <h2 className="fw-bold">Total USD</h2>
            <h2 className="ms-auto">${totalPrice.toFixed(2)}</h2>
          </div>

          <div>
            <Form className="mt-5">
              <Form.Group controlId="check">
                <Form.Check defaultChecked label="Save payment method"/>
              </Form.Group>
              <Form.Group controlId='payment-selection'>
                <Row id="c-payment-container">
                  <Col 
                    md="6" 
                    className={(cardPaymentSelected) ? 'c-payments payment-selected':'c-payments'} 
                    onClick={()=>{
                      setCardPaymentSelected(true)
                      setPaypalPaymentSelected(false)
                    }}
                  >
                    <div>
                      <CCIcon/>
                      <label className='ms-3'>Card</label>
                    </div>
                  </Col>
                  <Col 
                    md="6" 
                    className={(paypalPaymentSelected) ? 'c-payments payment-selected':'c-payments'}
                    onClick={()=>{
                      setCardPaymentSelected(false)
                      setPaypalPaymentSelected(true)
                    }}
                  >
                    <div>
                      <img width={15} height={18} src={Paypal} alt='pp'/>
                      <label className='ms-3'>PayPal</label>
                    </div>
                  </Col>
                </Row>
              </Form.Group>
              {(cardPaymentSelected) ?
                <Form.Group className='mt-2'>
                  <Form.Control className={(ccErr)?"error":""} type="cred" placeholder="Card Number (**** **** **** ****)" 
                    onChange={(e)=>setCC(e.target.value)}
                    onFocus={(e)=>setCCErr(false)}
                  /> 
                  <Row className='mt-2'>
                    <Col md="6">
                      <Form.Control className={(expErr)?"error":""} type="name" placeholder="Expiration Date (MM/YY)" 
                        onChange={(e)=>setExp(e.target.value)}
                        onFocus={(e)=>setExpErr(false)}
                      />
                    </Col>
                    <Col md="6">
                      <Form.Control className={(cvvErr)?"error":""} type="number" placeholder="CVV (3 Digits)" 
                        onChange={(e)=>setCVV(e.target.value)}
                        onFocus={(e)=>setCvvErr(false)}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                :
                <Form.Group className='mt-2 d-flex justify-content-center'>
                  <Button id="c-paypal-btn" onClick={()=>navigate('/paypal_payment')}>
                    <img width={15} height={18} src={Paypal} alt='pp'/>
                    aypal Checkout
                  </Button>
                </Form.Group>
              }
              <Form.Group controlId='c-license-check'>
                <Form.Check ref={agreementRef} className={(haveAgreed)?'mt-4':'mt-4 error'} label={
                  <span>
                    I have read and agreed to the <Link>License</Link>
                  </span>
                } onChange={(e)=>setHaveAgreed(e.target.value)}
                />
              </Form.Group>
              <Button id='c-continuebtn' className='mt-2' onClick={handleOnContinueClick}>Continue</Button>
            </Form>
          </div>
        </Stack>
      </div>
      {(isProcessingDone)?
        <>
          <SnackBarAlert open={isProcessingFailed?false:true} text="Purchase Successful!" onClose={()=>setIsProcessingDone(false)} />
          <SnackBarAlert open={isProcessingFailed?true:false} severity="error" text="Something went wrong. Can't place your order!" onClose={()=>setIsProcessingDone(false)} />
        </>
        :
        <></>
      }
      <SnackBarAlert open={isNoProduct} severity="error" text="You don't have any products!" onClose={()=>setIsNoProduct(false)} />
      <Loading open={isProcessingOrder} text="Processing order..."/>
      <Loading open={isRedirecting} text="Your order has been processed! Redirecting..."/>
    </div>
  )
}