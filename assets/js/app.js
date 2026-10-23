(() => {
  const form = document.getElementById("generator");
  const quantityInput = document.getElementById("quantity");
  const generateButton = document.getElementById("generate");
  const calculateButton = document.getElementById("calculate");
  const status = document.getElementById("generation-status");
  const results = document.getElementById("results");
  const format = new Intl.NumberFormat("pt-BR");
  let addresses = null;

  function setBusy(busy) {
    generateButton.disabled = busy;
    quantityInput.disabled = busy;
    calculateButton.disabled = busy || !addresses;
    form.setAttribute("aria-busy", String(busy));
  }

  function render(data) {
    const values = {
      unique: format.format(data.unique),
      load: data.load.toLocaleString("pt-BR", { minimumFractionDigits: 6 }),
      longest: `${format.format(data.longest)} IPs`,
      duration: `${data.duration.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} ms`,
      "occupied-count": format.format(data.occupied),
      "empty-count": format.format(data.empty),
      "occupancy-value": data.occupancy.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      }),
      "dataset-label": `${format.format(addresses.length)} IPs gerados`,
    };
    for (const [id, value] of Object.entries(values)) {
      document.getElementById(id).textContent = value;
    }
    const meter = document.querySelector(".meter");
    meter.setAttribute("aria-valuenow", String(data.occupancy));
    meter.firstElementChild.style.width = `${data.occupancy}%`;
    results.hidden = false;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const quantity = Number(quantityInput.value);
    if (!window.IpGenerator.isValidQuantity(quantity)) {
      quantityInput.setCustomValidity(
        "Informe uma quantidade inteira positiva válida.",
      );
      quantityInput.reportValidity();
      return;
    }
    addresses = null;
    results.hidden = true;
    setBusy(true);
    status.textContent = "Gerando IPs…";
    try {
      addresses = await window.IpGenerator.generate(quantity, (done, total) => {
        status.textContent = `Gerando: ${format.format(done)} de ${format.format(total)} IPs…`;
      });
      status.textContent = `${format.format(addresses.length)} IPs gerados. Clique em Calcular hash para ver os resultados.`;
    } catch {
      status.textContent =
        "Não foi possível gerar os IPs. Tente uma quantidade menor.";
    } finally {
      setBusy(false);
    }
  });

  calculateButton.addEventListener("click", async () => {
    if (!addresses) return;
    setBusy(true);
    status.textContent = "Calculando a tabela hash…";
    try {
      render(await window.HashCalculator.calculate(addresses));
      status.textContent = `Cálculo concluído para ${format.format(addresses.length)} IPs.`;
    } catch {
      status.textContent =
        "Não foi possível calcular. Tente gerar uma quantidade menor de IPs.";
    } finally {
      setBusy(false);
    }
  });
  quantityInput.addEventListener("input", () =>
    quantityInput.setCustomValidity(""),
  );
})();
