const categoria = (nome, itens) => ({ categoria: nome, itens });
const item = (o) => o;

const fullConfig = [
    categoria("Verificação inicial", [
        item({
            id: "logo_senador",
            critical: true,
            label: "Trabalho sem logomarca do senador",
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Enviar e-mail Logomarca e Atividade Parlamentar",
            destiny: ["impressao", "plotagem", "expediente"]
        })
    ]),
    categoria("Verificação no SIGRAF", [
        item({
            id: "revisao_servso",
            critical: true,
            label: "Trabalho já está revisado",
            details: [
                "Verficar se a revisão será feita pela SEGRAF ou já foi feita pelo cliente"
            ],
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Enviar para SERVSO",
            destiny: ["impressao", "plotagem"]
        }),
        item({
            id: "sigraf_formato",
            critical: true,
            label: "Formato correto na Ordem de Serviço",
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Pedir correção do formato para SEAUFAT",
            destiny: ["impressao", "plotagem", "expediente"]
        }),
        item({
            id: "sigraf_cores",
            critical: true,
            label: "Cores corretas na Ordem de Serviço",
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Pedir correção das cores para SEAUFAT",
            destiny: ["impressao", "expediente"]
        }),
        item({
            id: "sigraf_paginas",
            critical: true,
            label: "Número de páginas correto na OS",
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Pedir correção do número de páginas para SEAUFAT",
            destiny: "impressao"
        })
    ]),
    categoria("Comprovação no Adobe Acrobat", [
        item({
            id: "cmyk_check",
            critical: true,
            label: "Cores em CMYK",
            action: "relatório",
            problem: "Elementos em RGB",
            solution: "Converter para CMYK.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "pb_check",
            critical: true,
            label: "Trabalho PB sem outras cores",
            action: "relatório",
            problem: "Elementos coloridos",
            solution: "Converter para PB.",
            message: "—",
            destiny: ["impressao", "expediente"]
        }),
        item({
            id: "tac_300",
            critical: true,
            label: "Carga de tintas abaixo de 300%",
            action: "relatório",
            problem: "Concentração de cores muito alta",
            solution: "Clarear, de forma que a concentração de cores nas áreas mais escuras não exceda 300%.",
            message: "—",
            destiny: ["impressao", "expediente"]
        }),
        item({
            id: "resolution_check",
            critical: false,
            label: "Imagens em alta resolução",
            action: "relatório",
            problem: "Imagens em baixa resolução",
            solution: "Usar imagens em alta resolução (300ppi); ou autorizar a impressão com este problema técnico.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "pag_multiple_4",
            critical: true,
            label: "Número de páginas múltiplo de 4",
            action: "relatório",
            problem: "Total de páginas do miolo não é múltiplo de 4",
            solution: "Acrescentar ou retirar páginas.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "fonts_embed",
            critical: true,
            label: "Fontes incorporadas",
            action: "relatório",
            problem: "Fonte não incorporada",
            solution: "Na exportação do PDF, configurar o programa para que incorpore as fontes.",
            message: "—",
            destiny: ["impressao", "plotagem", "expediente"]
        })
    ]),
    categoria("Verificação manual", [
        item({
            id: "sangria_5mm",
            critical: true,
            label: "Sangria de 5mm em todas as bordas",
            action: "relatório",
            problem: "Ausência de sangria",
            solution: "Incluir sangria de 5mm em todas as bordas.",
            message: "—",
            destiny: ["impressao", "expediente"]
        }),
        item({
            id: "marcas_check",
            critical: true,
            label: "Sem marcas de corte",
            action: "relatório",
            problem: "Marcas de corte",
            solution: "Retirar marcas de corte, escala de cores, espaçador.",
            message: "—",
            destiny: ["impressao", "expediente"]
        }),
        item({
            id: "marcas_dobra",
            critical: true,
            label: "Marcas de dobra",
            action: "relatório",
            problem: "Marcas de dobra",
            solution: "Inserir marcas pontilhadas no local da dobra, na região externa da arte, mas dentro da área de sangria.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "margem_seguranca",
            critical: true,
            label: "Margem de segurança de 5mm",
            details: [
                "Para lombada colada, nas primeiras e últimas páginas e nas partes internas da capa a distância mínima deve ser de 10 mm"
            ],
            action: "relatório",
            problem: "Elementos próximos à área de corte",
            solution: "Aplicar distância mínima de segurança de 5 mm. Para lombada colada, nas primeiras e últimas páginas e nas partes internas da capa a distância mínima deve ser de 10 mm.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "preto_k",
            critical: true,
            label: "Elementos pretos apenas no canal K",
            action: "relatório",
            problem: "Elemento preto nas 4 cores CMYK",
            solution: "Passar para somente Preto K 100%. Os outros canais de cor precisam estar em 0%.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "preto_chapado",
            critical: true,
            label: "Áreas chapadas com preto calçado",
            details: [
                "O preto nas áreas chapadas deve ser:",
                "— com texto vazado: 30c 0m 0y 100k",
                "— sem texto vazado: 40c 20m 20y 100k"
            ],
            action: "relatório",
            problem: "Preto chapado puro (0c 0m 0y 100k)",
            solution: "Calçar o preto: Com texto vazado (30c 0m 0y 100k); Sem texto vazado (40c 20m 20y 100k).",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "overprint_preto",
            critical: true,
            label: "Elementos pretos com overprint",
            action: "relatório",
            problem: "Cor de fundo vazada no local do preto",
            solution: "Deixar <em>overprint</em>. Ou seja, manter o fundo e o preto, um sobre o outro.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "pag_individuais",
            critical: true,
            label: "Miolo sem páginas agrupadas",
            action: "relatório",
            problem: "Páginas agrupadas",
            solution: "Finalizar arquivo com páginas individuais e em sequência.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "capa_montada",
            critical: true,
            label: "Capa montada",
            action: "relatório",
            problem: "Capa e contracapa em páginas diferentes",
            solution: "Preparar PDF com 1ª e 4ª capas, orelhas e lombada em uma página única (capa aberta). Inserir marcas de dobra pontilhadas para a lombadas e orelhas. Se houver conteúdo na 2ª e 3ª capas, prepará-las da mesma forma.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "medida_lombada",
            critical: true,
            label: "Lombada com medida correta",
            details: [
                'Conferir em <a href="https://claudioportella.com/lombada/" target="_blank"><span class="underline">Cálculo de Lombada</span></a>'
            ],
            action: ["relatório", "mensagem"],
            problem: "Medida da lombada incompatível com a quantidade de páginas",
            solution: "Ajustar lombada para XX mm.",
            message: "Incluir a medida correta da lombada no relatório",
            destiny: "impressao"
        }),
        item({
            id: "lombada_marcada",
            critical: true,
            label: "Lombada marcada",
            action: "relatório",
            problem: "Lombada marcada",
            solution: "Ajustar o layout de forma que não haja elementos alinhados com as bordas da lombada e das orelhas.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "afastamento_lombada",
            critical: true,
            label: "Elementos afastados da lombada",
            action: "relatório",
            problem: "Elementos na capa/contracapa muito próximos da lombada",
            solution: "Deixar a distância de 10mm, para que não fiquem em cima do vinco.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "sentido_lombada",
            critical: false,
            label: "Sentido da lombada correto",
            action: "relatório",
            problem: "Conteúdo da lombada em sentido invertido",
            solution: "Girar 180 graus, de forma que a leitura do texto fique de cima para baixo; ou autorizar a impressão desta forma.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "encadernacao_capa_dura",
            critical: true,
            label: "Compatível com encadernação com capa dura",
            details: [
                "Para capa dura, a lombada deve ter entre 3 mm e 47 mm",
                "— Usar couchê fosco 170"
            ],
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Solicitar para SEAUFAT alteração do papel da capa",
            destiny: "impressao"
        }),
        item({
            id: "encadernacao_cola",
            critical: true,
            label: "Compatível com encadernação com cola",
            details: [
                "Para cola, a lombada deve ter entre 3 mm e 47 mm",
                "— NÃO usar couchê fosco 170"
            ],
            action: "relatório",
            problem: "Quantidade de páginas é pequena para acabamento com cola",
            solution: "Alterar capa para grampo (sem lombada).",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "encadernacao_grampo",
            critical: true,
            label: "Compatível com encadernação com grampo",
            details: [
                "Para grampo, a lombada deve ter menos de 3 mm"
            ],
            action: "relatório",
            problem: "Quantidade de páginas é grande para acabamento com grampo",
            solution: "Alterar capa para lombada colada.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "encadernacao_espiral",
            critical: true,
            label: "Compatível com encadernação com espiral",
            details: [
                'Para espiral, a "lombada" deve ter menos de 50 mm'
            ],
            action: "mensagem",
            problem: "Quantidade de páginas é grande para acabamento com espiral",
            solution: "—",
            message: "Pedir alteração para SEAUFAT",
            destiny: "impressao"
        }),
        item({
            id: "colofao_check",
            critical: true,
            label: "Colofão correto",
            action: "relatório",
            problem: "Informações do colofão desatualizadas",
            solution: "Atualizar as informações.",
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "ficha_catalog",
            critical: true,
            label: "Ficha catalográfica atualizada",
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Solicitar nova ficha catalográfica para COBIB",
            destiny: "impressao"
        }),
        item({
            id: "cedit_mesa",
            critical: true,
            label: "Livro da CEDIT com Mesa e colofão atualizados",
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Solicitar atualização do colofão para SEFPRO",
            destiny: "impressao"
        }),
        item({
            id: "cartao_visita",
            critical: true,
            label: "Cartão de visitas no padrão do Senado",
            action: "relatório",
            problem: "Cartão de visitas fora do padrão",
            solution: 'Seguir o padrão do <a href="https://www12.senado.leg.br/identidadevisual" target="_blank"><span class="underline">Manual de Identidade Visual do Senado Federal</span></a>.',
            message: "—",
            destiny: "impressao"
        }),
        item({
            id: "modelo_cliche",
            critical: false,
            label: "Modelo de relevo/douração impresso na pasta",
            details: [
                "Os trabalhos com relevo ou douração precisam de um modelo impresso na pasta"
            ],
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Incluir um modelo impresso na pasta.",
            destiny: ["impressao", "expediente"]
        }),
        item({
            id: "chancela_correios",
            critical: true,
            label: "Envelope com a chancela dos Correios",
            action: "mensagem",
            problem: "—",
            solution: "—",
            message: "Confirmar a chancela dos Correios com SEAUFAT",
            destiny: "impressao"
        })
    ])
];