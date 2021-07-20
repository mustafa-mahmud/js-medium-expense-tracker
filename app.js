'use strict';

const btn = document.querySelector('.btn');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const list = document.getElementById('list');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const balance = document.getElementById('balance');

let info = localStorage.getItem('transactions')
  ? JSON.parse(localStorage.getItem('transactions'))
  : [];
const income = [];
const expense = [];
let plus = 0;
let minus = 0;

const transaction = (e) => {
  e.preventDefault();
  const item = text.value.trim();
  const money = amount.value.trim();

  if (!item || !money) return alert('Please fill the value');
  money > 1 ? income.push(money) : expense.push(money);
  const id = new Date().getTime();

  info.push({
    id,
    item,
    money,
  });

  localStorage.setItem('transactions', JSON.stringify(info));
  text.value = amount.value = '';
  text.focus();
  displayUI(info);
};

const displayUI = (datas) => {
  list.innerHTML = '';

  datas.forEach((data) => {
    list.innerHTML += `<li data-target="${data.id}" class="${
      data.money > 1 ? 'plus' : 'minus'
    }">
          ${data.item} <span>${
      data.money > 1 ? '+' + data.money : data.money
    }</span><button onclick="del(event)" class="delete-btn">x</button>
      </li>`;
  });

  incomeExpUI(datas);
  balanceUI(datas);
};

const incomeExpUI = (datas) => {
  const plus = datas
    .map((data) => {
      if (+data.money > 1) return +data.money;
    })
    .filter((data) => typeof data === 'number')
    .reduce((acc, curr) => acc + curr, 0);
  const minus = datas
    .map((data) => {
      if (+data.money < 1) return +data.money;
    })
    .filter((data) => typeof data === 'number')
    .reduce((acc, curr) => acc + curr, 0);

  moneyPlus.textContent = `+$${plus.toFixed(2)}`;
  moneyMinus.textContent = `-$${Math.abs(minus).toFixed(2)}`;
};

const balanceUI = (datas) => {
  const total = datas
    .map((data) => +data.money)
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);

  balance.textContent = `${
    total >= 0 ? '+$' + total : '-$' + Math.abs(total).toFixed(2)
  }`;
};

const del = (e) => {
  const id = +e.target.closest('li').getAttribute('data-target');

  info = info.filter((data) => data.id !== id);
  localStorage.setItem('transactions', JSON.stringify(info));

  displayUI(info);
};

displayUI(info);
btn.addEventListener('click', transaction);
