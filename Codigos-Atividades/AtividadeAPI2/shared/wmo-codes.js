// Tabela Oficial WMO (World Meteorological Organization) e Conversores Auxiliares

const TABELA_WMO = {
  0: { descricao: 'Céu limpo', icone: '☀️', categoria: 'limpo' },
  1: { descricao: 'Predominantemente limpo', icone: '🌤️', categoria: 'parcialmente-nublado' },
  2: { descricao: 'Parcialmente nublado', icone: '⛅', categoria: 'parcialmente-nublado' },
  3: { descricao: 'Nublado / Encoberto', icone: '☁️', categoria: 'nublado' },
  45: { descricao: 'Nevoeiro', icone: '🌫️', categoria: 'nevoeiro' },
  48: { descricao: 'Nevoeiro com geada', icone: '🌫️', categoria: 'nevoeiro' },
  51: { descricao: 'Chuvisco leve', icone: '🌦️', categoria: 'chuvisco' },
  53: { descricao: 'Chuvisco moderado', icone: '🌦️', categoria: 'chuvisco' },
  55: { descricao: 'Chuvisco denso', icone: '🌧️', categoria: 'chuvisco' },
  56: { descricao: 'Chuvisco congelante leve', icone: '🌨️', categoria: 'neve' },
  57: { descricao: 'Chuvisco congelante denso', icone: '🌨️', categoria: 'neve' },
  61: { descricao: 'Chuva fraca', icone: '🌧️', categoria: 'chuva' },
  63: { descricao: 'Chuva moderada', icone: '🌧️', categoria: 'chuva' },
  65: { descricao: 'Chuva forte', icone: '🌧️', categoria: 'chuva' },
  66: { descricao: 'Chuva congelante leve', icone: '🌨️', categoria: 'neve' },
  67: { descricao: 'Chuva congelante forte', icone: '🌨️', categoria: 'neve' },
  71: { descricao: 'Neve fraca', icone: '❄️', categoria: 'neve' },
  73: { descricao: 'Neve moderada', icone: '❄️', categoria: 'neve' },
  75: { descricao: 'Neve intensa', icone: '❄️', categoria: 'neve' },
  77: { descricao: 'Grãos de neve', icone: '❄️', categoria: 'neve' },
  80: { descricao: 'Pancadas de chuva leves', icone: '🌦️', categoria: 'chuva' },
  81: { descricao: 'Pancadas de chuva moderadas', icone: '🌧️', categoria: 'chuva' },
  82: { descricao: 'Pancadas de chuva violentas', icone: '⛈️', categoria: 'tempestade' },
  85: { descricao: 'Pancadas de neve leves', icone: '🌨️', categoria: 'neve' },
  86: { descricao: 'Pancadas de neve fortes', icone: '🌨️', categoria: 'neve' },
  95: { descricao: 'Tempestade com trovões', icone: '⛈️', categoria: 'tempestade' },
  96: { descricao: 'Tempestade com granizo leve', icone: '⛈️', categoria: 'tempestade' },
  99: { descricao: 'Tempestade com granizo forte', icone: '⛈️', categoria: 'tempestade' }
};

function interpretarWMO(codigo) {
  const cod = Number(codigo);
  return TABELA_WMO[cod] || {
    descricao: `Código Meteorológico ${codigo}`,
    icone: '🌡️',
    categoria: 'indefinido'
  };
}

function grausParaCardeal(graus) {
  if (graus === null || graus === undefined || isNaN(graus)) return 'N/D';
  const direcoes = [
    { cardeal: 'N', rotulo: 'Norte' },
    { cardeal: 'NNE', rotulo: 'Norte-Nordeste' },
    { cardeal: 'NE', rotulo: 'Nordeste' },
    { cardeal: 'ENE', rotulo: 'Leste-Nordeste' },
    { cardeal: 'L', rotulo: 'Leste' },
    { cardeal: 'ESE', rotulo: 'Leste-Sudeste' },
    { cardeal: 'SE', rotulo: 'Sudeste' },
    { cardeal: 'SSE', rotulo: 'Sul-Sudeste' },
    { cardeal: 'S', rotulo: 'Sul' },
    { cardeal: 'SSO', rotulo: 'Sul-Sudoeste' },
    { cardeal: 'SO', rotulo: 'Sudoeste' },
    { cardeal: 'OSO', rotulo: 'Oeste-Sudoeste' },
    { cardeal: 'O', rotulo: 'Oeste' },
    { cardeal: 'ONO', rotulo: 'Oeste-Noroeste' },
    { cardeal: 'NO', rotulo: 'Noroeste' },
    { cardeal: 'NNO', rotulo: 'Norte-Noroeste' }
  ];
  const indice = Math.round((graus % 360) / 22.5) % 16;
  return direcoes[indice];
}

function classificarIndiceUV(uv) {
  const valor = Number(uv);
  if (isNaN(valor)) return { nivel: 'N/D', cor: '#94a3b8' };
  if (valor < 3) return { nivel: 'Baixo', cor: '#22c55e', risco: 'Baixo risco de radiação' };
  if (valor < 6) return { nivel: 'Moderado', cor: '#eab308', risco: 'Proteção moderada recomendada' };
  if (valor < 8) return { nivel: 'Alto', cor: '#f97316', risco: 'Proteção solar necessária' };
  if (valor < 11) return { nivel: 'Muito Alto', cor: '#ef4444', risco: 'Evite exposição no meio do dia' };
  return { nivel: 'Extremo', cor: '#a855f7', risco: 'Risco extremo, proteja-se ao máximo' };
}

module.exports = {
  TABELA_WMO,
  interpretarWMO,
  grausParaCardeal,
  classificarIndiceUV
};
