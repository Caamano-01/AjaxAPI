/****** ViaCEP *********/
function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value=("");
    document.getElementById('bairro').value=("");
    document.getElementById('cidade').value=("");
    document.getElementById('uf').value=("");
    document.getElementById('ibge').value=("");
}

function meu_callback(conteudo) {
    if (!("erro" in conteudo)) {
        //Atualiza os campos com os valores.
        document.getElementById('rua').value=(conteudo.logradouro);
        document.getElementById('bairro').value=(conteudo.bairro);
        document.getElementById('cidade').value=(conteudo.localidade);
        document.getElementById('uf').value=(conteudo.uf);
        document.getElementById('ibge').value=(conteudo.ibge);
    } //end if.
    else {
        //CEP não Encontrado.
        limpa_formulário_cep();
        alert("CEP não encontrado.");
    }
}
        
function pesquisacep(valor) {

    //Nova variável "cep" somente com dígitos.
    var cep = valor.replace(/\D/g, '');

    //Verifica se campo cep possui valor informado.
    if (cep != "") {

        //Expressão regular para validar o CEP.
        var validacep = /^[0-9]{8}$/;

        //Valida o formato do CEP.
        if(validacep.test(cep)) {

            //Preenche os campos com "..." enquanto consulta webservice.
            document.getElementById('rua').value="...";
            document.getElementById('bairro').value="...";
            document.getElementById('cidade').value="...";
            document.getElementById('uf').value="...";
            document.getElementById('ibge').value="...";

            //Cria um elemento javascript.
            var script = document.createElement('script');

            //Sincroniza com o callback.
            script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

            //Insere script no documento e carrega o conteúdo.
            document.body.appendChild(script);

        } //end if.
        else {
            //cep é inválido.
            limpa_formulário_cep();
            alert("Formato de CEP inválido.");
        }
    } //end if.
    else {
        //cep sem valor, limpa formulário.
        limpa_formulário_cep();
    }
};

document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault(); // impede envio do formulário

    const campos = ['cep','rua','bairro','cidade','uf','ibge'];
    let todosPreenchidos = campos.every(id => document.getElementById(id).value.trim() !== '');

    if (todosPreenchidos) {
        alert('Dados enviados com sucesso.');
    } else {
        alert('Por favor, preencha todos os campos.');
    }
});

/******** JsonPlaceholder *******/
const userList = document.getElementById('user-list');

fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => response.json())
  .then(users => {
    users.forEach(user => {
      const card = document.createElement('div');
      card.className = 'user-card';
      card.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Cidade:</strong> ${user.address.city}</p>
      `;
      userList.appendChild(card);
    });
  })
  .catch(error => {
    userList.innerHTML = `<p>Erro ao carregar usuários.</p>`;
    console.error('Erro:', error);
});

/* Cats & Dogs */
const catsDogsDiv = document.getElementById('cats-dogs');

async function fetchCat() {
  const res = await fetch('https://api.thecatapi.com/v1/images/search');
  const data = await res.json();
  return data[0];
}

async function fetchDog() {
  const res = await fetch('https://api.thedogapi.com/v1/images/search');
  const data = await res.json();
  return data[0];
}

async function showCatsDogs() {
  try {
    // Buscando 2 gatos e 2 cachorros (total 4 cards)
    const promises = [fetchCat(), fetchCat(), fetchDog(), fetchDog()];
    const animals = await Promise.all(promises);

    animals.forEach(animal => {
      const card = document.createElement('div');
      card.className = 'animal-card';
      let breedName = animal.breeds && animal.breeds.length > 0 ? animal.breeds[0].name : 'Raça desconhecida';
      card.innerHTML = `
        <img src="${animal.url}" alt="Imagem do animal" />
        <h3>${breedName}</h3>
      `;
      catsDogsDiv.appendChild(card);
    });
  } catch(e) {
    catsDogsDiv.innerHTML = '<p>Erro ao carregar imagens de gatos e cachorros.</p>';
  }
}

showCatsDogs();

/*** Advice Slip API (4 frases) ****/
const adviceList = document.getElementById('advice-list');

async function fetchAdvice() {
  const advices = [];

  for(let i = 0; i < 4; i++) {
    try {
      const res = await fetch('https://api.adviceslip.com/advice');
      const data = await res.json();
      advices.push(data.slip.advice);
    } catch {
      advices.push("Não foi possível carregar o conselho.");
    }
  }

  adviceList.innerHTML = '';
  advices.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    adviceList.appendChild(li);
  });
}

fetchAdvice();

/* CoinGecko */
async function fetchBitcoinPrice() {
  const priceEl = document.getElementById('btc-price');
  const errorEl = document.getElementById('error-msg');
  errorEl.textContent = '';
  priceEl.textContent = 'Carregando...';

  try {
    // Usando a API da CoinGecko para o preço do Bitcoin em USD
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    if (!response.ok) throw new Error('Erro na resposta da API da CoinGecko');
    const data = await response.json();
    const priceUSD = data.bitcoin.usd;
    priceEl.textContent = `USD $${priceUSD}`;
  } catch (error) {
    priceEl.textContent = '—';
    errorEl.textContent = 'Erro ao carregar o preço do Bitcoin (CoinGecko). Tente novamente.';
    console.error(error);
  }
}
document.getElementById('refresh-btn').addEventListener('click', fetchBitcoinPrice);
// Busca o preço assim que a página carrega
fetchBitcoinPrice();

/*** Agify.io ****/
const agifyForm = document.getElementById('agifyForm');
const nameInput = document.getElementById('nameInput');
const agifyResult = document.getElementById('agifyResult');

agifyForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (!name) return;

  agifyResult.textContent = 'Carregando...';

  try {
    const res = await fetch(`https://api.agify.io/?name=${name}`);
    const data = await res.json();
    if (data.age) {
      agifyResult.textContent = `A idade média para o nome "${name}" é ${data.age} anos.`;
    } else {
      agifyResult.textContent = `Não foi possível prever a idade para o nome "${name}".`;
    }
  } catch {
    agifyResult.textContent = 'Erro ao consultar a API.';
  }
});

/* OpenWeatherMap */
async function fetchWeather() {
  const apiKey = 'da19a2952fc6812358d9b16f2eb952c1';
  const city = 'Porto Alegre,BR';
  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=pt&appid=${apiKey}`);
    const data = await res.json();

    if (parseInt(data.cod) === 200) {
      const el = document.createElement('div');
      el.className = 'weather-card';
      el.innerHTML = `
        <h3>${data.name}</h3>
        <p>${data.weather[0].description}</p>
        <p>${data.main.temp} °C</p>`;
      document.getElementById('weatherContainer').appendChild(el);
    } else {
      document.getElementById('weatherContainer').textContent = 'Não foi possível carregar o clima.';
    }
  } catch (error) {
    console.error('Erro ao buscar o clima:', error);
    document.getElementById('weatherContainer').textContent = 'Erro ao consultar o tempo.';
  }
}

fetchWeather();

/* Bored API */
async function fetchBored() {
  try {
    const res = await fetch('https://bored-api.appbrewery.com/random');
    const data = await res.json();
    document.getElementById('boredActivity').innerHTML = `<h3>Atividade sugerida:</h3><p>${data.activity}</p>`;
  } catch (error) {
    console.error('Erro ao buscar atividade:', error);
    document.getElementById('boredActivity').textContent = 'Erro ao buscar sugestão (Bored API).';
  }
}

/* Ipify */
async function fetchIp() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    document.getElementById('ipContainer').innerHTML = `<h3>Seu IP é:</h3><p>${data.ip}</p>`;
  } catch {
    document.getElementById('ipContainer').textContent = 'Erro ao obter IP.';
  }
}
fetchIp();