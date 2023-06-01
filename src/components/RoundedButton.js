import { Button } from "react-bootstrap"

export default function RoundedButton(props) {
    const primaryColor = '#c1474e'
    const secondaryColor = '#3b3b3b'
    let btnColor = secondaryColor

    const {
        _w='auto',
        _h=20,
        _borderRadius=10, 
        _text='Button', 
        _color='secondary',
        _textColor='white'} = props

    if (_color === 'primary') {
        btnColor = primaryColor
    }

    return (
        <Button size="sm" className="wf-btn d-flex justify-content-center align-items-center" style={{
            borderRadius:_borderRadius,
            background: btnColor,
            color: _textColor,
            border: 0,
            width: _w,
            height: _h,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 2,
            paddingBottom: 2,
        }} block>{_text}</Button>
    )
}