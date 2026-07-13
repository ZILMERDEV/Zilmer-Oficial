# 📝 Como Adicionar Legendas nas Imagens das Áreas

## Passo a Passo Completo

### 1. Acesse o Editor Admin
- Abra seu navegador e vá para: `http://localhost:3000/admin`
- Ou acesse: `/admin` no seu site

### 2. Selecione a Área
- No menu lateral esquerdo, clique na área que você quer editar
- Exemplos: **Transporte**, **Hidrelétrica**, **Mineração**, etc.

### 3. Selecione o Campo de Legenda
Após selecionar a área, você verá uma lista de campos. Escolha um dos seguintes:

#### Opção A: **Legenda da Imagem Principal**
- Use este campo se você tem **apenas UMA imagem** na página
- Clique em: **"Legenda da Imagem Principal"**
- Digite a legenda no editor que aparece
- Clique em **"Salvar Alterações"**

#### Opção B: **Legendas das Imagens (Array)**
- Use este campo se você tem **MÚLTIPLAS imagens** (carrossel)
- Clique em: **"Legendas das Imagens (Array)"**
- Você verá uma caixa de texto grande
- **Digite uma legenda por linha**
- Cada linha será a legenda da imagem correspondente (1ª linha = 1ª imagem, 2ª linha = 2ª imagem, etc.)
- Exemplo:
  ```
  Transformador de retificação instalado em subestação
  Vista interna do transformador mostrando os enrolamentos
  Transformador em operação na linha de metrô
  ```
- Clique em **"Salvar Alterações"**

### 4. Verificar se Salvou
- Você verá uma mensagem verde: **"Texto salvo com sucesso!"**
- Se aparecer erro, veja a mensagem de erro para entender o problema

### 5. Ver a Legenda no Site
- Clique em **"Ver Página"** no editor admin
- Ou acesse diretamente: `/areas/[nome-da-area]`
- A legenda aparecerá **abaixo da imagem** em itálico

---

## ❓ Problemas Comuns

### Não vejo os campos de legenda na lista
**Solução:** Certifique-se de que:
1. Você selecionou uma **Área** primeiro (ex: Transporte)
2. Os campos aparecem após selecionar a área
3. Procure por: **"Legenda da Imagem Principal"** ou **"Legendas das Imagens (Array)"**

### A legenda não aparece no site
**Solução:** Verifique:
1. Você salvou corretamente? (mensagem de sucesso apareceu?)
2. A legenda está vazia? (precisa ter texto)
3. Recarregue a página do site (F5)
4. Verifique se há erro no console do navegador (F12)

### Erro ao salvar
**Solução:**
1. Verifique a mensagem de erro que aparece
2. Certifique-se de que selecionou uma área E um campo
3. Tente novamente
4. Se persistir, verifique o console do navegador (F12 > Console)

---

## 💡 Dicas

- **Uma imagem:** Use "Legenda da Imagem Principal"
- **Várias imagens:** Use "Legendas das Imagens (Array)" - uma linha por imagem
- **Editar depois:** Basta selecionar o mesmo campo novamente e editar
- **Remover legenda:** Deixe o campo vazio e salve

---

## 📸 Exemplo Prático

**Cenário:** Você tem 3 imagens na página de Transporte

1. Acesse `/admin`
2. Clique em **"Transporte"**
3. Clique em **"Legendas das Imagens (Array)"**
4. Digite:
   ```
   Transformador de tração para sistemas metroviários
   Vista detalhada dos enrolamentos em resina epóxi
   Instalação do transformador em subestação
   ```
5. Clique em **"Salvar Alterações"**
6. Clique em **"Ver Página"** para ver o resultado

---

## 🆘 Ainda com Problemas?

Se ainda não conseguir:
1. Me diga qual erro aparece (mensagem exata)
2. Qual área você está tentando editar
3. Qual campo você está tentando usar
4. Tire um print da tela se possível











