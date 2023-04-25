const papeis = [
  { tipo: "offset 63g", semCostura: 0.042, comCostura: 0.044 },
  { tipo: "offset 75g", semCostura: 0.050, comCostura: 0.052 },
  { tipo: "offset 90g", semCostura: 0.058, comCostura: 0.062 },
  { tipo: "couchê 90g", semCostura: 0.044, comCostura: 0.046 },
  { tipo: "couchê 120g", semCostura: 0.060, comCostura: 0.062 },
  { tipo: "couchê 150g", semCostura: 0.070, comCostura: 0.072 },
  { tipo: "pólen soft 70g", semCostura: 0.048, comCostura: 0.050 },
  { tipo: "pólen soft 80g", semCostura: 0.054, comCostura: 0.057 },
  { tipo: "vergê 85g", semCostura: 0.059, comCostura: 0.061 },
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
  const lombada = encadernacao === "semCostura" ? papel.semCostura : papel.comCostura;
 
const resultado = paginas * lombada;
document.getElementById("resultado").innerHTML = resultado.toFixed(1) + " mm";
}

// Chama a função de gerar campos assim que a página carrega
window.onload = gerarCamposPapel;