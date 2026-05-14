let activeDestiny = null;
let state = {};
let visibleItensCount = 0;

function setDestiny(dest) {
    activeDestiny = dest;
    document.getElementById('opt-impressao').classList.toggle('active', dest === 'impressao');
    document.getElementById('opt-plotagem').classList.toggle('active', dest === 'plotagem');
    document.getElementById('opt-expediente').classList.toggle('active', dest === 'expediente');
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
            if (isVisible && state[item.id] !== null) {
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

/*
========================================================================
                            RENDER / UI
========================================================================
*/

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
            if ((item.destiny === 'ambos' || item.destiny === activeDestiny) && state[item.id] === 'error') {
                const cleanProblem = item.problem.replace(/<[^>]*>/g, '');

                if (item.action === "mensagem") {
                    if (item.message !== "—") messages.push(item.message);
                } else if (item.action === "ambos") {
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

window.onload = () => { 
    renderChecklist(); 
};