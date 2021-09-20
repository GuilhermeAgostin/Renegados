import { Fonts } from "./Fonts"
import { Colors } from "./Colors"
import { Metrics } from "./Metrics"

const Flex = { flex: 1, display: 'flex', flexDirection: 'column' }
const FlexRow = { flex: 1, display: 'flex', flexDirection: 'row' }
const DefaultPadding = { padding: Metrics.DefaultMargin }
const MediumText = {

    fontSize: '1rem'
    , fontWeight: '700'
    , fontFamily: Fonts.Primary
    , color: Colors.Primary
}
const MediumInfoText = {
    fontSize: '1rem'
    , fontWeight: '700'
    , fontFamily: Fonts.Primary
    , color: Colors.SecondLightGray
}

const TitleText = {
    fontSize: '1.5rem'
    , fontWeight: '700'
    , fontFamily: Fonts.Primary
    , color: Colors.Primary
}

const MediumTitleText = {
    fontSize: '24px'
    , fontWeight: '400'
    , fontFamily: Fonts.Primary
    , color: Colors.Primary
}

const MinTitleText = {
    fontSize: '1.2rem'
    , fontWeight: '700'
    , fontFamily: Fonts.Primary
    , color: Colors.Primary
}

export const DefaultStyles = {
    Flex,
    MediumText,
    FlexRow,
    DefaultPadding,
    TitleText,
    MinTitleText,
    MediumTitleText
}


