const bindingThickness = {
  colada: {
    "offset 63g": 0.042,
    "offset 75g": 0.05,
    "offset 90g": 0.058,
    "couchê 90g": 0.044,
    "couchê 120g": 0.06,
    "couchê 150g": 0.07,
    "pólen soft 70g": 0.048,
    "pólen soft 80g": 0.054,
    "vergê 85g": 0.059,
  },
  costurada: {
    "offset 63g": 0.044,
    "offset 75g": 0.052,
    "offset 90g": 0.062,
    "couchê 90g": 0.046,
    "couchê 120g": 0.062,
    "couchê 150g": 0.072,
    "pólen soft 70g": 0.05,
    "pólen soft 80g": 0.057,
    "vergê 85g": 0.061,
  },
};

function calculateSpine() {
  const binding = document.getElementById("binding").value;
  const paperType = document.getElementById("paper-type").value;
  const numPages = parseInt(document.getElementById("num-pages").value);

  if (!binding || !paperType || isNaN(numPages) || numPages <= 0) {
    console.error("Invalid input values");
    return;
  }

  const thickness = bindingThickness[binding]?.[paperType];

  if (!thickness) {
    console.error(`Invalid paper type for binding '${binding}'`);
    return;
  }

  const spine = thickness * numPages;
  const spineInMm = spine.toFixed(2);
  const spineInCm = (spine / 10).toFixed(2);

  document.getElementById("result").innerHTML = `A lombada terá ${spineInMm} mm (${spineInCm} cm) de espessura`;
}

document.getElementById("calc-btn").addEventListener("click", calculateSpine);
