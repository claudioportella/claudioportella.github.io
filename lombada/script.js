const papeis = [
  { tipo: "offset 75g", colada: 0.050, costurada: 0.052 },
  { tipo: "offset 63g", colada: 0.042, costurada: 0.044 },
  { tipo: "offset 90g", colada: 0.058, costurada: 0.062 },
  { tipo: "couchê 90g", colada: 0.044, costurada: 0.046 },
  { tipo: "couchê 120g", colada: 0.060, costurada: 0.062 },
  { tipo: "couchê 150g", colada: 0.070, costurada: 0.072 },
  { tipo: "pólen soft 70g", colada: 0.048, costurada: 0.050 },
  { tipo: "pólen soft 80g", colada: 0.054, costurada: 0.057 },
  { tipo: "vergê 85g", colada: 0.059, costurada: 0.061 },
];

function gerarCamposPapel() {
  const selectPapel = document.getElementById("tipoPapel");
  for (let i = 0; i < papeis.length; i++) {
    const papel = papeis[i];
    const option = document.createElement("option");
    option.value = i.toString();
    option.text = papel.tipo;
    selectPapel.add(option);
  }
}

function calcularLombada() {
  const papelIndex = document.getElementById("tipoPapel").value;
  const encadernacao = document.getElementById("encadernacao").value;
  const paginas = document.getElementById("numPaginas").value;
  const papel = papeis[papelIndex];
  const lombada = encadernacao === "colada" ? papel.colada : papel.costurada;
  const resultado = paginas * lombada;

  document.getElementById("resultado").innerHTML = resultado.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }) + " mm";

   const obs = document.getElementById("obs");
  if (resultado < 3) {
    obs.innerHTML = "⚠️<br>Espessura com menos de 3 mm.<br> Encadernar com grampo canoa.";
  } else {
    obs.innerHTML = "";
  }
	
}
window.onload = gerarCamposPapel;