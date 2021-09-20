
import "font-awesome/css/font-awesome.css";
import { createGlobalStyle } from 'styled-components';


export const GlobalStyle = createGlobalStyle`
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  outline: 0;
}
body, html {
  background: #fff;
  font-family: 'Helvetica Neue', 'Helvetica', Arial, sans-serif;
  text-rendering: optimizeLegibility !important;
  -webkit-font-smoothing: antialiased !important;
  height: 100%;
  width: 100%;
}   
.menu-item {
  padding: 0 40px;
  margin: 5px 10px;
  user-select: none;
  cursor: pointer;
  border: none;
}
.menu-item-wrapper.active {
  border: 1px blue solid;
}
.menu-item.active {
  border: 1px green solid;
}

.scroll-menu-arrow {
  padding: 20px;
  cursor: pointer;
}
#map {
  height: 100%;
}

/* Scroll Bar */
  select__menu-list::-webkit-scrollbar {
  width: 4px;
  height: 0px;
}
select__menu-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}
select__menu-list::-webkit-scrollbar-thumb {
  background: #888;
}
select__menu-list::-webkit-scrollbar-thumb:hover {
  background: #555;

}
::-webkit-scrollbar {
  width: 20px;
}


::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey; 
  border-radius: 10px;
}
 

::-webkit-scrollbar-thumb {
  background: #F26C2E; 
  border-radius: 10px;
}


::-webkit-scrollbar-thumb:hover {
  background: #F26C2E; 
}
`;



export default GlobalStyle