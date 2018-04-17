const $$ = id => document.getElementById(id);
const fmtNum = input => Number.parseFloat(input, 10).toFixed(2);

export { $$, fmtNum };
