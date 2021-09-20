import styled from "styled-components";
import {Colors} from "../../constants/Colors"
import {Fonts} from "../../constants/Fonts"





export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const Form = styled.form`
  width: 35%;
  min-width:300px;
  background: ${Colors.White};
  border-radius:10px;
  padding: 30px;
  display: flex;
  box-shadow: inset 0 0 1em ${Colors.White}, 0 0 1em ${Colors.Primary};
  flex-direction: column;
  align-items: center;
  img {
    width: 100px;
    margin: 10px 0 40px;
  }
  p {
    color: PrimaryColor;
    margin-bottom: 15px;
    border: 1px solid #fff;
    padding: 10px;
    width: 100%;
    font-family: ${Fonts.Primary}, sans-serif;    
  }
  input {
    flex: 1;    
    margin-bottom: 15px;
    //padding: 0 5px 15px 5px;
    background-color: ${Colors.White};
    color: #000;
    font-size: 15px;
    width: 100%;
    font-family: ${Fonts.Primary}, sans-serif;
    
    &::placeholder {
      color: #999;      
      font-family: ${Fonts.Primary}, sans-serif;
    }
  }
  button {
    color:${Colors.White};
    border-color:${Colors.White};
    border-width:1;    
    font-family: ${Fonts.Primary}, sans-serif;
    font-size: 16px;
    background: ${Colors.Black};
    height: 56px;
    border: 0;
    border-radius: 5px;
    width: 100%;
  }
  hr {
    margin: 20px 0;
    border: none;
    border-bottom: 1px solid #cdcdcd;
    width: 100%;
  }
  a {
    font-size: 16;
    font-weight: bold;
    font-family: 'Montserrat', sans-serif;
    color: PrimaryColor;
    text-decoration: none;
  }
`;
