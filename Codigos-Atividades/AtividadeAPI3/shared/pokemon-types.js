// Mapeamento oficial dos tipos de Pokémon para Português, cores temáticas e ícones
const TIPOS_POKEMON = {
  normal:   { nome: 'Normal',   cor: '#9fa19f', corTexto: '#ffffff', icone: '⚪' },
  fire:     { nome: 'Fogo',     cor: '#e62829', corTexto: '#ffffff', icone: '🔥' },
  water:    { nome: 'Água',     cor: '#2980ef', corTexto: '#ffffff', icone: '💧' },
  grass:    { nome: 'Planta',   cor: '#3fa129', corTexto: '#ffffff', icone: '🌿' },
  electric: { nome: 'Elétrico', cor: '#fac000', corTexto: '#173d40', icone: '⚡' },
  ice:      { nome: 'Gelo',     cor: '#3dcef3', corTexto: '#173d40', icone: '❄️' },
  fighting: { nome: 'Lutador',  cor: '#ff8000', corTexto: '#ffffff', icone: '🥊' },
  poison:   { nome: 'Venenoso', cor: '#9141cb', corTexto: '#ffffff', icone: '☠️' },
  ground:   { nome: 'Terra',    cor: '#915121', corTexto: '#ffffff', icone: '⛰️' },
  flying:   { nome: 'Voador',   cor: '#81b9ef', corTexto: '#173d40', icone: '🪶' },
  psychic:  { nome: 'Psíquico', cor: '#ef4179', corTexto: '#ffffff', icone: '🔮' },
  bug:      { nome: 'Inseto',   cor: '#91a119', corTexto: '#ffffff', icone: '🐛' },
  rock:     { nome: 'Pedra',    cor: '#afa981', corTexto: '#173d40', icone: '🪨' },
  ghost:    { nome: 'Fantasma', cor: '#704170', corTexto: '#ffffff', icone: '👻' },
  dragon:   { nome: 'Dragão',   cor: '#5060e1', corTexto: '#ffffff', icone: '🐉' },
  dark:     { nome: 'Sombrio',  cor: '#50413f', corTexto: '#ffffff', icone: '🌑' },
  steel:    { nome: 'Aço',      cor: '#60a1b8', corTexto: '#ffffff', icone: '🛡️' },
  fairy:    { nome: 'Fada',     cor: '#ef70ef', corTexto: '#ffffff', icone: '✨' }
};

function traduzirTipo(tipoIngles) {
  const chave = String(tipoIngles || '').toLowerCase().trim();
  return TIPOS_POKEMON[chave] || {
    nome: chave ? chave.charAt(0).toUpperCase() + chave.slice(1) : 'Desconhecido',
    cor: '#777777',
    corTexto: '#ffffff',
    icone: '❓'
  };
}

module.exports = {
  TIPOS_POKEMON,
  traduzirTipo
};
