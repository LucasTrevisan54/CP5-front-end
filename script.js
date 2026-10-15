/* ==========================================================================
   THE ULTIMATE STREET MATCH — script.js
   JavaScript puro (sem bibliotecas), só para o que o CSS não resolve:
   1. Menu mobile
   2. Contador regressivo
   3. Janela de regras (<dialog>)
   4. Botões de reserva

   O script é carregado com "defer" no HTML, então o DOM já existe aqui.
   A rolagem suave NÃO está aqui: usamos "scroll-behavior: smooth" no CSS,
   que é mais simples e respeita a preferência de movimento reduzido.
   ========================================================================== */


/* 1. MENU MOBILE ----------------------------------------------------------
   O botão alterna a classe .is-open no menu e atualiza o aria-expanded,
   que avisa leitores de tela se o menu está aberto ou fechado. */
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('menu-principal');

function setMenu(open) {
  menu.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  setMenu(!isOpen);
});

// Fecha o menu ao clicar em um link (senão ele cobriria a seção de destino)
menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenu(false);
});

// Fecha com a tecla Esc
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});


/* 2. CONTADOR REGRESSIVO --------------------------------------------------
   Data alvo = primeira partida da tabela (21/nov/2026, 16h, horário de Brasília).
   O "-03:00" no final fixa o fuso, para o contador ser igual em qualquer lugar. */
const TARGET_DATE = new Date('2026-11-21T16:00:00-03:00');

const cdDias = document.getElementById('cd-dias');
const cdHoras = document.getElementById('cd-horas');
const cdMin = document.getElementById('cd-min');
const cdSeg = document.getElementById('cd-seg');

// Garante sempre 2 dígitos: 7 vira "07"
const pad = (n) => String(n).padStart(2, '0');

function updateCountdown() {
  // Diferença em milissegundos; Math.max evita números negativos depois do evento
  const diff = Math.max(0, TARGET_DATE - new Date());

  const seconds = Math.floor(diff / 1000);
  cdDias.textContent = pad(Math.floor(seconds / 86400));
  cdHoras.textContent = pad(Math.floor((seconds % 86400) / 3600));
  cdMin.textContent = pad(Math.floor((seconds % 3600) / 60));
  cdSeg.textContent = pad(seconds % 60);
}

updateCountdown();                  // desenha já na abertura da página
setInterval(updateCountdown, 1000); // e atualiza a cada segundo


/* 3. JANELA DE REGRAS -----------------------------------------------------
   <dialog> é um elemento nativo do HTML: showModal() abre com fundo
   escurecido e foco preso; close() fecha. Esc já funciona sozinho. */
const regras = document.getElementById('regras');

document.getElementById('abrir-regras').addEventListener('click', () => regras.showModal());
document.getElementById('fechar-regras').addEventListener('click', () => regras.close());

// Clicar fora da caixa (no fundo escuro) também fecha
regras.addEventListener('click', (event) => {
  if (event.target === regras) regras.close();
});


/* 4. BOTÕES DE RESERVA ----------------------------------------------------
   Um único listener na tabela (delegação de eventos) atende todos os botões,
   inclusive os que forem adicionados depois. Clicar de novo desfaz a reserva. */
const schedule = document.querySelector('.schedule');

schedule.addEventListener('click', (event) => {
  const button = event.target.closest('.reserve');
  if (!button) return;

  // Guarda o texto original no próprio botão para poder restaurar
  if (!button.dataset.original) button.dataset.original = button.textContent;

  const reserved = button.classList.toggle('is-reserved');
  button.textContent = reserved ? 'Vaga reservada' : button.dataset.original;
  button.setAttribute('aria-pressed', String(reserved));
});
