
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

  window.onload = (async function(){
    await sleep(600);
  document.getElementById('loading-div').classList.add('hide');
  document.querySelector('main').classList.remove('hide');
  document.querySelector('.page-brand').classList.remove('hide');

  });
