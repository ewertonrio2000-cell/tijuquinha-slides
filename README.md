# Tijuquinha — Apresentação Editável (Online)

Aplicação web de slides editáveis para o trabalho de **Ateliê de Urbanismo / Planejamento Urbano** da Universidade Estácio de Sá, com proposta de intervenção urbana na Estrada da Barra da Tijuca (Tijuquinha — Rio de Janeiro).

**Alunos:** Juliana Gorito (202303653913) e Ewerton Matos (202303653921)
**Orientação:** Prof. Carlos Rodrigo Avilez

Os textos e imagens são **sincronizados online via Supabase** — quando você edita, sua colega vê em segundos (e vice-versa). Todo o histórico fica salvo no banco.

---

## Como rodar localmente

Requer **Node.js 18+**.

```bash
npm install
cp .env.example .env       # edite com suas chaves do Supabase
npm run dev
```

Abre em `http://localhost:5173`.

### Variáveis de ambiente

`.env` precisa ter:

```ini
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...  # anon key (NÃO a service_role!)
VITE_SUPABASE_TABLE=tijuquinha_slides
VITE_SUPABASE_BUCKET=tijuquinha-images
```

---

## Como editar

- **Textos**: clique em qualquer texto na tela para editar inline. Pressione **Esc** ou clique fora para confirmar. Cada alteração é salva automaticamente (debounce de ~500 ms) no Supabase.
- **Imagens**: clique nas áreas com o ícone de upload para escolher uma imagem (ou arraste). A imagem sobe pro Supabase Storage e fica disponível pra todo mundo que abrir o link. Limite de 10 MB por imagem. Pra trocar/remover, passe o mouse e use os botões no canto superior direito.
- **Listas dinâmicas** (slide 04 e 07): use o botão **+ Adicionar item** no fim da lista para criar novos itens, e o ícone de lixeira para remover.
- **Realtime**: se duas pessoas estão editando ao mesmo tempo, as mudanças aparecem na tela da outra em ~1 segundo. O indicador "Sincronizado" no topo confirma que tudo está salvo no servidor.

### Atalhos de teclado

| Tecla | Ação |
| --- | --- |
| ← / → | Slide anterior / próximo |
| PageUp / PageDown | Slide anterior / próximo |
| F | Alternar modo apresentação |
| Esc | Sair do modo apresentação |

### Indicador de sync (topo)

- ☁️ **Sincronizado** — tudo salvo no banco.
- ⏳ **Salvando…** — alteração em trânsito.
- ❌ **Erro ao sincronizar** — sem conexão ou problema com o Supabase. Suas alterações ficam no cache local até voltar.
- ⏳ **Carregando…** — buscando o slide do banco.

---

## Exportar como PDF

Clique no botão **Exportar PDF** no canto superior direito. Gera um único arquivo `tijuquinha-apresentacao.pdf` com todos os 15 slides em 1280×720. Roda inteiramente no navegador (não passa por servidor).

---

## Resetar conteúdo

- **Resetar slide** — volta o slide atual ao texto padrão (apaga no Supabase também — afeta a versão online).
- **Limpar tudo** — apaga TODO o conteúdo de todos os slides no Supabase. Cuidado: ação irreversível.

---

## Arquitetura

```
src/
  components/
    Slide.jsx            # Wrapper 16:9 (sidebar, footer, pontos)
    SlideTitle.jsx       # Título com eyebrow + traço decorativo
    EditableText.jsx     # Texto editável inline (contentEditable)
    ImageUpload.jsx      # Upload → Supabase Storage, retorna URL pública
    SlideNavigation.jsx  # Barra inferior com miniaturas
    Toolbar.jsx          # Topo (export, presentation, reset, indicador)
  slides/                # Um arquivo por slide (00 a 13, incluindo 1.1)
  hooks/
    useSlideStorage.js   # Hook unificado: load + debounced save + realtime + cache offline
  lib/
    supabase.js          # Cliente Supabase + event bus de status de sync
  App.jsx
  main.jsx
  index.css
```

### Modelo de dados no Supabase

**Tabela `tijuquinha_slides`:**

| coluna | tipo | descrição |
| --- | --- | --- |
| `id` | text PK | ex.: `slide-00`, `slide-01-1`, `slide-13` |
| `data` | jsonb | todos os campos editáveis do slide |
| `updated_at` | timestamptz | atualizado por trigger |

RLS aberto para `anon` (leitura/escrita/upsert/delete). Realtime habilitado.

**Bucket `tijuquinha-images`** (Storage): público, 10 MB max, mime types `image/*`. Policies abertas pra `anon`.

> Acesso aberto — qualquer um com o link pode editar. Funcional pro escopo de trabalho de dupla; **não publicar a URL fora do grupo**.

---

## Deploy no Vercel

1. Crie um repositório no GitHub e dê push (veja seção abaixo).
2. Entre em [vercel.com](https://vercel.com), clique em **Add New → Project**, importe o repositório.
3. O Vercel detecta Vite automaticamente. Antes de fazer deploy, adicione as **Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_TABLE` (opcional — default `tijuquinha_slides`)
   - `VITE_SUPABASE_BUCKET` (opcional — default `tijuquinha-images`)
4. Clique em **Deploy**. Em ~1 minuto a URL pública (`https://tijuquinha-slides.vercel.app` ou similar) fica disponível.
5. Compartilhe a URL com sua colega — qualquer um com o link edita e vê as alterações em tempo real.

### Subindo pro GitHub (primeira vez)

```bash
git init
git add .
git commit -m "Apresentacao Tijuquinha editavel"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/tijuquinha-slides.git
git push -u origin main
```

> ⚠️ O `.env` está no `.gitignore` — o Vercel guarda as variáveis no painel dele, não no Git.

---

## Stack

- React 18 + Vite 5
- TailwindCSS 3
- lucide-react (ícones)
- html2canvas + jsPDF (exportação client-side)
- @supabase/supabase-js (Postgres + Storage + Realtime)
