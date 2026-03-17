let lombadaGlobal = 0;
let highlightedItem = null;
const SANGRIA = 5;
const ACRESCIMO_LOMBADA_CAPADURA = 3;
const ACRESCIMO_LARGURA_CAPADURA = 9; // Canaleta
const ACRESCIMO_ALTURA_CAPADURA = 12; // 6 acima + 6 abaixo (Total Extensão)
const EXTENSAO_INDIVIDUAL = 6;
const REVIRADO = 20;

const CORES_HOVER = {
    largura: '#ffffff', 
    altura: '#ffffff',
    lombada: '#ffffff',      
    orelha: '#ffffff', 
    total: '#ffffff',   
    sangria: '#ffffff',
    canaletaFill: '#2d2d2d',
    canaletaLine: 'transparent'
};

const COR_ESQUEMA = '#6b7280';

function setHighlight(item) {
    highlightedItem = item;
    desenharEsquema();
}

function formatMM(valor, decimais = 0) {
    return valor.toLocaleString('pt-BR', { 
        minimumFractionDigits: decimais, 
        maximumFractionDigits: decimais 
    }) + " mm";
}

function gerarCamposPapel() {
    const selectPapel = document.getElementById("tipoPapel");
    papeis.forEach((papel, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.text = papel.tipo;
        selectPapel.add(option);
    });
    document.getElementById("numPaginas").focus();
    desenharEsquema();
}

function desenharEsquema() {
    const inputLargura = document.getElementById('largura').value;
    const inputAltura = document.getElementById('altura').value;
    const encadernacao = document.getElementById('encadernacao').value;
    
    const baseLargura = parseFloat(inputLargura);
    const baseAltura = parseFloat(inputAltura);
    
    const wrapper = document.getElementById('canvasWrapper');
    const drawingArea = document.getElementById('drawingArea');
    const panelControl = document.getElementById('panelControl');

    if (!inputLargura || !inputAltura || isNaN(baseLargura) || isNaN(baseAltura) || baseLargura <= 0 || baseAltura <= 0) {
        wrapper.style.display = 'none';
        return;
    }

    wrapper.style.display = 'flex';
    
    if (window.innerWidth >= 1024) {
        const panelHeight = panelControl.offsetHeight;
        wrapper.style.height = panelHeight + 'px';
        wrapper.style.maxHeight = panelHeight + 'px';
    } else {
        wrapper.style.height = '500px';
        wrapper.style.maxHeight = 'none';
    }

    const orelhaInput = document.getElementById('orelhas').value;
    const orelhaDoc = (encadernacao === 'capadura' || orelhaInput === "" || orelhaInput === "—" || parseFloat(orelhaInput) <= 0) ? 0 : parseFloat(orelhaInput);
    
    let espessura = lombadaGlobal || 0;
    let alturaDoc = baseAltura;
    let larguraCapa = baseLargura;
    let reviradoValor = 0;

    const labelL = document.getElementById('label_total_sangria_l');
    const labelA = document.getElementById('label_total_sangria_a');
    const legCanaletaContainer = document.getElementById('leg_canaleta_container');
    const legExtensaoContainer = document.getElementById('leg_extensao_container');

    if (encadernacao === 'capadura') {
        espessura += ACRESCIMO_LOMBADA_CAPADURA;
        larguraCapa += ACRESCIMO_LARGURA_CAPADURA;
        alturaDoc += ACRESCIMO_ALTURA_CAPADURA;
        reviradoValor = REVIRADO;
        labelL.innerText = "Largura total com revirado e sangria";
        labelA.innerText = "Altura com revirado e sangria";
        legCanaletaContainer.style.display = 'flex';
        legExtensaoContainer.style.display = 'flex';
    } else {
        labelL.innerText = "Largura total com sangria";
        labelA.innerText = "Altura com sangria";
        legCanaletaContainer.style.display = 'none';
        legExtensaoContainer.style.display = 'none';
    }

    const larguraTotalAberta = (orelhaDoc * 2) + (larguraCapa * 2) + espessura;
    const alturaTotalDoc = alturaDoc;

    const margemExternaTotal = reviradoValor + SANGRIA;

    const larguraFinalTotal = larguraTotalAberta + (margemExternaTotal * 2);
    const alturaFinalTotal = alturaTotalDoc + (margemExternaTotal * 2);

    document.getElementById('leg_largura').innerText = formatMM(larguraCapa);
    document.getElementById('leg_altura').innerText = formatMM(alturaDoc);
    document.getElementById('leg_orelha').innerText = formatMM(orelhaDoc);
    document.getElementById('leg_total_aberto').innerText = formatMM(larguraTotalAberta, 1);
    document.getElementById('leg_total_sangria_l').innerText = formatMM(larguraFinalTotal, 1);
    document.getElementById('leg_total_sangria_a').innerText = formatMM(alturaFinalTotal, 1);
    
    document.getElementById('leg_orelha_container').style.display = orelhaDoc > 0 ? 'flex' : 'none';

    const margin = 50;
    const viewW = Math.floor(larguraFinalTotal + (margin * 2));
    const viewH = Math.floor(alturaFinalTotal + (margin * 2));

    const x0 = Math.floor(margin);
    const y0 = Math.floor(margin);
    
    const xPapel = Math.floor(x0 + margemExternaTotal);
    const yPapel = Math.floor(y0 + margemExternaTotal);

    const xO1 = xPapel;
    const xC1 = Math.floor(xO1 + orelhaDoc);
    const xL = Math.floor(xC1 + larguraCapa);
    const xC2 = Math.floor(xL + espessura);
    const xO2 = Math.floor(xC2 + larguraCapa);

    const baseRects = `
        <rect x="${xC1}" y="${yPapel}" width="${Math.floor(larguraCapa)}" height="${Math.floor(alturaDoc)}" />
        <rect x="${xL}" y="${yPapel}" width="${Math.floor(espessura)}" height="${Math.floor(alturaDoc)}" />
        <rect x="${xC2}" y="${yPapel}" width="${Math.floor(larguraCapa)}" height="${Math.floor(alturaDoc)}" />
        ${orelhaDoc > 0 ? `
            <rect x="${xO1}" y="${yPapel}" width="${Math.floor(orelhaDoc)}" height="${Math.floor(alturaDoc)}" />
            <rect x="${xO2}" y="${yPapel}" width="${Math.floor(orelhaDoc)}" height="${Math.floor(alturaDoc)}" />
        ` : ''}
    `;

    const baseVerticalLines = `
        ${orelhaDoc > 0 ? `<line x1="${xC1}" y1="${yPapel}" x2="${xC1}" y2="${Math.floor(yPapel + alturaDoc)}" />` : ''}
        <line x1="${xL}" y1="${yPapel}" x2="${xL}" y2="${Math.floor(yPapel + alturaDoc)}" />
        <line x1="${xC2}" y1="${yPapel}" x2="${xC2}" y2="${Math.floor(yPapel + alturaDoc)}" />
        ${orelhaDoc > 0 ? `<line x1="${xO2}" y1="${yPapel}" x2="${xO2}" y2="${Math.floor(yPapel + alturaDoc)}" />` : ''}
    `;

    let svgContent = `
        <svg viewBox="0 0 ${viewW} ${viewH}" preserveAspectRatio="xMidYMid meet">
            <rect x="${x0}" y="${y0}" width="${Math.floor(larguraFinalTotal)}" height="${Math.floor(alturaFinalTotal)}" 
                fill="none" class="technical-line" style="stroke: ${COR_ESQUEMA};" />
            <rect x="${xPapel}" y="${yPapel}" width="${Math.floor(larguraTotalAberta)}" height="${Math.floor(alturaTotalDoc)}" fill="#111111" />
            <g fill="none" class="technical-line" style="stroke: ${COR_ESQUEMA};">
                ${baseRects}
            </g>
            <g class="technical-line" style="stroke: ${COR_ESQUEMA};">
                ${baseVerticalLines}
            </g>
            ${getHighlightsSVG(xC1, xL, xC2, xO2, xO1, x0, y0, xPapel, yPapel, alturaDoc, espessura, orelhaDoc, larguraCapa, larguraTotalAberta, larguraFinalTotal, alturaFinalTotal)}
            ${(highlightedItem === 'canaleta' || highlightedItem === 'extensao') ? `
                <g fill="none" class="technical-line" style="stroke: ${COR_ESQUEMA}; pointer-events: none;">
                    ${baseRects}
                </g>
                <g class="technical-line" style="stroke: ${COR_ESQUEMA}; pointer-events: none;">
                    ${baseVerticalLines}
                </g>
            ` : ''}
        </svg>
    `;

    drawingArea.innerHTML = svgContent;
}

function getHighlightsSVG(xC1, xL, xC2, xO2, xO1, x0, y0, xP, yP, hD, esp, orelha, lCapa, lTotal, lFinalTotal, hFinalTotal) {
    if (!highlightedItem) return '';
    
    switch(highlightedItem) {
        case 'largura':
            return `<line x1="${xC2}" y1="${yP}" x2="${xO2}" y2="${yP}" class="technical-line" style="stroke: ${CORES_HOVER.largura};" />`;
        case 'canaleta':
            return `
                <rect x="${xL - ACRESCIMO_LARGURA_CAPADURA}" y="${yP}" width="${ACRESCIMO_LARGURA_CAPADURA}" height="${hD}" fill="${CORES_HOVER.canaletaFill}" />
                <rect x="${xC2}" y="${yP}" width="${ACRESCIMO_LARGURA_CAPADURA}" height="${hD}" fill="${CORES_HOVER.canaletaFill}" />
            `;
        case 'extensao':
            return `
                <rect x="${xP}" y="${yP}" width="${lTotal}" height="${EXTENSAO_INDIVIDUAL}" fill="${CORES_HOVER.canaletaFill}" />
                <rect x="${xP}" y="${yP + hD - EXTENSAO_INDIVIDUAL}" width="${lTotal}" height="${EXTENSAO_INDIVIDUAL}" fill="${CORES_HOVER.canaletaFill}" />
            `;
        case 'altura':
            return `<line x1="${xO2 + orelha}" y1="${yP}" x2="${xO2 + orelha}" y2="${Math.floor(yP + hD)}" class="technical-line" style="stroke: ${CORES_HOVER.altura};" />`;
        case 'lombada':
            return `<line x1="${xL}" y1="${yP}" x2="${xC2}" y2="${yP}" class="technical-line" style="stroke: ${CORES_HOVER.lombada};" />`;
        case 'orelha':
            if (orelha <= 0) return '';
            return `
                <line x1="${xO1}" y1="${yP}" x2="${xC1}" y2="${yP}" class="technical-line" style="stroke: ${CORES_HOVER.orelha};" />
                <line x1="${xO2}" y1="${yP}" x2="${Math.floor(xO2 + orelha)}" y2="${yP}" class="technical-line" style="stroke: ${CORES_HOVER.orelha};" />
            `;
        case 'total':
            return `<line x1="${xP}" y1="${yP}" x2="${Math.floor(xP + lTotal)}" y2="${yP}" class="technical-line" style="stroke: ${CORES_HOVER.total};" />`;
        case 'sangriaLargura':
            return `<line x1="${x0}" y1="${y0}" x2="${Math.floor(x0 + lFinalTotal)}" y2="${y0}" class="technical-line" style="stroke: ${CORES_HOVER.sangria};" />`;
        case 'sangriaAltura':
            return `<line x1="${x0}" y1="${y0}" x2="${x0}" y2="${Math.floor(y0 + hFinalTotal)}" class="technical-line" style="stroke: ${CORES_HOVER.sangria};" />`;
        default:
            return '';
    }
}

function calcularLombada() {
    const papelIndex = document.getElementById("tipoPapel").value;
    const encadernacao = document.getElementById("encadernacao").value;
    const paginasInput = document.getElementById("numPaginas").value;
    const orelhaElement = document.getElementById("orelhas");
    
    const resultadoDisplay = document.getElementById("resultado");
    const obsDisplay = document.getElementById("obs");

    if (encadernacao === 'capadura') {
        orelhaElement.value = "—";
        orelhaElement.disabled = true;
    } else {
        if (orelhaElement.value === "—") orelhaElement.value = "";
        orelhaElement.disabled = false;
    }

    if (!paginasInput || paginasInput <= 0) {
        lombadaGlobal = 0;
        resultadoDisplay.innerHTML = "";
        obsDisplay.innerHTML = "";
        desenharEsquema();
        return;
    }

    const papel = papeis[papelIndex];
    const fator = (encadernacao === "costurada" || encadernacao === "capadura") ? papel.costurada : papel.colada;
    lombadaGlobal = parseFloat(paginasInput) * fator;

    let displayLombada = lombadaGlobal;
    if (encadernacao === 'capadura') displayLombada += ACRESCIMO_LOMBADA_CAPADURA;

    const isError = (encadernacao !== 'capadura' && displayLombada < 3);

    resultadoDisplay.innerHTML = `${displayLombada.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}<span class="text-xl ml-1 ${isError ? 'text-error' : 'text-white'}">mm</span>`;
    
    if (isError) {
        resultadoDisplay.classList.add('text-error');
        obsDisplay.innerHTML = `<p class="text-[9px] text-error font-bold uppercase"><b>Lombada mínima: 3mm</b></p>`;
    } else {
        resultadoDisplay.classList.remove('text-error');
        obsDisplay.innerHTML = "";
    }

    desenharEsquema();
}

window.addEventListener('resize', desenharEsquema);
window.onload = gerarCamposPapel;
