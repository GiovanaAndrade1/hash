# Hash — gerador e analisador de IPs

Interface web para gerar endereços IPv4 aleatórios em memória e programa C++ para calcular estatísticas de uma tabela hash com encadeamento separado.

## Rodar a interface

Não é necessário instalar pacotes ou compilar o frontend. Abra `index.html` em um navegador moderno, mantendo a pasta `assets` ao lado do arquivo para carregar o CSS e o JavaScript.

Como alternativa, com Python 3 instalado, execute na raiz do projeto:

```bash
python3 -m http.server 8000
```

No navegador, acesse `http://localhost:8000`. Para encerrar o servidor, pressione `Ctrl+C` no terminal.

1. Informe uma quantidade inteira positiva de IPs.
2. Clique em **Gerar IPs** e aguarde a confirmação.
3. Clique em **Calcular hash** para exibir as estatísticas reais do conjunto gerado.

Não há download nem envio de arquivos: os IPs ficam na memória da página até uma nova geração ou recarregamento. Os endereços podem se repetir e pertencer a faixas reservadas; nenhuma conexão é feita com eles. Quantidades grandes podem exceder a memória do navegador.

O cálculo web usa JavaScript com a mesma função hash do C++ (multiplicação por 7 com overflow unsigned de 32 bits), 128.990 posições e encadeamento com contagem de frequências. O executável C++ não é chamado pelo navegador. Os resultados mostram IPs únicos, fator de carga, maior lista, posições ocupadas/vazias e tempo do cálculo no navegador, incluindo pausas entre lotes para manter a interface responsiva.

## Rodar o programa C++

Requer um compilador com suporte a C++11, como `g++`. Na raiz do projeto, no Linux ou macOS:

```bash
mkdir -p build
g++ -std=c++11 -O2 -Wall -Wextra -pedantic Documents/hash/hash.cpp -o build/hash
```

Coloque um arquivo de texto UTF-8 com um IP por linha, chamado `dados_ips.txt`, em `build/` e execute:

```bash
cd build
./hash
```

O programa procura `dados_ips.txt` no **diretório de execução** e imprime IPs únicos, fator de carga, comprimento da maior lista, posições vazias e tempo de processamento.

### Usar os dados incluídos no repositório

O arquivo original está em UTF-16. Antes da execução, converta uma cópia para UTF-8 sem alterar o original. Na raiz do projeto, com Python 3:

```bash
python3 - <<'PY'
from pathlib import Path

source = Path("Documents/hash/dados_ips.txt")
destination = Path("build/dados_ips.txt")
destination.parent.mkdir(exist_ok=True)
destination.write_text(source.read_text(encoding="utf-16"), encoding="utf-8")
PY
```

Para esse conjunto, o resultado esperado é: **64.493 IPs únicos**, fator de carga **0,499984**, maior lista com **19 IPs** e **103.236 posições vazias**. O tempo de execução varia.

O `hash.exe` incluído é um executável Windows; ele não é utilizado pela interface web nem pela compilação Linux.

## Organização

```text
index.html                   Estrutura e conteúdo da página
assets/
  css/styles.css             Estilos e regras responsivas
  js/ip-generator.js         Validação e geração de IPs em memória
  js/hash-calculator.js      Cálculo da tabela hash no navegador
  js/app.js                  Eventos, progresso e resultados no navegador
Documents/hash/
  hash.cpp                   Implementação da tabela hash em C++
  dados_ips.txt              Conjunto original de dados em UTF-16
  hash.exe                   Executável Windows original
tests/ip-generator.test.cjs   Testes do gerador de arquivos
.editorconfig                Convenções de edição
```

HTML, estilos, geração de dados e interação com a página ficam em arquivos separados. O frontend usa JavaScript nativo e não depende de frameworks ou de uma etapa de build.

## Validar alterações

Com Node.js 18 ou superior, execute na raiz:

```bash
node --test tests/*.test.cjs
node --check assets/js/app.js
```

Os testes verificam quantidades inválidas, formato dos IPv4, quantidade de endereços e progresso entre lotes, além de duplicatas e colisões no cálculo hash. Para verificar manualmente, gere IPs, aguarde a confirmação e calcule. Uma nova geração deve ocultar os resultados anteriores.
