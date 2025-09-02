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
            | "e0x"
            | "e0y"
            | "e0z"
            | "b0x"
            | "b0y"
            | "b0z"
            | "v0x"
            | "v0y"
            | "v0z";

          const variableMap: Record<VariableKey, number> = {
            q: model.q,
            m: model.mass,
            e0x: model.e0x,
            e0y: model.e0y,
            e0z: model.e0z,
            b0x: model.b0x,
            b0y: model.b0y,
            b0z: model.b0z,
            v0x: model.v0x,
            v0y: model.v0y,
            v0z: model.v0z,
          };

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
          }

          if (property && property.value !== undefined) {
            property.value = parsedLatex;
          }
        },
      },
    });
  }
}
