import { Button, Typography } from "@material-ui/core";
import { Colors } from "../../constants/Colors";
import { Fonts } from "../../constants/Fonts";

export default function DefaultButton ( {
    Title = ''
    , OnPress = () => { }
    , ButtonStyle = undefined
    , TextStyle = undefined
} )
{
    return (
        <Button
            style={ ButtonStyle ?? styles.ButtonDefault }
            onClick={ OnPress }>

            <Typography
                style={ TextStyle ?? styles.WhiteBoldText }>{ Title }</Typography>
        </Button>
    )
}

const styles = {
    WhiteBoldText: { fontFamily: Fonts.Primary, fontSize: 14, color: Colors.White, fontWeight: 'bold' }
    , ButtonDefault: { backgroundColor: Colors.Primary, "&:hover": { backgroundColor: Colors.Black, color: Colors.Black } }
}