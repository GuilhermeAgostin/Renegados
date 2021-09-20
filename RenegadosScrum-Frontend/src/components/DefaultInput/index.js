import { TextField, InputAdornment } from "@material-ui/core";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";
import InputMask from "react-input-mask";

export default function DefaultInput ( {
    Func = () => { }
    , AdornmentText = ''
    , InputMaskText = ''
    , InputLabel = ''
    , InputId = ''
    , InputName = ''
    , InputAutoComplete = ''
    , InputAdornmentPosition = 'start'
    , InputVariant = 'outlined'
    , InputMargin = 'normal'
    , InputRequired = false
    , InputFullWidth = true
    , InputShouldBeMasked = false
    , InputShouldHaveAdornment = false
    , InputValue = undefined
} )
{
    return (

        InputShouldBeMasked
            ?
            <InputMask
                mask={ InputMaskText }
                value={ InputValue }
                onChange={ e => { Func( e.target.value ) }
                } >
                <TextField
                    variant={ InputVariant }
                    margin={ InputMargin }
                    required={ InputRequired }
                    fullWidth={ InputFullWidth }
                    id={ InputId }
                    name={ InputName }
                    autoComplete={ InputAutoComplete }
                    value={ InputValue }
                    label={ InputLabel }
                    InputProps={ InputShouldHaveAdornment ? {
                        startAdornment: <InputAdornment
                            position={ InputAdornmentPosition }>{ AdornmentText }</InputAdornment>
                    } : {} }
                />
            </InputMask >
            : <TextField
                onChange={ e => { Func( e.target.value ) } }
                variant={ InputVariant }
                margin={ InputMargin }
                required={ InputRequired }
                fullWidth={ InputFullWidth }
                id={ InputId }
                name={ InputName }
                autoComplete={ InputAutoComplete }
                value={ InputValue }
                label={ InputLabel }
                InputProps={ InputShouldHaveAdornment ? {
                    startAdornment: <InputAdornment
                        position={ InputAdornmentPosition }>{ AdornmentText }</InputAdornment>
                } : {} }
            />
    )
}

const styles = {
    WhiteBoldText: { fontFamily: Fonts.Primary, fontSize: 14, color: Colors.White, fontWeight: 'bold' }
    , ButtonDefault: { flex: 0, backgroundColor: Colors.Primary, }
}