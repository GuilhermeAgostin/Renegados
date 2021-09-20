import { useEffect } from "react";
import { useState } from "react";

export let isMobile = ( window.innerWidth <= 768 );

export function useMobileListener ()
{
    const [ width, setWidth ] = useState( window.innerWidth )

    function handleWindowSizeChange ()
    {
        setWidth( window.innerWidth )
    }

    useEffect( () =>
    {
        window.addEventListener( 'resize', handleWindowSizeChange )
        return () => { window.removeEventListener( 'resize', handleWindowSizeChange ) }
    }, [] );

    return width <= 768
}
