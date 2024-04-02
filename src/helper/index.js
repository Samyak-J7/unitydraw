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

export const createFabricObject = (obj) => {
    switch (obj.type) {
        case 'path':
            return new fabric.Path(obj.path, { ...obj });
        case 'line':
            return new fabric.Line([obj.x1, obj.y1, obj.x2, obj.y2], { ...obj });
        case 'textbox':
            return new fabric.Textbox(obj.text, { ...obj });
        case 'image':
            return new fabric.Image.fromURL(obj.src, img => img.set({ ...obj }));
        case 'circle':
            return new fabric.Circle({ ...obj });
        case 'rect':
            return new fabric.Rect({ ...obj });
        case 'group':
            return new fabric.Group(obj.objects.map(createFabricObject), { ...obj });
        default:
            return null;
    }
}

export const addObj = (newObject , editor) => {switch (newObject.type) {
  case "circle":
    editor.canvas.add( new fabric.Circle({...newObject}));
    break
  case "rect":
    editor.canvas.add( new fabric.Rect({...newObject}));
    break
  case "path":
    editor.canvas.add( new fabric.Path(`${newObject.path}`, { ...newObject }));
    break
  case "line":
    editor.canvas.add( new fabric.Line([newObject.x1, newObject.y1, newObject.x2, newObject.y2], { ...newObject }));
    break
  case "textbox":
    editor.canvas.add( new fabric.Textbox(newObject.text, { ...newObject }));
    break
  case "image":
    fabric.Image.fromURL(newObject.src, (img) => {img.set({ ...newObject }); editor.canvas.add(img)});
    break
  case "group":            
    const group = new fabric.Group(newObject.objects.map(createFabricObject).filter(obj => obj), { ...newObject });            
    editor.canvas.add(group);
}
}