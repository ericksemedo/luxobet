const tokenAprovado = "luxobet2025";
let emailjsData = {
  serviceID: "service_j5trb9s",
  templateID: "template_obu9tkl",
  userID: "8ivmHjJkRc1GzEDYB"
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("acessoLiberado") === "true") {
    document.getElementById("welcome").style.display = "none";
    document.getElementById("ferramenta").style.display = "block";
  }
});

function solicitarAcesso() {
  const email = document.getElementById("emailInput").value.trim();
  const button = document.querySelector("button[onclick='solicitarAcesso()']");

  if (!/\S+@\S+\.\S+/.test(email)) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }

  const token = Math.random().toString(36).substr(2, 6).toUpperCase();
  button.disabled = true;
  button.innerText = "Enviando...";

  emailjs.send(emailjsData.serviceID, emailjsData.templateID, {
    user_email: email,
    token: token
  }, emailjsData.userID)
  .then(() => {
    localStorage.setItem("tokenGerado", token);
    alert("Token enviado com sucesso!");
    document.getElementById("welcome").style.display = "none";
    document.getElementById("tokenSection").style.display = "block";
  })
  .catch((error) => {
    console.error("Erro ao enviar o token:", error);
    alert("Erro ao enviar o token. Tente novamente.");
  })
  .finally(() => {
    button.disabled = false;
    button.innerText = "Solicitar Acesso";
  });
}

function verificarToken() {
  const input = document.getElementById("tokenInput").value.trim();
  const salvo = localStorage.getItem("tokenGerado");

  if (input === salvo) {
    localStorage.setItem("acessoLiberado", "true");
    document.getElementById("tokenSection").style.display = "none";
    document.getElementById("ferramenta").style.display = "block";
  } else {
    alert("Token inválido!");
  }
}

const cores = ["", "red", "blue", "yellow"];
let estado = Array(18).fill(0);

function renderGrade() {
  const grade = document.getElementById("grade");
  grade.innerHTML = "";
  estado.forEach((cor, i) => {
    const div = document.createElement("div");
    div.className = "square " + cores[cor];
    div.title = cores[cor] || "vazio";
    div.onclick = () => {
      estado[i] = (estado[i] + 1) % 4;
      renderGrade();
      if (!estado.includes(0)) analisar();
    };
    grade.appendChild(div);
  });
}

function analisar() {
  const contagem = { red: 0, blue: 0, yellow: 0 };
  estado.forEach(c => {
    if (c === 1) contagem.red++;
    if (c === 2) contagem.blue++;
    if (c === 3) contagem.yellow++;
  });

  let maior = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0];
  document.getElementById("sugestao").innerText = "Entrar na cor: " + maior[0];
}

renderGrade();
