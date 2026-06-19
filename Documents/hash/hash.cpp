#include <iostream>
#include <fstream>
#include <string>
#include <chrono>

const int TAMANHO_TABELA = 128990;

struct Node {
    std::string ip;
    int frequencia;
    Node* proximo;
};

Node* tabela[TAMANHO_TABELA] = {nullptr};

unsigned int funcao_hash(const std::string& ip) {
    unsigned int hash = 0;
    // usa caracteres ASCII do IP
    for (char c : ip) {
        hash = hash * 7 + c;
    }
    return hash % TAMANHO_TABELA;
}

void inserir(const std::string& ip) {
    unsigned int indice = funcao_hash(ip);
    Node* atual = tabela[indice];

    while (atual != nullptr) {
        if (atual->ip == ip) {
            atual->frequencia++;
            return;
        }
        atual = atual->proximo;
    }

    // aloca memória para novo nó
    Node* novo = new Node;
    // dados do novo nó
    novo->ip = ip;
    novo->frequencia = 1;
    novo->proximo = tabela[indice];
    // tabela tem novo nó como referência
    tabela[indice] = novo;
}

// Item 3 do PDF: estatísticas da tabela hash
void imprimir_estatisticas(long long tempo_ms) {
    int ips_unicos = 0;
    int posicoes_vazias = 0;
    int maior_lista = 0;

    for (int i = 0; i < TAMANHO_TABELA; i++) {
        Node* atual = tabela[i];
        int comprimento = 0;

        if (atual == nullptr) {
            posicoes_vazias++;
        }

        while (atual != nullptr) {
            ips_unicos++;
            comprimento++;
            atual = atual->proximo;
        }

        if (comprimento > maior_lista) {
            maior_lista = comprimento;
        }
    }

    double fator_carga = static_cast<double>(ips_unicos) / TAMANHO_TABELA;

    std::cout << "----- Estatisticas da Tabela Hash -----" << std::endl;
    std::cout << "Total de IPs unicos: " << ips_unicos << std::endl;
    std::cout << "Fator de carga (alfa): " << fator_carga << std::endl;
    std::cout << "Comprimento da maior lista: " << maior_lista << std::endl;
    std::cout << "Posicoes completamente vazias: " << posicoes_vazias << std::endl;
    std::cout << "Tempo de execucao: " << tempo_ms << " ms" << std::endl;
}

int main() {
    std::ifstream arquivo("dados_ips.txt");

    if (!arquivo.is_open()) {
        std::cerr << "Erro: nao foi possivel abrir o arquivo dados_ips.txt" << std::endl;
        return 1;
    }

    // Item 2 do PDF: leitura do arquivo gerado pelo comando do terminal
    auto inicio = std::chrono::high_resolution_clock::now();

    std::string linha;
    while (std::getline(arquivo, linha)) {
        if (!linha.empty()) {
            inserir(linha);
        }
    }

    auto fim = std::chrono::high_resolution_clock::now();
    auto duracao = std::chrono::duration_cast<std::chrono::milliseconds>(fim - inicio);

    arquivo.close();

    imprimir_estatisticas(duracao.count());

    return 0;
}