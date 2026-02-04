// Este arquivo contém os dados que alimentam o checklist.
// Edite os itens abaixo seguindo a estrutura de chaves e colchetes.

const PREFLIGHT_CONFIG = [
    {
        "categoria": "Verificação inicial",
        "itens": [
            {
                "id": "logo",
                "label": "Logomarca do Senador",
                "pro": "Identificamos RGB.",
                "msg": "Lorem ipsum",
                "action": "Mensagem",
                "sol": "Enviar e-mail Logomarca e Atividade Parlamentar.",
                "critico": false
            }
        ]
    },
    {
        "categoria": "Comprovação no Adobe Acrobat",
        "itens": [
            {
                "id": "rgb",
                "label": "Imagens em RGB / Lab / Indexadas",
                "pro": "Identificamos RGB.",
                "msg": "Lorem ipsum",
                "action": "Relatório",
                "sol": "Converter imagens para CMYK (Perfil Fogra39 ou similar).",
                "critico": false
            },
            {
                "id": "pant",
                "label": "Cores Especiais / Pantone ativos",
                "pro": "Pantones ativos em job CMYK.",
                "msg": "Lorem ipsum",
                "action": "Relatório",
                "sol": "Mapear cores para quadricromia no PDF ou fechar novo arquivo.",
                "critico": false
            },
            {
                "id": "tac",
                "label": "Carga de tinta (>300%)",
                "pro": "Excesso de tinta detectado.",
                "msg": "Lorem ipsum",
                "action": "Mensagem",
                "sol": "Tratar imagens para reduzir a carga total de tinta (TAC).",
                "critico": true
            },
            {
                "id": "res",
                "label": "Resolução (Abaixo de 300dpi)",
                "pro": "Imagens abaixo de 300dpi.",
                "msg": "Lorem ipsum",
                "action": "Relatório",
                "sol": "Solicitar imagens em alta resolution ou reduzir dimensões.",
                "critico": false
            },
            {
                "id": "ovp",
                "label": "Overprint de Branco",
                "pro": "Branco em sobreposição.",
                "msg": "Lorem ipsum",
                "action": "Mensagem",
                "sol": "Remover o atributo de overprint dos objetos brancos.",
                "critico": true
            },
            {
                "id": "curv",
                "label": "Fontes não incorporadas",
                "pro": "Fontes não embutidas no PDF.",
                "msg": "Lorem ipsum",
                "action": "Relatório",
                "sol": "Incorporar fontes no fechamento ou converter em curvas.",
                "critico": true
            }
        ]
    },
    {
        "categoria": "Verificação manual",
        "itens": [
            {
                "id": "sng",
                "label": "Sangria técnica (3mm em todos os lados)",
                "pro": "Arquivo sem sobra técnica.",
                "msg": "Lorem ipsum",
                "action": "Mensagem",
                "sol": "Aumentar a arte ou o fundo em 3mm além da linha de corte.",
                "critico": true
            },
            {
                "id": "mrg",
                "label": "Margens de segurança / Respiros",
                "pro": "Elementos próximos ao corte.",
                "msg": "Lorem ipsum",
                "action": "Relatório",
                "sol": "Recuar textos e logos (mín. 4mm) da borda do papel.",
                "critico": true
            },
            {
                "id": "fmt",
                "label": "Formato final da página vs Pedido",
                "pro": "Tamanho do PDF incorreto.",
                "msg": "Lorem ipsum",
                "action": "Mensagem",
                "sol": "Ajustar o documento para as medidas finais solicitadas.",
                "critico": true
            },
            {
                "id": "k4",
                "label": "Preto rico em textos/traços finos",
                "pro": "Textos pequenos em 4 cores.",
                "msg": "Lorem ipsum",
                "action": "Relatório",
                "sol": "Alterar a cor do texto para apenas 100% Black (K).",
                "critico": false
            },
            {
                "id": "faca",
                "label": "Faca / Verniz Localizado / Hotstamp",
                "pro": "Camada técnica incorreta.",
                "msg": "Lorem ipsum",
                "action": "Mensagem",
                "sol": "Definir como Spot Color e aplicar Overprint no atributo.",
                "critico": true
            },
            {
                "id": "pags",
                "label": "Ordem das páginas / Versos em branco",
                "pro": "Inconsistência na sequência.",
                "msg": "Lorem ipsum",
                "action": "Relatório",
                "sol": "Revisar montagem do PDF e ordem lógica das páginas.",
                "critico": true
            }
        ]
    }
];
