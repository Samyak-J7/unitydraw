export const handleKeyPress = (event) => {
    switch (event.code) {
        case "Digit1":
          const button0 = document.querySelector('button[name="Panning"]');
          button0.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;
        case "Digit2":
          const button1 = document.querySelector('button[name="Selector"]');
          button1.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;
        case "Digit3":
          const button2 = document.querySelector('button[name="Circle"]');
          button2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;
        case "Digit4":
          const button3 = document.querySelector('button[name="Rectangle"]');
          button3.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;
        case "Digit5":
          const button4 = document.querySelector('button[name="Line"]');
          button4.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;
        case "Digit6":
          const button5 = document.querySelector('button[name="Text"]');
          button5.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;
        case "Digit7":
          const button6 = document.querySelector('button[name="Paintbrush"]');
          button6.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;
        case "Digit8":
          const button7 = document.querySelector('button[name="Image"]');
          button7.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;
        case "Digit9":
          const button8 = document.querySelector('button[name="Eraser"]');
          button8.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;
        case "Digit0":
          const button9 = document.querySelector('button[name="ClearAll"]');
          button9.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          break;        
        }
        
  };