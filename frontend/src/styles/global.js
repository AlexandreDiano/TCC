import { createGlobalStyle } from "styled-components";
import theme from "./theme";
import reset from "./reset.css";
import "react-toastify/dist/ReactToastify.css";
import "react-credit-cards/es/styles-compiled.css";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap');

${reset}

  html, body, #root{
    height:100%;
  }

  body{
    text-rendering: optimizeLegibility !important;
    -webkit-font-smoothing: antialiased !important;
    font-family: 'Open Sans', sans-serif;
    background: ${theme.palette.common.white};
    font-display: 'swap';
    color: ${theme.palette.common.black};
  }

  button{
    cursor: pointer;
    border: 1px solid transparent;
  }

  a{
    text-decoration:none;
  }

  body{

    .text-1{
     font-size: 20px;
     line-height: 26px;
    }
    .text-2{
      font-size: 18px;
     line-height: 26px;
    }
    .text-3{
      font-size: 16px;
     line-height: 24px;
    }
    .text-4{
      font-size: 14px;
     line-height: 22px;
    }
    .text-5{
      font-size: 12px;
     line-height: 16px;
    }
    .text-6{
      font-size: 10px;
     line-height: 16px;
    }
    .text-action{
      font-size: 16px ;
      letter-spacing: 1.5px;
      line-height: 16px ;
      text-transform: uppercase;
    }
  }


  .MuiDialog-scrollPaper{
    @media (max-width: ${theme.breakpoints.values.sm}px) {
      align-items: flex-end
    }
  }

  .rccs__name {
    font-family: 'Open Sans', sans-serif;
    width: 160px;
    font-size:14px;
  }

  .mt25{
    margin-top: 25px;
  }
  .mt4{
    margin-top: 40px;
  }
`;

export default GlobalStyle;
