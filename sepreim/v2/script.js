// =========================================================
// CSV GERADO PELO GOOGLE SHEETS
// =========================================================
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRBKGxaOzaYNX-C58a9wAXdbc_2xrB4jfIZkE_EHpeJd_9F4AQzpsEFTaX0BdEav9j3ROEjKDG-BTNi/pub?gid=529813744&single=true&output=csv"; 

let fullConfig = [];
let activeDestiny = null;
let state = {};
let visibleItensCount = 0;

// Ícones padrão. Se você criar um destino novo, o app usará o "defaultIcon".
const iconMapping = {
    'impressao': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 mb-2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>`,
    'plotagem': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 mb-2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v9a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 14.25v-9ZM6 21V16.5m12 4.5V16.5m-10.5-9h9m-9 3h6" /></svg>`,
    'expediente': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 mb-2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" /></svg>`
};
const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 mb-2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>`;

// =========================================================
// INICIALIZAÇÃO E LEITURA DA PLANILHA
// =========================================================
window.onload = async () => {
    if (CSV_URL === "COLE_SEU_LINK_AQUI") {
        document.getElementById('destiny-selector').innerHTML = '<div class="p-4 text-center text-red-400">Por favor, configure o link da sua planilha no script.js.</div>';
        return;
    }

    try {
        const response = await fetch(CSV_URL);
        const csvText = await response.text();

        Papa.parse(csvText, {
            header: false,
            complete: function(results) {
                processDataFromGoogleSheets(results.data);
            }
        });
    } catch (err) {
        document.getElementById('destiny-selector').innerHTML = '<div class="p-4 text-center text-red-400">Erro ao carregar dados da planilha.</div>';
    }
};

function processDataFromGoogleSheets(rows) {
    if (!rows || rows.length === 0) return;

    // Transposição da Matriz (Inverte colunas para linhas com base na sua estrutura do Excel)
    const transposed = rows[0].map((_, colIndex) => rows.map(row => row[colIndex]));
    const keys = transposed[0].map(k => k ? k.trim() : ''); 
    const itemsRaw = [];

    // Ignora a primeira linha transposta (que agora são os cabeçalhos)
    for (let i = 1; i < transposed.length; i++) {
        const rowData = transposed[i];
        if (!rowData || !rowData[0]) continue;
        
        let obj = {};
        keys.forEach((key, index) => {
            if (key) obj[key] = rowData[index] ? rowData[index] : "—";
        });
        itemsRaw.push(obj);
    }

    const categoryMap = new Map();
    const allDestinies = new Set();

    itemsRaw.forEach(item => {
        // Conversões necessárias
        item.critical = (item.critical === 'X' || item.critical === 'x');
        
        if (!item.details || item.details === '—' || item.details === '') {
            item.details = [];
        } else {
            // Separa quebras de linha que vêm da mesma célula
            item.details = item.details.split(/\r?\n/).map(d => d.trim()).filter(d => d);
        }

        if (item.action !== '—' && item.action.includes(',')) {
            item.action = item.action.split(',').map(a => a.trim());
        } else {
            item.action = item.action.trim();
        }

        if (item.destiny && item.destiny !== '—') {
            item.destiny = item.destiny.split(',').map(d => d.trim());
            item.destiny.forEach(d => allDestinies.add(d));
        } else {
            item.destiny = [];
        }

        // Agrupando por categorias
        const catName = item.categoria || 'Sem Categoria';
        if (!categoryMap.has(catName)) {
            categoryMap.set(catName, { categoria: catName, itens: [] });
        }
        categoryMap.get(catName).itens.push(item);
    });

    fullConfig = Array.from(categoryMap.values());
    renderDestinyButtons(Array.from(allDestinies));
}

function renderDestinyButtons(destinies) {
    const container = document.getElementById('destiny-selector');
    container.innerHTML = ''; 

    destinies.forEach(dest => {
        const icon = iconMapping[dest] || defaultIcon;
        const displayName = {
            'impressao': 'Impressão',
            'plotagem': 'Plotagem',
            'expediente': 'MATERIAL DE<br>EXPEDIENTE'
        }[dest] || dest.toUpperCase();

        const btn = document.createElement('div');
        btn.onclick = () => setDestiny(dest);
        btn.id = `opt-${dest}`;
        btn.className = 'destiny-option flex flex-col items-center';
        btn.innerHTML = `${icon}\n${displayName}`;
        container.appendChild(btn);
    });
}

// =========================================================
// LÓGICA DA INTERFACE E RENDERIZAÇÃO (Mantido do Original)
// =========================================================

function setDestiny(dest) {
    activeDestiny = dest;
    
    // Atualiza botão ativo dinamicamente
    const allButtons = document.querySelectorAll('.destiny-option');
    allButtons.forEach(btn => {
        btn.classList.toggle('active', btn.id === `opt-${dest}`);
    });

    document.getElementById('content-wrapper').classList.remove('hidden');
    renderChecklist();
    checkCompletion();
}

function setStatus(id, type) {
    const btnOk = document.getElementById(`btn-ok-${id}`);
    const btnErr = document.getElementById(`btn-err-${id}`);

    if (state[id] === type) {
        state[id] = null;
        btnOk.classList.remove('active-ok');
        btnErr.classList.remove('active-error');
    } else {
        state[id] = type;
        if (type === 'ok') {
            btnOk.classList.add('active-ok');
            btnErr.classList.remove('active-error');
        } else {
            btnErr.classList.add('active-error');
            btnOk.classList.remove('active-ok');
        }
    }
    checkCompletion();
}

function checkCompletion() {
    let preenchidosVisiveis = 0;
    fullConfig.forEach(cat => {
        cat.itens.forEach(item => {
            const isVisible = Array.isArray(item.destiny) ? item.destiny.includes(activeDestiny) : (item.destiny === 'todos' || item.destiny === activeDestiny);
            if (isVisible && state[item.id] !== null && state[item.id] !== undefined) {
                preenchidosVisiveis++;
            }
        });
    });
    const btn = document.getElementById('btn-gerar');
    const isFinished = preenchidosVisiveis >= visibleItensCount;
    btn.disabled = !isFinished;
    
    if (isFinished) {
        btn.removeAttribute('title');
    } else {
        btn.setAttribute('title', 'Marque todos os itens para gerar o relatório');
    }
}

function abrirModalRelatorio() {
    gerarRelatorio();
    document.getElementById('preview-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    document.getElementById('preview-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

async function copiarTexto() {
    const tableElement = document.getElementById('report-table');
    if (!tableElement) return;

    try {
        const blob = new Blob([tableElement.outerHTML], { type: 'text/html' });
        const data = [new ClipboardItem({ 
            'text/html': blob, 
            'text/plain': new Blob([tableElement.innerText], { type: 'text/plain' }) 
        })];
        await navigator.clipboard.write(data);
    } catch (err) {
        const range = document.createRange(); 
        range.selectNode(tableElement);
        window.getSelection().removeAllRanges(); 
        window.getSelection().addRange(range);
        document.execCommand('copy');
    }
    
    window.getSelection().removeAllRanges();
    const toast = document.getElementById('toast');
    toast.style.opacity = "1";
    setTimeout(() => toast.style.opacity = "0", 2500);
}

function renderDetails(details = []) {
    if (!details || details.length === 0) return '';
    return details.map(d => `<span class="item-detail">${d}</span>`).join('');
}

function renderChecklist() {
    const container = document.getElementById('checklist-container');
    container.innerHTML = ''; 
    visibleItensCount = 0;

    fullConfig.forEach(cat => {
        const filteredItens = cat.itens.filter(item => {
            return Array.isArray(item.destiny) ? item.destiny.includes(activeDestiny) : (item.destiny === 'todos' || item.destiny === activeDestiny);
        });

        if (filteredItens.length > 0) {
            let html = `
                <div class="space-y-4">
                    <h3 class="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-2">${cat.categoria}</h3>
                    <div class="inner-group-box">
                        <div class="grid grid-cols-1">
            `;
            
            filteredItens.forEach((itemObj, index) => {
                visibleItensCount++;
                if (state[itemObj.id] === undefined) state[itemObj.id] = null;
                
                const borderClass = index < filteredItens.length - 1 ? 'border-b border-white/5' : '';
                const okActive = state[itemObj.id] === 'ok' ? 'active-ok' : '';
                const errActive = state[itemObj.id] === 'error' ? 'active-error' : '';

                html += `
                    <div class="item-row ${borderClass}">
                        <span class="text-sm font-medium text-gray-400 transition-colors leading-tight">
                            ${itemObj.label}${renderDetails(itemObj.details)}
                        </span>
                        <div class="flex gap-2">
                            <button onclick="setStatus('${itemObj.id}', 'ok')" id="btn-ok-${itemObj.id}" class="status-btn ${okActive}">✓</button>
                            <button onclick="setStatus('${itemObj.id}', 'error')" id="btn-err-${itemObj.id}" class="status-btn ${errActive}">✕</button>
                        </div>
                    </div>
                `;
            });
            html += `</div></div></div>`;
            container.innerHTML += html;
        }
    });
}

function gerarRelatorio() {
    const preview = document.getElementById('preview-modal-content');
    const actions = document.getElementById('modal-actions');
    let errorRows = [];
    let messages = [];
    
    fullConfig.forEach(cat => {
        cat.itens.forEach(item => {
            const isVisible = Array.isArray(item.destiny) ? item.destiny.includes(activeDestiny) : (item.destiny === 'todos' || item.destiny === activeDestiny);
            if (isVisible && state[item.id] === 'error') {
                const cleanProblem = (item.problem || '').replace(/<[^>]*>/g, '');

                if (item.action === "mensagem") {
                    if (item.message !== "—") messages.push(item.message);
                } else if (Array.isArray(item.action) ? item.action.includes("mensagem") : item.action === "ambos") {
                    if (item.message !== "—") messages.push(item.message);
                    errorRows.push({ prob: cleanProblem, sol: item.solution, critical: item.critical });
                } else {
                    errorRows.push({ prob: cleanProblem, sol: item.solution, critical: item.critical });
                }
            }
        });
    });

    const fontStack = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;";
    let htmlContent = `<div id="report-table-container" style="${fontStack} color: #333;">`;
    
    if (messages.length > 0) {
        messages.forEach(msg => {
            htmlContent += `<div style="padding: 15px; margin-bottom: 10px; background: #fff9f0; border: 1px solid #ffeed4; border-radius: 1rem; text-align: center; font-weight: 600; font-size: 13px; color: #854d0e;">➜ ${msg}</div>`;
        });
    }

    if (errorRows.length === 0 && messages.length === 0) {
        htmlContent += `<div style="padding: 15px; background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 1rem; text-align: center; font-weight: 600; font-size: 13px; color: #166534;">✔ Nenhum problema técnico encontrado</div>`;
        actions.classList.add('hidden');
    } else if (errorRows.length > 0) {
        htmlContent += `<table id="report-table" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #edf2f7; margin-top: 8px; ${fontStack}">`;
        htmlContent += `<thead style="background: #f7fafc;"><tr style="border-bottom: 2px solid #edf2f7;"><th colspan="2" style="padding: 12px 10px; text-align: left; font-size: 10px; text-transform: uppercase; color: #718096; border: 1px solid #edf2f7;">Problema encontrado</th><th style="padding: 12px 10px; text-align: left; font-size: 10px; text-transform: uppercase; color: #718096; border: 1px solid #edf2f7;">Como solucionar</th></tr></thead><tbody>`;
        
        errorRows.forEach(row => {
            const icon = row.critical ? `❌` : `⚠️`;
            htmlContent += `<tr><td style="padding: 12px 10px; border: 1px solid #edf2f7; text-align: center; width: 30px; vertical-align: middle;">${icon}</td><td style="padding: 12px 10px; border: 1px solid #edf2f7; font-weight: 600; color: #2d3748; vertical-align: middle;">${row.prob}</td><td style="padding: 12px 10px; border: 1px solid #edf2f7; color: #4a5568; vertical-align: middle; line-height: 1.5;">${row.sol}</td></tr>`;
        });
        
        htmlContent += `</tbody></table>`;
        actions.classList.remove('hidden');
    } else {
        actions.classList.add('hidden');
    }
    htmlContent += `</div>`;
    preview.innerHTML = htmlContent;
}