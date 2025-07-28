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