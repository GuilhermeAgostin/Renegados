import { Card, CardContent, Typography } from "@material-ui/core"
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import SearchIcon from '@material-ui/icons/Search';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphoneSharp';
import { Fonts } from "../../constants/Fonts";
import { Colors } from "../../constants/Colors";
import ReceiptIcon from '@material-ui/icons/Receipt';
export default function ListEmptyComponent ( { text, color, iconType = 1 , fullViewWidth = false} ) 
{
    return (
        <Card
            style={ fullViewWidth ? styles.FullWidthroot: styles.root }
            variant="outlined">

            <CardContent style={ { alignItems: 'center', display: 'flex', flex: 0, justifyContent: 'flex-start' } }>
                <EmptyIcons color={ color } type={ iconType } />     
                <Typography style={ styles.BlackBoldText }>{ text }</Typography>
            </CardContent>
        </Card>
    )

}

const EmptyIcons = ( { color, type } ) =>
{
    switch ( type )
    {
        case 1: return <DirectionsCarIcon style={ { color: color, marginRight: 5, fontSize: 30 } } />
        case 2: return <SearchIcon style={ { color: color, marginRight: 5, fontSize: 30 } } />
        case 3: return <PhoneIphoneIcon style={ { color: color, marginRight: 5, fontSize: 30 } } />
        case 4: return <ReceiptIcon style={ { color: color, marginRight: 5, fontSize: 30 } } />
    }
}

const styles = {
    root: {
        width: '100%',
        flex: 1,
        display: 'flex'
    }
    ,FullWidthroot: {
        width: '98vw',
        
    }
    , BlackBoldText: {
        fontFamily: Fonts.Primary
        , fontSize: 12
        , color: Colors.Black
        , fontWeight: 'bold'
    }
}