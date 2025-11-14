let salva = 0
const btnCliente = document.getElementById('btn-clientes');
const formCliente = document.getElementById('formCliente');
btnCliente.addEventListener('click', () => {
  limparNome();  
  deshabilitafixo(false); 
  controleaux = null;
  document.getElementById('btnSalvarCliente').style.display = 'block';
  document.getElementById('formPresenta').style.display = 'none'; 
  document.getElementById('ativo').style.display = 'none';
  document.querySelector('label[for="ativo"]').style.display = 'none';
  formCliente.style.display = 'block';    
  document.getElementById('formPainel').style.display = 'none';       
  document.getElementById('botoncep').style.display = 'block';
  document.getElementById('botonvalida').style.display = 'block';
  document.getElementById("cpf").focus();
  const msg = window.document.getElementById('tituli');
  msg.innerHTML = `Cadastro de clientes`;   
  salva = 1
});

function voltarCliente() {
  document.getElementById('formObjetos').style.display = 'none';
  document.getElementById('formCliente').style.display = 'block';
}

function verificar() {
    salva = 1
    const sexoEl = document.querySelector('input[name="radsex"]:checked');
    const estadoCivilEl = document.querySelector('input[name="radciv"]:checked');   
    const sexo = sexoEl ? (sexoEl.value === 'masculino' ? 'Masculino' : 'Feminino') : '';
    sexoaux = sexo
    const estadoCivil = estadoCivilEl ? estadoCivilEl.value.charAt(0).toUpperCase() + estadoCivilEl.value.slice(1) : '';    
    const cpf = document.getElementById('cpf').value;
    const cliente = document.getElementById('cliente').value;
    const dataNascimento = document.getElementById('datanascimento').value;    
    document.getElementById('botoncep').style.display = 'block';    
    salvarTudo()
  }
  
  function validar() {
    const cpf = document.getElementById("cpf").value;
    const resultado = document.getElementById("resultado");

    if (validarCPF(cpf)) {
      resul = "✅ CPF válido no formato.";      
      showToast(resul, 2500);                                                              
      setTimeout(() => {      
      }, 300);
    } else {
      resul = "❌ CPF inválido.";            
      showToast(resul, 2500);                                                               
    }
  }


  document.addEventListener('DOMContentLoaded', function () {
  const campos = [
    ["cpf", "rg"],
    ["rg", "cliente"],
    ["cliente", "datanascimento"],
    ["datanascimento", "sexual"],
    ["sexual", "civil"],
    ["civil", "estado"],
    ["estado", "ciudades"],
    ["ciudades", "naciones"],
    ["naciones", "nacionalidad"],
    ["nacionalidad", "naturalidad"],
    ["naturalidad", "cep"],
    ["cep", "botoncep"],
    ["botoncep", "logradouro"],
    ["logradouro", "bairro"],
    ["bairro", "ciudad"],
    ["ciudad", "estados"],
    ["estados", "numero"],
    ["numero", "e_mail"],
    ["e_mail", "telefone"],
    ["telefone", "celular"],
    ["celular", "limite"],    
    ["limite", "btnSalvarCliente"]    
  ];

  campos.forEach(([de, para]) => {
    const elemDe = document.getElementById(de);
    const elemPara = document.getElementById(para);
    if (elemDe && elemPara) {
      elemDe.addEventListener("keydown", function (event) {
        if (event.key === "Enter") elemPara.focus();
      });
    }
  });  
});

document.addEventListener('DOMContentLoaded', function () {
  const campos2 = [
    ["cnpj", "cliente"],
    ["cliente", "fantasia"],
    ["fantasia", "ie"],
    ["ie", "im"],
    ["im", "estado"],    
    ["estado", "ciudades"],
    ["ciudades", "naciones"],
    ["naciones", "nacionalidad"],
    ["nacionalidad", "naturalidad"],
    ["naturalidad", "cep"],
    ["cep", "botoncep"],
    ["botoncep", "logradouro"],
    ["logradouro", "bairro"],
    ["bairro", "ciudad"],
    ["ciudad", "estados"],
    ["estados", "numero"],
    ["numero", "e_mail"],
    ["e_mail", "telefone"],
    ["telefone", "celular"],
    ["celular", "limite"],    
    ["limite", "btnSalvarCliente"]    
  ];

  campos2.forEach(([de, para]) => {
    const elemDe = document.getElementById(de);
    const elemPara = document.getElementById(para);
    if (elemDe && elemPara) {
      elemDe.addEventListener("keydown", function (event) {
        if (event.key === "Enter") elemPara.focus();
      });
    }
  });  
});