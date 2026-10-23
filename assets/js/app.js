(() => {
  const form = document.getElementById("generator");
  const quantityInput = document.getElementById("quantity");
  const generateButton = document.getElementById("generate");
  const statusMessage = document.getElementById("generation-status");
  const numberFormatter = new Intl.NumberFormat("pt-BR");

  function setBusy(busy) {
    generateButton.disabled = busy;
    quantityInput.disabled = busy;
    form.setAttribute("aria-busy", String(busy));
  }

  function downloadFile(file) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dados_ips.txt";
    document.body.appendChild(link);

    try {
      link.click();
    } finally {
      link.remove();
      // Aguarda o navegador iniciar o download antes de liberar a URL.
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  }

  function showProgress(generated, total) {
    statusMessage.textContent = `Gerando: ${numberFormatter.format(generated)} de ${numberFormatter.format(total)} IPs…`;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const quantity = Number(quantityInput.value);

    if (!window.IpGenerator.isValidQuantity(quantity)) {
      quantityInput.setCustomValidity(
        "Informe uma quantidade inteira positiva válida.",
      );
      quantityInput.reportValidity();
      return;
    }

    setBusy(true);
    statusMessage.textContent = "Preparando o arquivo…";

    try {
      const file = await window.IpGenerator.generateFile(
        quantity,
        showProgress,
      );
      downloadFile(file);
      statusMessage.textContent = `Arquivo com ${numberFormatter.format(quantity)} IPs gerado. Download solicitado.`;
    } catch {
      statusMessage.textContent =
        "Não foi possível gerar o arquivo. Tente uma quantidade menor.";
    } finally {
      setBusy(false);
    }
  }

  quantityInput.addEventListener("input", () =>
    quantityInput.setCustomValidity(""),
  );
  form.addEventListener("submit", handleSubmit);
})();
