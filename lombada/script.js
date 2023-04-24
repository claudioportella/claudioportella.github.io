const paperType = {
  "offset-63g": { colada: 0.042, costurada: 0.044 },
  "offset-75g": { colada: 0.05, costurada: 0.052 },
  "offset-90g": { colada: 0.058, costurada: 0.062 },
  "couchê-90g": { colada: 0.044, costurada: 0.046 },
  "couchê-120g": { colada: 0.06, costurada: 0.062 },
  "couchê-150g": { colada: 0.07, costurada: 0.072 },
  "pólen-soft-70g": { colada: 0.048, costurada: 0.05 },
  "pólen-soft-80g": { colada: 0.054, costurada: 0.057 },
  "vergê-85g": { colada: 0.059, costurada: 0.061 },
};

function calculateSpine() {
  const bindingType = document.getElementById("binding-type").value;
  const paperTypeValue = document.getElementById("paper-type").value;
  const numPages = document.getElementById("num-pages").value;

  const spineSize = numPages * paperType[paperTypeValue][bindingType];

  const spineSizeDisplay = document.getElementById("spine-size");
  spineSizeDisplay.innerHTML = `Spine size: ${spineSize.toFixed(2)}mm`;
}
