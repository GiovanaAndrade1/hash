window.HashCalculator = (() => {
  const TABLE_SIZE = 128990;
  const BATCH_SIZE = 10000;

  function hash(ip) {
    let value = 0;
    for (let index = 0; index < ip.length; index++) {
      // Mesma aritmética unsigned de 32 bits do programa C++.
      value = (value * 7 + ip.charCodeAt(index)) >>> 0;
    }
    return value % TABLE_SIZE;
  }

  async function calculate(addresses) {
    const started = performance.now();
    const table = new Array(TABLE_SIZE);
    let unique = 0;
    let occupied = 0;
    let longest = 0;
    for (let offset = 0; offset < addresses.length; offset += BATCH_SIZE) {
      for (const ip of addresses.slice(offset, offset + BATCH_SIZE)) {
        const index = hash(ip);
        if (!table[index]) {
          table[index] = new Map();
          occupied++;
        }
        const chain = table[index];
        const frequency = chain.get(ip) || 0;
        chain.set(ip, frequency + 1);
        if (frequency === 0) unique++;
        longest = Math.max(longest, chain.size);
      }
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return {
      unique,
      occupied,
      longest,
      empty: TABLE_SIZE - occupied,
      load: unique / TABLE_SIZE,
      occupancy: (occupied / TABLE_SIZE) * 100,
      duration: performance.now() - started,
    };
  }
  return { calculate };
})();
