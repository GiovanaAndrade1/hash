/* Geração independente da interface, em lotes para manter a página responsiva. */
window.IpGenerator = (() => {
  const BATCH_SIZE = 10000;
  const OCTETS_PER_IP = 4;

  function isValidQuantity(quantity) {
    return Number.isSafeInteger(quantity) && quantity > 0;
  }

  function createBatch(quantity) {
    const bytes = new Uint8Array(quantity * OCTETS_PER_IP);
    crypto.getRandomValues(bytes);
    const lines = [];

    for (let index = 0; index < bytes.length; index += OCTETS_PER_IP) {
      lines.push(
        `${bytes[index]}.${bytes[index + 1]}.${bytes[index + 2]}.${bytes[index + 3]}\n`,
      );
    }

    return lines.map((line) => line.trim());
  }

  async function generate(quantity, onProgress = () => {}) {
    if (!isValidQuantity(quantity)) {
      throw new RangeError("A quantidade deve ser um inteiro positivo seguro.");
    }

    const addresses = [];
    for (let generated = 0; generated < quantity; ) {
      const size = Math.min(BATCH_SIZE, quantity - generated);
      addresses.push(...createBatch(size));
      generated += size;
      onProgress(generated, quantity);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    return addresses;
  }

  return { isValidQuantity, generate };
})();
