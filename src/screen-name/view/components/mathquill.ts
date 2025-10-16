import { DOM } from "scenerystack";
import { SimModel } from "../../model/SimModel";

// Add a global declaration for MathQuill on the window object
declare global {
  interface Window {
    MathQuill: any;
  }
}

export default class EquationInput extends DOM {
  model: SimModel;
  property: any;
  mathDiv: HTMLElement;
  mathField: any;
  constructor(
    item: HTMLElement,
    id: any,
    parentDomElement: any,
    property: any,
    model: SimModel,
    options = {},
  ) {
    const mathDiv = item;
    mathDiv.id = id;
    parentDomElement.appendChild(mathDiv);
    mathDiv.style.width = "13rem";
    mathDiv.style.height = "3rem";
    mathDiv.style.backgroundColor = "white";
    super(item, { allowInput: true });

    this.model = model;
    this.property = property;
    this.mathDiv = mathDiv;

    const MQ = window.MathQuill.getInterface(2);
    // Set width if provided
    const mathField = MQ.MathField(mathDiv, {
      spaceBehavesLikeTab: true,
      handlers: {
        edit: () => {
          const latex = mathField.latex().trim();
          
          let hasError = false;
          let errorMsg = "";
          mathDiv.style.backgroundColor = "white";

          // Define variable substitutions
          type VariableKey =
            | "q"
            | "m"
            | "\\E_x"
            | "\\E_y"
            | "\\E_z"
            | "\\B_x"
            | "\\B_y"
            | "\\B_z"
            | "\\v0x"
            | "\\v0y"
            | "\\v0z";

          const variableMap: Record<string, number> = {
            q: model.qproperty.value,
            m: model.massProperty.value,
            "\\E_x": model.e0xProperty.value,
            "\\E_y": model.e0yProperty.value,
            "\\E_z": model.e0zProperty.value,
            "\\B_x": model.b0xProperty.value,
            "\\B_y": model.b0yProperty.value,
            "\\B_z": model.b0zProperty.value,
            "\\v0x": model.v0xProperty.value,
            "\\v0y": model.v0yProperty.value,
            "\\v0z": model.v0zProperty.value,
          };
          // console.log(variableMap);

          // Sort longer keys first to avoid premature replacements
          const sortedKeys = Object.keys(variableMap).sort(
            (a, b) => b.length - a.length,
          ) as VariableKey[];

          let parsedLatex = latex;
          for (const key of sortedKeys) {
            const value = variableMap[key];
            // Escape backslashes
            const escapedKey = key.replace(/\\/g, "\\\\");
            // Match only exact expressions (not part of another command)
            const regex = new RegExp(escapedKey + "(?![a-zA-Z_0-9])", "g");
            parsedLatex = parsedLatex.replace(regex, value.toString());
            // console.log(parsedLatex)
          }

          if (property && property.value !== undefined) {
            property.value = parsedLatex;
          }
        },
      },
    });
    this.mathField = mathField;
    if (this.property && this.property.value) {
      this.updateText(this.property.value);
    }
  }
  

  updateText(newLatex: any) {
    if (this.mathField) {
      // Set the raw LaTeX for display only
      this.mathField.latex(newLatex);
      // Do NOT set this.property.value here!
    }
  }

  updatePropertyFromField(q, m, ex, ey, ez, bx, by, bz, vx, vy, vz) {
    const latex = this.mathField.latex().trim();
    const variableMap = {
      "\\v_x": vx,
      "\\v_y": vy,
      "\\v_z": vz,
      q: q,
      m: m,
      "\\E_x": ex,
      "\\E_y": ey,
      "\\E_z": ez,
      "\\B_x": bx,
      "\\B_y": by,
      "\\B_z": bz,
      // "\\v_x": this.model.v0x,
      // "\\v_y": this.model.v0y,
      // "\\v_z": this.model.v0z,
      // q: this.model.q,
      // m: this.model.mass,
      // "\\E_x": this.model.e0x,
      // "\\E_y": this.model.e0y,
      // "\\E_z": this.model.e0z,
      // "\\B_x": this.model.b0x,
      // "\\B_y": this.model.b0y,
      // "\\B_z": this.model.b0z,
     
    };
 
    type VariableKey =
      | "\\v_x"
      | "\\v_y"
      | "\\v_z"
      | "q"
      | "m"
      | "\\E_x"
      | "\\E_y"
      | "\\E_z"
      | "\\B_x"
      | "\\B_y"
      | "\\B_z";
    const sortedKeys = Object.keys(variableMap).sort(
      (a, b) => b.length - a.length,
    ) as VariableKey[];
    let parsedLatex = latex;
    for (const key of sortedKeys) {
      const value = variableMap[key];
      const escapedKey = key.replace(/\\/g, "\\\\");
      const regex = new RegExp(escapedKey + "(?![a-zA-Z_0-9])", "g");
      parsedLatex = parsedLatex.replace(regex, value.toString());
    }
    if (this.property && this.property.value !== undefined) {
      this.property.value = parsedLatex;
      // console.log('EquationInput updated:', parsedLatex);
    }
  }
}
