function solicitarToken() {
  const email = document.getElementById("userEmail").value;

  if (!email) {
    alert("Por favor, insira um email.");
    return;
  }

  const hoje = new Date().toISOString().split("T")[0];
  const registros = JSON.parse(localStorage.getItem("tokenRequests") || "{}");

  if (!registros[email]) registros[email] = {};
  if (registros[email][hoje] >= 5) {
    document.getElementById("mensagemLimite").textContent =
      "Limite diário de 5 solicitações atingido.";
    return;
  }

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  localStorage.setItem(`token-${email}`, JSON.stringify({ token, usos: 0 }));

  emailjs
    .send("service_sio7bva", "template_cw1fc7j", {
      user_email: email,
      token: token,
    })
    .then(
      () => {
        document.getElementById("request-access").style.display = "none";
        document.getElementById("validate-token").style.display = "block";
        registros[email][hoje] = (registros[email][hoje] || 0) + 1;
        localStorage.setItem("tokenRequests", JSON.stringify(registros));
      },
      () => {
        alert("Erro ao enviar token. Tente novamente.");
      }
    );
}

function validarToken() {
  const email = document.getElementById("userEmail").value;
  const tokenDigitado = document.getElementById("userToken").value;
  const dadosToken = JSON.parse(localStorage.getItem(`token-${email}`));

  if (!dadosToken) {
    alert("Token não encontrado. Solicite novamente.");
    return;
  }

  if (dadosToken.token === tokenDigitado) {
    if (dadosToken.usos >= 10) {
      alert("Limite diário de uso do token atingido.");
      return;
    }

    dadosToken.usos += 1;
    localStorage.setItem(`token-${email}`, JSON.stringify(dadosToken));
    document.getElementById("validate-token").style.display = "none";
    document.getElementById("main-app").style.display = "block";
  } else {
    alert("Token inválido.");
  }
}
