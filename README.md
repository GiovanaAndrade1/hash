# Hash — gerador e analisador de IPs

Interface web para gerar um arquivo de endereços IPv4 aleatórios e programa C++ para calcular estatísticas de uma tabela hash com encadeamento separado.

## Rodar a interface

Não é necessário instalar pacotes ou compilar o frontend. Abra `index.html` em um navegador moderno, mantendo a pasta `assets` ao lado do arquivo para carregar o CSS e o JavaScript.

Como alternativa, com Python 3 instalado, execute na raiz do projeto:

```bash
python3 -m http.server 8000
```

No navegador, acesse `http://localhost:8000`. Para encerrar o servidor, pressione `Ctrl+C` no terminal.

1. Informe uma quantidade inteira positiva de IPs.
2. Clique em **Gerar e baixar TXT**.
3. Salve o arquivo `dados_ips.txt`.

O arquivo contém um IPv4 por linha, em UTF-8. Os endereços podem se repetir e podem pertencer a faixas reservadas. Nenhuma conexão é feita com esses endereços. A geração acontece no navegador, em lotes; arquivos muito grandes podem exceder a memória disponível.

**As estatísticas exibidas na interface são demonstrativas. O frontend ainda não executa o programa C++ nem atualiza os cartões com o arquivo gerado.**

## Rodar o programa C++

Requer um compilador com suporte a C++11, como `g++`. Na raiz do projeto, no Linux ou macOS:

```bash
mkdir -p build
g++ -std=c++11 -O2 -Wall -Wextra -pedantic Documents/hash/hash.cpp -o build/hash
```

Copie o `dados_ips.txt` baixado pela interface para `build/` e execute:

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
  js/ip-generator.js         Validação e geração do arquivo em lotes
  js/app.js                  Eventos, progresso e download no navegador
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
node --test tests/ip-generator.test.cjs
node --check assets/js/app.js
```

Os testes verificam quantidades inválidas, formato dos IPv4, quantidade de linhas, UTF-8 e progresso entre lotes. Para verificar manualmente a interface, gere um arquivo, confira o número de linhas e teste também uma quantidade inválida e o layout em uma janela estreita.
